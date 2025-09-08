import WebComponent from "./web-component.js";

/**
 * @class CustomButton
 * @extends WebComponent
 * @description A custom button with dynamic label and icon, supporting
 * attribute-based updates and click events.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components}
 */
export default class CustomButton extends WebComponent {
  /**
   * @private
   * @type {string}
   * @description Stores the button's label text.
   */
  #label;

  /**
   * @private
   * @type {string}
   * @description Stores the button's icon class.
   */
  #icon;

  /**
   * @static
   * @getter
   * @returns {string[]} Attributes to observe for changes.
   * @description Lists attributes the component monitors.
   */
  static get observedAttributes() {
    return ["label", "icon"];
  }

  /**
   * @setter
   * @param {string} value - New label text.
   * @description Updates button label in DOM.
   * @example
   * button.label = "Click Me"; // Updates <label> text
   */
  set label(value) {
    this.#label = value;
    this.elems.label.textContent = value;
  }

  /**
   * @getter
   * @returns {string} Current label text.
   * @description Gets the button's label text.
   */
  get label() {
    return this.#label;
  }

  /**
   * @setter
   * @param {string} value - New icon class.
   * @description Updates button icon class in DOM.
   * @example
   * button.icon = "fas fa-star"; // Sets <i> class
   */
  set icon(value) {
    this.#icon = value;
    this.elems.icon.className = value;
  }

  /**
   * @getter
   * @returns {string} Current icon class.
   * @description Gets the button's icon class.
   */
  get icon() {
    return this.#icon;
  }

  /**
   * @method initialize
   * @description Adds click event listener to emit "button-click" event.
   */
  initialize() {
    this.addEventListener("click", (ev) =>
      this.emit("button-click", { data: this.label }));
  }

  /**
   * @method processAttributeChange
   * @description Updates label or icon on attribute change.
   * @param {string} name - Changed attribute name.
   * @param {string|null} oldValue - Previous value.
   * @param {string|null} newValue - New value.
   */
  processAttributeChange(name, oldValue, newValue) {
    if (name === "label" && oldValue !== newValue) {
      this.label = newValue;
    }
    if (name === "icon" && oldValue !== newValue) {
      this.icon = newValue;
    }
  }

  /**
   * @method html
   * @description Defines button HTML with label and icon.
   * @returns {string} HTML template for the button.
   */
  html() {
    return `<button>
                <label handle="label"></label>
                <i handle="icon"></i>
            </button>`;
  }
}

/**
 * @description Registers CustomButton as <custom-button>.
 * @example
 * // HTML: <custom-button label="Click Me" icon="fas fa-star"></custom-button>
 */
WebComponent.register("custom-button", CustomButton);