'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Select from './select.js';
import WebComponent from '../base/web-component.js';

/**
 * @module ui/typeahead
 * @class Typeahead
 * @extends Select
 * @description A typeahead component for filtering items as user types.
 */
export default class Typeahead extends Select {
  /**
   * @private
   * @type {number}
   * @description Minimum characters for search.
   */
  #matches;

  /**
   * @private
   * @type {boolean}
   * @description Handles behavior for minimum characters.
   */
  #handle_min_characters;

  /**
   * @getter
   * @returns {object[]} Data store for typeahead items.
   */
  get store() { return this._store; }

  /**
   * @setter
   * @param {object[]} value - Data to populate typeahead.
   * @description Creates store nodes from data.
   */
  set store(value) { this._store = this.make_store_nodes(value); }

  /**
   * @getter
   * @returns {number} Minimum characters for search.
   */
  get min_characters() { return this.#matches; }

  /**
   * @setter
   * @param {number} value - Minimum characters for search.
   */
  set min_characters(value) { this.#matches = value; }

  /**
   * @getter
   * @returns {boolean} Handle minimum characters behavior.
   */
  get handle_min_characters() { return this.#handle_min_characters; }

  /**
   * @setter
   * @param {boolean} value - Enable/disable min characters handling.
   */
  set handle_min_characters(value) { this.#handle_min_characters = value; }

  /**
   * @constructor
   * @description Initializes the typeahead component.
   * @param {HTMLElement} container - Container element.
   * @param {object[]} store - Data store for items.
   */
  constructor(container, store) {
    super(container, store);
  }

  /**
   * @method initialize
   * @description Sets up typeahead with input and debounced handler.
   */
  initialize() {
    super.initialize();
    this.items = [];
    this.matches = 2;
    this.handle_min_characters = true;
    this.elems.input.readOnly = false;
    Dom.add_css(this, "typeahead");
    const handler = ev => this.on_input_input_handler(ev);
    this.elems.input.addEventListener("input", Core.debounce(handler, 350));
  }

  /**
   * @method reset
   * @description Resets typeahead and selects input text.
   */
  reset() {
    super.reset();
    this.elems.input.setSelectionRange(0, this.elems.input.value.length);
  }

  /**
   * @method on_input_input_handler
   * @description Updates dropdown based on input value.
   * @param {Event} ev - Input event.
   */
  async on_input_input_handler(ev) {
    var value = ev.target.value;
    if (value.length < this.min_characters) {
      if (!this.handle_min_characters) return;
      value = "";
    }
    this.empty();
    const items = await this.refresh(value);
    this.active = null;
    this.fill(items, value);
    if (this.items.length) {
      this.open_dropdown();
    } else {
      this.close_dropdown();
    }
  }

  /**
   * @method on_input_click_handler
   * @description Toggles dropdown and filters items on click.
   * @param {Event} ev - Click event.
   */
  async on_input_click_handler(ev) {
    if (this.is_open) {
      this.reset();
      this.close_dropdown();
    } else {
      this.is_open = true;
      var value = this.elems.input.value;
      if (value.length < this.min_characters) {
        if (!this.handle_min_characters) return;
        value = "";
      }
      value = !!this.item ? "" : this.elems.input.value;
      const items = await this.refresh(value);
      if (items.length == 0) this.elems.input.value = value;
      else {
        this.fill(items, value);
        this.open_dropdown();
        if (this.item) {
          this.active = this.item;
          this.scroll_to(this.item);
        }
      }
    }
  }

  /**
   * @method localize
   * @description Sets up English and French input title translations.
   * @param {Nls} nls - Localization instance.
   */
  localize(nls) {
    nls.add("Input_Title", "en", "A filtered list appears as you type.");
    nls.add("Input_Title", "fr", "Une liste filtrée apparaît en tapant.");
  }
}

/**
 * @description Registers Typeahead as <somejs-typeahead>.
 * @example
 * // HTML: <somejs-typeahead></somejs-typeahead>
 */
WebComponent.register("somejs-typeahead", Typeahead);