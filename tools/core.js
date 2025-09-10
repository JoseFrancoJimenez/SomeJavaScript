'use strict';

/**
 * @module tools/core
 * @description Utility class for common operations.
 */
export default class Core {
  /**
   * @private
   * @static
   * @type {number}
   * @description Auto-incremented ID for generating unique strings.
   */
  static #auto_id = 0;

  /**
   * @static
   * @type {string}
   * @description Current locale, defaults to document lang or "en".
   */
  static locale = document.documentElement.lang || "en";

  /**
   * @static
   * @method mixin
   * @description Merges properties from one object into another.
   * @param {object} a - Target object to receive properties.
   * @param {object} b - Source object with properties to merge.
   * @returns {object} Target object with merged properties.
   * @example
   * const obj = Core.mixin({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }
   */
  static mixin(a, b) {
    for (let key in b) {
      if (b.hasOwnProperty(key)) a[key] = b[key];
    }

    return a;
  }

  /**
   * @static
   * @method debounce
   * @description Delays function execution until after a timeout.
   * @param {Function} delegate - Function to debounce.
   * @param {number} [threshold=100] - Timeout in milliseconds.
   * @returns {Function} Debounced function.
   * @example
   * const log = Core.debounce(() => console.log("Hi"), 200);
   * log(); // Logs "Hi" after 200ms
   */
  static debounce(delegate, threshold) {
    let timeout;

    return function debounced(...args) {
      function delayed() {
        delegate.apply(this, args);

        timeout = null;
      }

      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(delayed.bind(this), threshold || 100);
    };
  }

  /**
   * @static
   * @method next_id
   * @description Generates a unique ID with "auto_" prefix.
   * @returns {string} Unique ID (e.g., "auto_1").
   * @example
   * console.log(Core.next_id()); // "auto_1"
   */
  static next_id() {
    return `auto_${++Core.#auto_id}`;
  }

  /**
   * @static
   * @method current_id
   * @description Gets the most recent unique ID.
   * @returns {string} Last generated ID (e.g., "auto_1").
   * @example
   * Core.next_id(); console.log(Core.current_id()); // "auto_1"
   */
  static current_id() {
    return `auto_${Core.#auto_id}`;
  }

  /**
   * @static
   * @method link_label_to_input
   * @description Links a label to an input by setting matching IDs.
   * @param {HTMLElement} label - Label element.
   * @param {HTMLElement} input - Input element.
   * @example
   * const label = document.createElement("label");
   * const input = document.createElement("input");
   * Core.link_label_to_input(label, input); // Sets input.id and label.htmlFor
   */
  static link_label_to_input(label, input) {
    input.id = Core.next_id();
    label.htmlFor = Core.current_id();
  }

  /**
   * @static
   * @method wet_boew
   * @description Resolves when Wet-Boew framework is ready.
   * @returns {Promise<void>} Resolves when Wet-Boew is loaded or ready.
   * @example
   * Core.wet_boew().then(() => console.log("Wet-Boew ready"));
   */
  static wet_boew() {
    return new Promise((resolve) => {
      if (!window.wb) resolve();

      else if (window.wb.isReady) resolve();

      else $(document).on("wb-ready.wb", ev => resolve());
    });
  }

  /**
   * @static
   * @method localize_json
   * @description Localizes JSON object based on current locale.
   * @param {object} json - JSON object with en/fr keys.
   * @returns {object} Localized JSON object.
   * @example
   * const json = { text: { en: "Hello", fr: "Bonjour" } };
   * console.log(Core.localize_json(json)); // { text: "Hello" } if locale="en"
   */
  static localize_json(json) {
    function recursiveLocalize(obj) {
      // Iterate over all key-value pairs in the object
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];

          if (typeof value === 'object' && value !== null) {
            // If the value is an object, we check if it's a localizable object
            if ('en' in value || 'fr' in value) {
              // Use localize_value to get the localized string
              obj[key] = Core.localize_value(value);
            } else {
              // If it's not a localizable object, recurse deeper
              recursiveLocalize(value);
            }
          }

          // If it's a simple string, number or other type, leave it as-is
        }
      }
      return obj;
    }

    return recursiveLocalize(json);
  }

  /**
   * @static
   * @method localize_value
   * @description Gets localized value based on current locale.
   * @param {object} value - Object with locale keys or raw value.
   * @returns {string|object} Localized value or original if no locale.
   * @example
   * const val = { en: "Hello", fr: "Bonjour" };
   * console.log(Core.localize_value(val)); // "Hello" if locale="en"
   */
  static localize_value(value) {
    return value?.[Core.locale] || value;
  }

  /**
   * @static
   * @method localize_number
   * @description Formats a number based on locale.
   * @param {number} value - Number to format.
   * @param {string} [locale] - Locale to use (defaults to Core.locale).
   * @returns {string} Localized number string.
   * @example
   * console.log(Core.localize_number(1234.56)); // "1,234.56" if locale="en"
   */
  static localize_number(value, locale) {
    if (value == null) return null;

    var loc = (locale || Core.locale) == "en" ? "en-CA" : "fr-CA";

    return new Number(value).toLocaleString(loc);
  }

  /**
   * @static
   * @method localize_date_string
   * @description Formats a YYYY-MM-DD date string based on locale.
   * @param {string} dateString - Date in YYYY-MM-DD format.
   * @param {string} [locale] - Locale to use (defaults to Core.locale).
   * @returns {string} Localized date string.
   * @example
   * console.log(Core.localize_date_string("2023-01-15")); // "15-01-2023" if locale="fr"
   */
  static localize_date_string(dateString, locale) {
    locale = locale ?? Core.locale;

    if (locale === "en") return dateString;

    let [year, month, day] = dateString.split('-');

    return `${day}-${month}-${year}`;
  }
}