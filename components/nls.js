'use strict';

import Core from '../tools/core.js';

/**
 * @module components/base/nls
 * @class Nls
 * @description Manages localized strings for internationalization.
 */
export default class Nls {
  /**
   * @private
   * @type {object}
   * @description Stores localized strings by ID and locale.
   */
  #strings = {};

  /**
   * @constructor
   * @description Initializes with optional string array.
   * @param {string[][]} [strs] - Array of [id, lang, text] arrays.
   * @example
   * const nls = new Nls([["greeting", "en", "Hello"], ["greeting", "fr", "Bonjour"]]);
   */
  constructor(strs) {
    if (!strs) return;
    strs.forEach(str => this.add(str[0], str[1], str[2]));
  }

  /**
   * @method get
   * @description Retrieves localized string or number.
   * @param {string|number} value - String ID or number to localize.
   * @param {string[]} [subs] - Strings to substitute in text.
   * @param {string} [locale] - Locale (defaults to Core.locale).
   * @returns {string} Localized string or formatted number.
   * @example
   * this.get("greeting"); // Returns "Hello" if locale is "en"
   */
  get(value, subs, locale) {
    if (typeof value == 'number') return Nls.format_number(value, locale);
    return this.get_localized_string(value, subs, locale);
  }

  /**
   * @method get_localized_string
   * @description Retrieves localized string by ID.
   * @param {string} id - String ID.
   * @param {string[]} [subs] - Strings to substitute in text.
   * @param {string} [locale] - Locale (defaults to Core.locale).
   * @returns {string} Localized string.
   * @throws {Error} If string ID or locale is undefined.
   * @example
   * this.get_localized_string("greeting", [], "en"); // Returns "Hello"
   */
  get_localized_string(id, subs, locale) {
    const itm = this.#strings[id];
    if (!itm) throw new Error("Nls String '" + id + "' undefined. / La chaîne est indéfinie.");
    const txt = itm[(locale) ? locale : Core.locale];
    if (!txt) throw new Error("String does not exist for requested language. / La chaîne n'existe pas pour la langue demandée.");
    return this.replace_placeholders(txt, subs);
  }

  /**
   * @method add
   * @description Adds a localized string to the store.
   * @param {string} id - String ID.
   * @param {string} locale - Locale (e.g., "en", "fr").
   * @param {string} str - Localized text.
   * @example
   * this.add("greeting", "en", "Hello"); // Adds English greeting
   */
  add(id, locale, str) {
    if (!this.#strings[id]) this.#strings[id] = {};
    this.#strings[id][locale] = str;
  }

  /**
   * @method replace_placeholders
   * @description Replaces placeholders in a string with values.
   * @param {string} str - Original string with placeholders.
   * @param {string[]} [subs] - Values to replace placeholders.
   * @returns {string} String with placeholders replaced.
   * @example
   * this.replace_placeholders("Hello {0}", ["World"]); // Returns "Hello World"
   */
  replace_placeholders(str, subs) {
    if (!subs || subs.length == 0) return str;
    let s = str;
    for (let i = 0; i < subs.length; i++) {
      let reg = new RegExp("\\{" + i + "\\}", "gm");
      s = s.replace(reg, subs[i]);
    }
    return s;
  }

  /**
   * @static
   * @method format_number
   * @description Formats a number based on locale.
   * @param {number} value - Number to format.
   * @param {string} [locale] - Locale (defaults to Core.locale).
   * @returns {string|null} Formatted number or null if invalid.
   * @example
   * Nls.format_number(1234.5, "en"); // Returns "1,234.5"
   */
  static format_number(value, locale) {
    if (value == null) return null;
    const loc = (locale || Core.locale) == "en" ? "en-CA" : "fr-CA";
    return new Number(value).toLocaleString(loc);
  }
}