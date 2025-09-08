import Nls from "../tools/nls.js";
import Core from "../tools/core.js";

/**
 * @class WebComponent
 * @extends HTMLElement
 * @description Base class for custom web components. Provides functionality for template rendering, localization, named node management, and custom event handling.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements}
 */
export default class WebComponent extends HTMLElement {
  /**
   * @private
   * @type {Object.<string, HTMLElement>}
   * @description Stores elements with a "handle" attribute for easy access.
   */
  #elems;

  /**
   * @private
   * @type {Nls}
   * @description Localization instance for managing translated strings.
   */
  #nls;

  /**
   * @private
   * @type {HTMLTemplateElement}
   * @description Template element containing the component's rendered content.
   */
  #template;

  /**
   * @private
   * @type {boolean}
   * @description Indicates whether named nodes have been initialized.
   */
  #namedNodesReady;

  /**
   * @getter
   * @returns {Object.<string, HTMLElement>} Object containing named elements.
   * @description Provides access to elements with a "handle" attribute.
   */
  get elems() { return this.#elems; }

  /**
   * @getter
   * @returns {Nls} The localization instance.
   * @description Provides access to the Nls instance for string localization.
   */
  get nls() { return this.#nls; }

  /**
   * @getter
   * @returns {HTMLTemplateElement} The template for rendering the component.
   * @description Provides access to the template element.
   */
  get template() { return this.#template; }

  /**
   * @getter
   * @returns {boolean} True if named nodes are initialized, false otherwise.
   * @description Indicates whether named nodes are ready for use.
   */
  get namedNodesReady() { return this.#namedNodesReady; }

  /**
   * @static
   * @getter
   * @returns {string[]} Array of attribute names to observe for changes.
   * @description Defines attributes that subclasses should monitor for changes.
   * @example
   * // Subclass example
   * static get observedAttributes() {
   *   return ["alias", "name"];
   * }
   */
  static get observedAttributes() {
    return [];
  }

  /**
   * @constructor
   * @description Initializes the component, setting up elements storage, localization, and template.
   */
  constructor() {
    super();

    this.#elems = {};
    this.#namedNodesReady = false;

    this.#nls = new Nls();
    this.localize(this.nls);

    this.#template = this.makeTemplate();
  }

  /**
   * @method makeTemplate
   * @description Creates a template from the html() method, replacing nls() placeholders with translated strings.
   * @returns {HTMLTemplateElement} The processed template element.
   * @example
   * // Assuming html() returns "<div>nls(welcome)</div>" and nls.get("welcome") returns "Hello"
   * const template = this.makeTemplate();
   * // template.innerHTML becomes "<div>Hello</div>"
   */
  makeTemplate() {
    const template = document.createElement("template");

    const html = this.html().replace(/nls\((.*?)\)/g,
      (_, match) => this.nls.get(match));

    template.innerHTML = html;

    return template;
  }

  /**
   * @method connectedCallback
   * @description Lifecycle callback invoked when the element is added to the DOM. Renders the template, sets named nodes, and initializes the component.
   */
  connectedCallback() {
    this.#namedNodesReady = false;

    this.render();

    this.setNamedNodes();

    this.initialize();
  }

  /**
   * @method render
   * @description Clears existing content and appends a cloned copy of the template content to the DOM.
   */
  render() {
    // Clear previous content safely
    while (this.firstChild) this.removeChild(this.firstChild);

    // Clone template content into the component
    const clone = this.template.content.cloneNode(true);

    this.appendChild(clone);

    this.classList.add("custom-component");
  }

  /**
   * @method setNamedNodes
   * @description Collects elements with a "handle" attribute into the elems object and emits a "named-nodes-ready" event.
   * @example
   * // For HTML: <div handle="header">Title</div><button handle="btn">Click</button>
   * this.setNamedNodes();
   * console.log(this.elems.header); // <div handle="header">Title</div>
   * this.on("named-nodes-ready", (e) => console.log(e.detail)); // { header: <div>, btn: <button> }
   */
  setNamedNodes() {
    // Collect elements with a "handle" attribute
    const named_nodes = this.querySelectorAll("[handle]");

    Array.from(named_nodes).forEach(n =>
      this.elems[n.getAttribute("handle")] = n);

    this.#namedNodesReady = true;

    this.emit("named-nodes-ready", { elems: this.elems });
  }

  /**
   * @method attributeChangedCallback
   * @description Lifecycle callback invoked when observed attributes change. Delegates to processAttributeChange when named nodes are ready.
   * @param {string} name - The name of the changed attribute.
   * @param {string|null} oldValue - The previous value of the attribute.
   * @param {string|null} newValue - The new value of the attribute.
   * @example
   * // Subclass with observedAttributes = ["alias"]
   * // HTML: <my-component alias="new"></my-component>
   * // Calls processAttributeChange when named nodes are ready
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.namedNodesReady) {
      this.processAttributeChange(name, oldValue, newValue);
    } else {
      // Defer until "named-nodes-ready" event is fired
      this.addEventListener("named-nodes-ready", () => {
        this.processAttributeChange(name, oldValue, newValue);
      }, { once: true });
    }
  }

  /**
   * @method processAttributeChange
   * @description Placeholder method for subclasses to handle attribute changes.
   * @param {string} name - The name of the changed attribute.
   * @param {string|null} oldValue - The previous value of the attribute.
   * @param {string|null} newValue - The new value of the attribute.
   * @example
   * // Subclass implementation
   * processAttributeChange(name, oldValue, newValue) {
   *   if (name === "alias") {
   *     this.elems.label.textContent = newValue;
   *   }
   * }
   */
  processAttributeChange(name, oldValue, newValue) {
    // Subclasses should override this method to handle specific attributes
  }

  /**
   * @method initialize
   * @description Placeholder method for subclasses to set up event listeners or modify DOM nodes after connection.
   * @example
   * // Subclass implementation
   * initialize() {
   *   this.elems.btn.addEventListener("click", () => this.emit("button-click"));
   * }
   */
  initialize() {
    // Subclasses should override this method for initialization logic
  }

  /**
   * @method html
   * @description Placeholder method for subclasses to define the component's HTML structure.
   * @returns {string} The HTML string for the component's template.
   * @example
   * // Subclass implementation
   * html() {
   *   return `<div handle="content">nls(welcome)</div>`;
   * }
   */
  html() {
    return "";
  }

  /**
   * @method localize
   * @description Placeholder method for subclasses to configure the Nls instance with translations.
   * @param {Nls} nls - The localization instance to configure.
   * @example
   * // Subclass implementation
   * localize(nls) {
   *   nls.set("welcome", "Hello, World!");
   * }
   */
  localize(nls) {
    // Subclasses should override this method to configure translations
  }

  /**
   * @method on
   * @description Attaches an event listener for the specified event.
   * @param {string} name - The name of the event to listen for.
   * @param {EventListener} callback - The callback function to handle the event.
   * @example
   * this.on("customEvent", (event) => console.log(event.detail));
   */
  on(name, callback) {
    this.addEventListener(name, callback);
  }

  /**
   * @method emit
   * @description Dispatches a custom event with optional data.
   * @param {string} name - The name of the custom event.
   * @param {Object} [data={}] - Optional event data, including detail, bubbles, and cancelable properties.
   * @example
   * // Emit event with data
   * this.emit("myEvent", { detail: { value: 42 }, bubbles: true });
   * // Emit simple event
   * this.emit("simpleEvent");
   */
  emit(name, data = {}) {
    let event = new CustomEvent(name, { detail: data });

    event = Core.mixin(event, data);

    this.dispatchEvent(event);
  }

  /**
   * @static
   * @method register
   * @description Registers the custom element with the provided tag name, preventing duplicate registrations.
   * @param {string} tag - The custom element tag name (e.g., "my-component").
   * @param {typeof WebComponent} clss - The class to register as a custom element.
   * @throws {Error} If the tag is already defined in the custom elements registry.
   * @example
   * // Register a custom element
   * WebComponent.register("my-component", MyComponent);
   */
  static register(tag, clss) {
    if (!customElements.get(tag)) {
      customElements.define(tag, clss);
    } else {
      throw new Error(`Component ${tag} is defined multiple times.`);
    }
  }
}