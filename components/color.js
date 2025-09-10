'use strict';

/**
 * @module components/color
 * @class Color
 * @description Manages color data with conversions to various formats.
 */
export default class Color {
  /**
   * @private
   * @type {number[]}
   * @description Internal color array [r, g, b, a].
   */
  #array;

  /**
   * @getter
   * @returns {number[]} Color array [r, g, b, a].
   */
  get array() { return this.#array; }

  /**
   * @setter
   * @param {number[]} value - Color array [r, g, b, a].
   */
  set array(value) { this.#array = value; }

  /**
   * @getter
   * @returns {number} Red value (0-255).
   */
  get r() { return this.#array[0]; }

  /**
   * @setter
   * @param {number} value - Red value (0-255).
   */
  set r(value) { this.#array[0] = value; }

  /**
   * @getter
   * @returns {number} Green value (0-255).
   */
  get g() { return this.#array[1]; }

  /**
   * @setter
   * @param {number} value - Green value (0-255).
   */
  set g(value) { this.#array[1] = value; }

  /**
   * @getter
   * @returns {number} Blue value (0-255).
   */
  get b() { return this.#array[2]; }

  /**
   * @setter
   * @param {number} value - Blue value (0-255).
   */
  set b(value) { this.#array[2] = value; }

  /**
   * @getter
   * @returns {number} Alpha value (0-1).
   */
  get a() { return this.#array[3]; }

  /**
   * @setter
   * @param {number} value - Alpha value (0-1).
   */
  set a(value) { this.#array[3] = value; }

  /**
   * @constructor
   * @description Initializes a color with a 3 or 4 length array.
   * @param {number[]} array - Color array [r, g, b, a].
   * @throws {Error} If array length is not 3 or 4.
   * @example
   * const color = new Color([255, 0, 0, 1]); // Red with full opacity
   */
  constructor(array) {
    if (array.length != 3 && array.length != 4) throw new Error("Color objects require a 3 or 4 length array of numbers.");
    if (array.length == 3) array[3] = 1;
    this.array = array;
  }

  /**
   * @method to_hex
   * @description Converts color to hex format.
   * @returns {string} Hex color code (e.g., "#ff0000").
   * @example
   * this.to_hex(); // Returns "#ff0000" for red
   */
  to_hex() {
    return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
  }

  /**
   * @method to_rgb
   * @description Converts color to RGB format, ignoring alpha.
   * @returns {string} RGB color code (e.g., "rgb(255,0,0)").
   * @example
   * this.to_rgb(); // Returns "rgb(255,0,0)" for red
   */
  to_rgb() {
    return `rgb(${this.r},${this.g},${this.b})`;
  }

  /**
   * @method to_rgba
   * @description Converts color to RGBA format.
   * @param {number} [a] - Optional alpha override (0-1).
   * @returns {string} RGBA color code (e.g., "rgba(255,0,0,1)").
   * @example
   * this.to_rgba(0.5); // Returns "rgba(255,0,0,0.5)"
   */
  to_rgba(a) {
    const alpha = a != undefined ? a : this.a;
    return `rgba(${this.r},${this.g},${this.b},${alpha})`;
  }

  /**
   * @method to_color
   * @description Converts to a new Color instance.
   * @param {number} [a] - Optional alpha override (0-1).
   * @returns {Color} New Color instance.
   * @example
   * this.to_color(0.5); // Returns new Color with alpha 0.5
   */
  to_color(a) {
    return new Color(this.to_array(a));
  }

  /**
   * @method to_array
   * @description Converts color to array format.
   * @param {number} [a] - Optional alpha override (0-1).
   * @returns {number[]} Color array [r, g, b, a].
   * @example
   * this.to_array(); // Returns [255, 0, 0, 1]
   */
  to_array(a) {
    const copy = this.array.slice();
    if (a != undefined) copy[3] = a;
    return copy;
  }

  /**
   * @method to_esri
   * @description Converts to ESRI color object.
   * @param {number} [a] - Optional alpha override (0-1).
   * @returns {object} ESRI Color object.
   * @example
   * this.to_esri(); // Returns ESRI Color object
   */
  to_esri(a) {
    return new ESRI.lib.Color(this.to_array(a));
  }

  /**
   * @method toJSON
   * @description Returns color as JSON array.
   * @returns {number[]} Color array [r, g, b, a].
   * @example
   * this.toJSON(); // Returns [255, 0, 0, 1]
   */
  toJSON() {
    return this.to_array();
  }

  /**
   * @static
   * @method from_array
   * @description Creates a Color from an array.
   * @param {number[]} array - Color array [r, g, b, a].
   * @returns {Color} New Color instance.
   * @example
   * Color.from_array([255, 0, 0, 1]); // Creates red color
   */
  static from_array(array) {
    return new Color(array);
  }

  /**
   * @static
   * @method from_hex
   * @description Creates a Color from a hex code.
   * @param {string} hex - Hex color code (e.g., "#ff0000").
   * @param {number} [alpha] - Optional alpha value (0-1).
   * @returns {Color} New Color instance.
   * @example
   * Color.from_hex("#ff0000", 0.5); // Creates red with alpha 0.5
   */
  static from_hex(hex, alpha) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const array = [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
    if (alpha != undefined) array.push(alpha);
    return new Color(array);
  }

  /**
   * @static
   * @method from_rgb
   * @description Creates a Color from RGB/RGBA string.
   * @param {string} rgb - RGB/RGBA string (e.g., "rgb(255,0,0)").
   * @returns {Color} New Color instance.
   * @example
   * Color.from_rgb("rgb(255,0,0)"); // Creates red color
   */
  static from_rgb(rgb) {
    const array = rgb.replace(/rgba|rgb|\(|\)|/g, "")
      .split(",")
      .map(i => +i);
    return new Color(array);
  }
}