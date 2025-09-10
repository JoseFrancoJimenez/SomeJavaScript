'use strict';

import Typeahead from './typeahead.js';
import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import WebComponent from '../base/web-component.js';

/**
 * @module ui/typeahead/dynamic
 * @class DynamicTypeahead
 * @extends Typeahead
 * @description A dynamic typeahead fetching items from a function.
 */
export default class DynamicTypeahead extends Typeahead {
  /**
   * @getter
   * @returns {Function} Function to fetch store data.
   */
  get store_fn() { return this._store_fn; }

  /**
   * @setter
   * @param {Function} value - Function to fetch store data.
   */
  set store_fn(value) { this._store_fn = value; }

  /**
   * @constructor
   * @description Initializes the dynamic typeahead component.
   * @param {HTMLElement} container - Container element.
   * @param {object} options - Configuration options.
   */
  constructor(container, options) {
    super(container, options);
  }

  /**
   * @method initialize
   * @description Sets up dynamic typeahead with specific settings.
   */
  initialize() {
    super.initialize();
    this.min_characters = 3;
    this.handle_min_characters = false;
    this.cycle_when_closed = false;
    Dom.add_css(this, "dynamic");
  }

  /**
   * @method refresh
   * @description Fetches and sets store items based on search string.
   * @param {string} mask - Search string.
   * @returns {Promise<object[]>} Fetched store items.
   */
  async refresh(mask) {
    this.store = await this.store_fn(mask);
    return this.store;
  }
}

/**
 * @description Registers DynamicTypeahead as <somejs-dynamic-typeahead>.
 * @example
 * // HTML: <somejs-dynamic-typeahead></somejs-dynamic-typeahead>
 */
WebComponent.register("somejs-dynamic-typeahead", DynamicTypeahead);