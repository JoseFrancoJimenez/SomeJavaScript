'use strict';

import WebComponent from "./base/web-component.js";

import Dom from "../tools/dom.js";

/**
 * @class CustomButton
 * @extends WebComponent
 * @description A button with dynamic label and icon, emits click events.
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
   */
  get icon() {
    return this.#icon;
  }

  /**
   * @setter
   * @param {boolean} value - Whether the button is disabled.
   * @description Toggles the disabled state and CSS class of the button.
   * @example
   * this.disabled = true; // Disables the button
   */
  set disabled(value){
    const isDisabled = Boolean(value);

    if (isDisabled) {
      this.elems.button.setAttribute("disabled", ""); // reflect as attribute
      Dom.toggle_css(this.elems.button, "disabled", true);
    } else {
      this.elems.button.removeAttribute("disabled");  // keep DOM clean
      Dom.toggle_css(this.elems.button, "disabled", false);
    }
  }

  /**
   * @getter
   * @returns {boolean} Whether the button is disabled.
   * @example
   * console.log(this.disabled); // Returns true if button is disabled
   */
  get disabled(){
    return this.elems.button.hasAttribute("disabled");
  }

  /**
   * @method initialize
   * @description Adds click event listener to emit "button-click".
   * @example
   * this.on("button-click", e => console.log(e.detail)); // { data: "Click Me" }
   */
  initialize() {
    this.addEventListener("click", (ev) =>
      this.emit("button-click", { data: this.label })
    );

    if(this.hasAttribute("disabled")){
      this.disabled = true;
    }
  }

  /**
   * @method processAttributeChange
   * @description Updates label or icon on attribute change.
   * @param {string} name - Changed attribute name.
   * @param {string|null} oldValue - Previous value.
   * @param {string|null} newValue - New value.
   * @example
   * this.setAttribute("label", "New Label"); // Updates label
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
   * @example
   * console.log(this.html()); // Returns button HTML
   */
  html() {
    return `<button handle="button">
                <label handle="label"></label>
                <i handle="icon"></i>
            </button>`;
  }
}

/**
 * @description Registers CustomButton as <somejs-button>.
 * @example
 * // HTML: <somejs-button label="Click Me" icon="fas fa-star"></somejs-button>
 */
WebComponent.register("somejs-button", CustomButton);