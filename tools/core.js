'use strict';

/**
 * Core module
 * @module tools/core
 */
export default class Core {
    static locale = document.documentElement.lang || "en";
    static #auto_id = 0;

    /**
     * Merges an object into another object.
     * @param {object} a - Object that will receive the properties
     * @param {object} b - Object to merge into object A
     * @returns {object} combined object
     */
    static mixin(a, b) {
        for (let key in b) {
            if (b.hasOwnProperty(key)) a[key] = b[key];
        }
        return a;
    }

    /**
     * Debounces a function to ensure functions are only once per use case. The function will be executed
     * after a timeout unless the function is called again in which case, the timeout resets.
     * @param {object} delegate - The function to debounce
     * @param {number} threshold - The timeout length, in milliseconds
     * @returns {object} The debounced function
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
     * Generates unique strings from an autoincremented id. These can be used as ids for Dom elements.
     * @returns {string} Unique id in format "auto_x" where x is the incremented number.
     */
    static next_id() {
        return `auto_${++Core.#auto_id}`;
    }

    /**
     * Get the string id for the most recently generated id.
     * @returns {string} Unique id in format "auto_x" where x is the last generated number.
     */
    static current_id() {
        return `auto_${Core.#auto_id}`;
    }

    /**
     * Create the auto id for an input element and link a label to it
     * @param {object} label - label element
     * @param {object} input - input element
     * @returns {void}
     */
    static link_label_to_input(label, input) {
        input.id = Core.next_id();
        label.htmlFor = Core.current_id();
    }

    /**
     * Create promise to be resolved when wet boew template is loaded
     * @returns {object} promise object
     */
    static wet_boew() {
        return new Promise((resolve) => {
            if (!window.wb) resolve();
            else if (window.wb.isReady) resolve();
            else $(document).on("wb-ready.wb", ev => resolve());
        });
    }

    // Note this function will only localize those key-values that contain inner "en", "fr" keys
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
     * Localize the given value based on the current locale
     * @param {object} value - the value to be localized
     * @returns {object|string} localized value or the original value if no localization is available
     */
    static localize_value(value) {
        return value?.[Core.locale] || value;
    }

    /**
     * Localize the given number based on the specified or current locale
     * @param {number} value - the number to be localized
     * @param {string} locale - optional, the locale to use for localization
     * @returns {string} localized number string
     */
    static localize_number(value, locale) {
        if (value == null) return null;
        var loc = (locale || Core.locale) == "en" ? "en-CA" : "fr-CA";
        return new Number(value).toLocaleString(loc);
    }

    /**
     * Localize the given year-month-day date
     * @param {string} value - the date to be localized
     * @param {string} locale - optional, the locale to use for localization
     * @returns {string} localized date string
     */
    static localize_date_string(dateString, locale){
        locale = locale?? Core.locale;
        if(locale === "en") return dateString;
        let [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    }
}