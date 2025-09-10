import WebComponent from "../web-component.js";

/**
 * @class HelloComponent
 * @extends WebComponent
 * @description A custom web component with a greeting and button.
 * Supports localization and an alias attribute for greetings.
 * Emits an event on button click.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components}
 */
export default class HelloComponent extends WebComponent {
  /**
   * @private
   * @type {string}
   * @description Stores alias for personalized greetings.
   */
  #alias;

  /**
   * @setter
   * @param {string} value - New alias value.
   * @description Sets alias for greeting message.
   */
  set alias(value) { this.#alias = value; }

  /**
   * @getter
   * @returns {string} Current alias value.
   * @description Gets alias for greeting message.
   */
  get alias() { return this.#alias; }

  /**
   * @method initialize
   * @description Sets alias, updates greeting, and adds button click event.
   * @example
   * // HTML: <somejs-hello-component alias="Alice"></somejs-hello-component>
   * this.on("button-click", e => console.log(e.detail)); // { alias: "Alice" }
   * console.log(this.alias); // "Alice" or "potato" if unset
   */
  initialize() {
    // Set alias from attribute or default to "potato"
    this.alias = this.getAttribute("alias") || "potato";

    // Update greeting with localized string
    this.elems.innerDiv.textContent = this.nls.get("hi", [this.alias]);

    // Add click event to emit "button-click"
    this.elems.button.addEventListener("click", () => {
      this.sayHello();
      this.emit("button-click", { alias: this.alias });
    });
  }

  /**
   * @method sayHello
   * @description Shows alert with localized greeting using alias.
   * @example
   * // With alias="Alice", language="en"
   * this.sayHello(); // Alerts: "Alice says hello"
   */
  sayHello() {
    alert(this.nls.get("say_hello", [this.alias]));
  }

  /**
   * @method html
   * @description Defines HTML with div and button using localized text.
   * @returns {string} HTML string for component template.
   * @example
   * // Returns: <div class="test"><span handle="innerDiv">nls(hi)</span>...
   * const html = this.html();
   */
  html() {
    return `<div class="test">
                <span handle="innerDiv">nls(hi)</span>
                <button handle="button">nls(click_me)</button>
            </div>`;
  }

  /**
   * @method localize
   * @description Sets up Nls with English and French translations.
   * @param {Nls} nls - Localization instance to configure.
   * @example
   * this.localize(this.nls);
   * console.log(this.nls.get("hi", ["Alice"], "en")); // "I am the hello..."
   */
  localize(nls) {
    nls.add("hi", "en", "I am the hello component, my name is {0}");
    nls.add("hi", "fr", "Je suis le composant hello, mon nom est {0}");
    nls.add("click_me", "en", "click me!!!");
    nls.add("click_me", "fr", "clique moi!!!");
    nls.add("say_hello", "en", "{0} says hello");
    nls.add("say_hello", "fr", "{0} dit bonjour");
  }
  
}

/**
 * @description Registers HelloComponent as <somejs-hello-component>.
 * @example
 * // HTML: <somejs-hello-component alias="Alice"></somejs-hello-component>
 */
WebComponent.register("somejs-hello-component", HelloComponent);