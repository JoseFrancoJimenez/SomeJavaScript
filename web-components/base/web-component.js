import Nls from "../../components/nls.js";
import Core from "../../tools/core.js";

/**
 * @class WebComponent
 * @extends HTMLElement
 * @description Base class for custom web components. Manages template
 * rendering, localization, named nodes, and custom events.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components}
 */
export default class WebComponent extends HTMLElement {
  /**
   * @private
   * @type {Object.<string, HTMLElement>}
   * @description Stores elements with "handle" attribute.
   */
  #elems;

  /**
   * @private
   * @type {Nls}
   * @description Localization instance for translated strings.
   */
  #nls;

  /**
   * @private
   * @type {HTMLTemplateElement}
   * @description Template for component's rendered content.
   */
  #template;

  /**
   * @private
   * @type {boolean}
   * @description Indicates if named nodes are initialized.
   */
  #namedNodesReady;

  /**
   * @getter
   * @returns {Object.<string, HTMLElement>} Named elements.
   * @description Access to elements with "handle" attribute.
   */
  get elems() { return this.#elems; }

  /**
   * @getter
   * @returns {Nls} Localization instance.
   * @description Access to Nls for string localization.
   */
  get nls() { return this.#nls; }

  /**
   * @getter
   * @returns {HTMLTemplateElement} Template for rendering.
   * @description Access to the component's template.
   */
  get template() { return this.#template; }

  /**
   * @getter
   * @returns {boolean} True if named nodes are ready.
   * @description Checks if named nodes are initialized.
   */
  get namedNodesReady() { return this.#namedNodesReady; }

  /**
   * @static
   * @getter
   * @returns {string[]} Attributes to observe.
   * @description Lists attributes for subclasses to monitor.
   * @example
   * static get observedAttributes() { return ["alias"]; }
   */
  static get observedAttributes() {
    return [];
  }

  /**
   * @constructor
   * @description Sets up elements, localization, and template.
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
   * @description Creates template from html(), replacing nls() with translations.
   * @returns {HTMLTemplateElement} Processed template element.
   * @example
   * // html() returns "<div>nls(welcome)</div>", nls.get("welcome") = "Hello"
   * const template = this.makeTemplate(); // <div>Hello</div>
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
   * @description Called when element is added to DOM. Renders template,
   * sets named nodes, and initializes component.
   */
  connectedCallback() {
    this.#namedNodesReady = false;

    this.render();

    this.setNamedNodes();

    this.initialize();
  }

  /**
   * @method render
   * @description Clears content and clones template into DOM.
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
   * @description Collects elements with "handle" into elems and emits event.
   * @example
   * // HTML: <div handle="header">Title</div>
   * this.setNamedNodes();
   * console.log(this.elems.header); // <div>Title</div>
   * this.on("named-nodes-ready", e => console.log(e.detail)); // { header: <div> }
   */
  setNamedNodes() {
    // Collect elements with a "handle" attribute
    const named_nodes = this.querySelectorAll("[handle]");

    Array.from(named_nodes).forEach(n =>{
      this.elems[n.getAttribute("handle")] = n;

      n.removeAttribute("handle");
    });

    this.#namedNodesReady = true;

    this.emit("named-nodes-ready", { elems: this.elems });
  }

  /**
   * @method attributeChangedCallback
   * @description Handles attribute changes, delegating to processAttributeChange.
   * @param {string} name - Changed attribute name.
   * @param {string|null} oldValue - Previous value.
   * @param {string|null} newValue - New value.
   * @example
   * // HTML: <my-component alias="new"></my-component>
   * // Calls processAttributeChange for "alias"
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
   * @method connectedMoveCallback
   * @description Placeholder to prevent connectedCallback on move.
   */
  connectedMoveCallback(){
    // empty but important so the connected callback does not trigger when the component is moved
  }
  
  /**
   * @method disconnectedCallback
   * @description Called each time the element is removed from the document.
   */
    disconnectedCallback(){
     
    }

  /**
   * @method processAttributeChange
   * @description Placeholder for subclasses to handle attribute changes.
   * @param {string} name - Changed attribute name.
   * @param {string|null} oldValue - Previous value.
   * @param {string|null} newValue - New value.
   * @example
   * processAttributeChange(name, oldValue, newValue) {
   *   if (name === "alias") this.elems.label.textContent = newValue;
   * }
   */
  processAttributeChange(name, oldValue, newValue) {
    // Subclasses should override this method to handle specific attributes
  }

  /**
   * @method initialize
   * @description Placeholder for subclasses to set up event listeners.
   * @example
   * initialize() {
   *   this.elems.btn.addEventListener("click", () => this.emit("click"));
   * }
   */
  initialize() {
    // Subclasses should override this method for initialization logic
  }

  /**
   * @method html
   * @description Placeholder for subclasses to define HTML structure.
   * @returns {string} HTML string for component template.
   * @example
   * html() { return `<div handle="content">nls(welcome)</div>`; }
   */
  html() {
    return "";
  }

  /**
   * @method localize
   * @description Placeholder for subclasses to configure Nls translations.
   * @param {Nls} nls - Localization instance to configure.
   * @example
   * localize(nls) { nls.set("welcome", "Hello, World!"); }
   */
  localize(nls) {
    // Subclasses should override this method to configure translations
  }

  /**
   * @method on
   * @description Attaches event listener for specified event.
   * @param {string} name - Event name to listen for.
   * @param {EventListener} callback - Function to handle event.
   * @example
   * this.on("customEvent", event => console.log(event.detail));
   */
  on(name, callback) {
    this.addEventListener(name, callback);
  }

  /**
   * @method emit
   * @description Dispatches custom event with optional data.
   * @param {string} name - Custom event name.
   * @param {Object} [data={}] - Event data (detail, bubbles, cancelable).
   * @example
   * this.emit("myEvent", { detail: { value: 42 }, bubbles: true });
   */
  emit(name, data = {}) {
    let event = new CustomEvent(name, { detail: data });

    event = Core.mixin(event, data);

    this.dispatchEvent(event);
  }

  /**
   * @static
   * @method register
   * @description Registers custom element, prevents duplicates.
   * @param {string} tag - Custom element tag name.
   * @param {typeof WebComponent} clss - Class to register.
   * @throws {Error} If tag is invalid or already defined.
   * @example
   * WebComponent.register("my-component", MyComponent);
   */
  static register(tag, clss) {
    if (!/^[a-z][a-z0-9._-]*-[a-z0-9._-]+$/.test(tag)) {
      throw new Error(
        `Invalid custom element name "${tag}" in ${ctor.name}.
        
        Requirements for "tag":
        • Must be all lowercase
        • Must contain at least one hyphen ("-")
        • May only include letters, digits, ".", "_", or "-"
        
        Example: "my-component", "app-card", "x-item"`
      );
    }
    
    if (!customElements.get(tag)) {
      customElements.define(tag, clss);
    } else {
      throw new Error(`Component ${tag} is defined multiple times.`);
    }
  }
}