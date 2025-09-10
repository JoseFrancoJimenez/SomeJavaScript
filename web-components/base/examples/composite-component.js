import WebComponent from "../web-component.js";

/**
 * @class CompositeComponent
 * @extends WebComponent
 * @description A composite web component with multiple HelloComponent
 * instances, using an alias attribute for custom greetings.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components}
 */
export default class CompositeComponent extends WebComponent {
  /**
   * @static
   * @property {string[]} observedAttributes
   * @description Attributes to observe for changes.
   */
  static observedAttributes = ["alias"];

  /**
   * @private
   * @type {string}
   * @description Stores alias for personalized greetings.
   */
  #alias;

  /**
   * @getter
   * @returns {string} Current alias value.
   * @description Gets alias for greeting message.
   */
  get alias() { return this.#alias; }

  /**
   * @setter
   * @param {string} value - New alias value.
   * @description Sets alias for greeting message.
   */
  set alias(value) { this.#alias = value; }

  /**
   * @constructor
   * @description Initializes component with default alias.
   */
  constructor() {   
    super();     
    this.alias = "Unknown";
  }

  /**
   * @method initialize
   * @description Sets up listeners for "button-click" from HelloComponent.
   * @example
   * // HTML: <somejs-composite-component alias="Alice"></somejs-composite-component>
   * // Clicking a button alerts, e.g., "Hello Alice...\npotato says hello"
   */
  initialize() { 
    this.elems.potato.addEventListener("button-click", (ev) =>
      this.sayHi(ev));
    this.elems.carrot.addEventListener("button-click", (ev) =>
      this.sayHi(ev));
    this.elems.pepper.addEventListener("button-click", (ev) =>
      this.sayHi(ev));
  }

  /**
   * @method sayHi
   * @description Shows alert with localized greeting using alias.
   * @param {CustomEvent} ev - Event with alias in detail.
   * @example
   * // With alias="Alice", ev.detail.alias="potato"
   * this.sayHi({ detail: { alias: "potato" } }); // Alerts "Hello Alice..."
   */
  sayHi(ev) {
    alert(this.nls.get("test_hi", [this.alias, ev.alias]));
  }

  /**
   * @method processAttributeChange
   * @description Updates alias when "alias" attribute changes.
   * @param {string} name - Changed attribute name.
   * @param {string|null} oldValue - Previous value.
   * @param {string|null} newValue - New value.
   * @example
   * // HTML: <somejs-composite-component alias="Alice"></somejs-composite-component>
   * // Sets this.alias to "Alice"
   */
  processAttributeChange(name, oldValue, newValue) {
    if (name === "alias") this.alias = newValue;
  }

  /**
   * @method html
   * @description Defines HTML with localized text and HelloComponent tags.
   * @returns {string} HTML string for component template.
   * @example
   * // Returns HTML with HelloComponent instances
   * const html = this.html();
   */
  html() {
    return `
            <div>nls(test_1)</div>
            <br>
            nls(potato):
            <hello-component handle="potato" alias="potato"></hello-component>
            <br>
            nls(carrot):
            <hello-component handle="carrot" alias="carrot"></hello-component>
            <br>
            nls(pepper):
            <hello-component handle="pepper" alias="pepper"></hello-component>
            `;
  }

  /**
   * @method localize
   * @description Sets up Nls with English and French translations.
   * @param {Nls} nls - Localization instance to configure.
   * @example
   * this.localize(this.nls);
   * console.log(this.nls.get("test_1", [], "en")); // "Hello, I am..."
   */
  localize(nls) {
    nls.add("test_1", "en", "Hello, I am the composite component, I have 3 hello components inside me");        
    nls.add("test_1", "fr", "Hello, I am the composite component, I have 3 hello components inside me");
    nls.add("potato", "en", "potato");
    nls.add("potato", "fr", "patate");
    nls.add("carrot", "en", "carrot");
    nls.add("carrot", "fr", "carotte");
    nls.add("pepper", "en", "pepper");
    nls.add("pepper", "fr", "poivron");
    nls.add("test_hi", "en", "Hello from composite, my name is {0}.\nYou've clicked a button in a hello component, {1} says hello");
    nls.add("test_hi", "fr", "Bonjour du composite, mon nom est {0}.\nVous avez cliqué sur un bouton dans un composant hello, {1} dit bonjour");
  }
}

/**
 * @description Registers CompositeComponent as <somejs-composite-component>.
 * @example
 * // HTML: <somejs-composite-component alias="Alice"></somejs-composite-component>
 */
WebComponent.register("somejs-composite-component", CompositeComponent);