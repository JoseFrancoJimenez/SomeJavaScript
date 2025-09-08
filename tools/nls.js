import Core from "./core.js";

/**
 * Nls module
 * @module components/tools/nls
 */
export default class Nls {

    #strings = {};

    /**
     * Initialize class with given strings
     * @param {string[][]} strs - Array of 3 string arrays for nls (id, lang, localized text)
     * @returns {void}
     */
    constructor(strs) {
        if (!strs) return;

        strs.forEach(str => this.add(str[0], str[1], str[2]));
    }

    get(value, subs, locale) {
        if (typeof value == 'number') return Nls.format_number(value, locale);

        return this.get_localized_string(value, subs, locale);
    }

    /**
     * retrieve a localized nls string
     * @param {string} id - id of nls string
     * @param {string[]} subs - an array of Strings to substitute in the localized nls string resource
     * @param {string} locale - locale for the nls resource (core used if null)
     * @returns {string} localized string
     */
    get_localized_string(id, subs, locale) {
        const itm = this.#strings[id];

        if (!itm) throw new Error("Nls String '" + id + "' undefined");

        const txt = itm[(locale) ? locale : Core.locale];

        if (!txt) throw new Error("String does not exist for requested language");

        return this.replace_placeholders(txt, subs);
    }

    /**
     * add specified string info to nls string object
     * @param {string} id - id of string
     * @param {string} locale - locale setting (en/fr)
     * @param {string} str - text for locale
     * @returns {void}
     */
    add(id, locale, str) {
        if (!this.#strings[id]) this.#strings[id] = {};

        this.#strings[id][locale] = str;
    }

    /**
     * replace placeholders (ex. {1} {2} {3}) in a string with the corresponding values from an array
     * @param {String} str - original string
     * @param {string[]} subs - array of strings to be substituted
     * @returns {string} updated string
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
     * Apply localization to a numeric value
     * @param {number} value - number to be localized
     * @param {string} locale - current locale (ex. en | fr). Core locale is used if none provided.
     * @returns {string} number formatted as string (ex. 1,234.5 | 1 234,5)
     */
    static format_number(value, locale) {

        if (value == null) return null;

        // translate our locale to a BCP 47 language tag
        const loc = (locale || Core.locale) == "en" ? "en-CA" : "fr-CA";

        return new Number(value).toLocaleString(loc);
    }

};

