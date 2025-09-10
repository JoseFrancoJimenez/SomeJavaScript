'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import WebComponent from '../base/web-component.js';

/**
 * @module ui/select
 * @class Select
 * @extends WebComponent
 * @description A dropdown select component with search and accessibility.
 */
export default class Select extends WebComponent {
  /**
   * @private
   * @type {Function}
   * @description Function to generate node content.
   */
  #fn_node;

  /**
   * @private
   * @type {Function}
   * @description Function to generate label text.
   */
  #fn_label;

  /**
   * @protected
   * @type {object[]}
   * @description Data store for dropdown items.
   */
  _store;

  /**
   * @private
   * @type {object[]}
   * @description Current filtered items in dropdown.
   */
  #items;

  /**
   * @private
   * @type {object|null}
   * @description Currently selected item.
   */
  #item;

  /**
   * @private
   * @type {object|null}
   * @description Currently active item in dropdown.
   */
  #active;

  /**
   * @private
   * @type {boolean}
   * @description Dropdown open state.
   */
  #is_open;

  /**
   * @private
   * @type {HTMLElement}
   * @description Dropdown container element.
   */
  #dropdown_container;

  /**
   * @private
   * @type {HTMLElement}
   * @description Dropdown root element.
   */
  #dropdown_root;

  /**
   * @private
   * @type {Function}
   * @description Resize event handler.
   */
  #resize_handler;

  /**
   * @getter
   * @returns {Function} Node generation function.
   */
  get fn_node() { return this.#fn_node; }

  /**
   * @setter
   * @param {Function} fn - Node generation function.
   */
  set fn_node(fn) { this.#fn_node = fn; }

  /**
   * @getter
   * @returns {Function} Label generation function.
   */
  get fn_label() { return this.#fn_label; }

  /**
   * @setter
   * @param {Function} fn - Label generation function.
   */
  set fn_label(fn) { this.#fn_label = fn; }

  /**
   * @getter
   * @returns {object[]} Data store for dropdown items.
   */
  get store() { return this._store; }

  /**
   * @setter
   * @param {object[]} value - Data to populate dropdown.
   * @description Updates store, fills dropdown, and selects first item.
   */
  set store(value) {
    this._store = this.make_store_nodes(value);
    this.fill(this._store, '');
    this.select_index(0);
  }

  /**
   * @getter
   * @returns {object[]} Current filtered items.
   */
  get items() { return this.#items; }

  /**
   * @setter
   * @param {object[]} value - Filtered items to set.
   */
  set items(value) { this.#items = value; }

  /**
   * @getter
   * @returns {object|null} Selected item.
   */
  get item() { return this.#item; }

  /**
   * @setter
   * @param {object|null} value - Item to select.
   * @description Updates selected item and aria attributes.
   */
  set item(value) {
    if (this.#item) this.#item.node.setAttribute("aria-selected", "false");
    this.#item = value;
    if (this.#item) this.#item.node.setAttribute("aria-selected", "true");
  }

  /**
   * @getter
   * @returns {object|null} Active item in dropdown.
   */
  get active() { return this.#active; }

  /**
   * @setter
   * @param {object|null} value - Item to activate.
   * @description Updates active item and aria attributes.
   */
  set active(value) {
    if (this.#active) {
      Dom.remove_css(this.#active.node, "active");
    }
    this.#active = value;
    if (this.#active) Dom.add_css(this.#active.node, "active");
    const id = value ? value.node.id : "";
    this.elems.input.setAttribute("aria-activedescendant", id);
  }

  /**
   * @getter
   * @returns {boolean} Dropdown open state.
   */
  get is_open() { return this.#is_open; }

  /**
   * @setter
   * @param {boolean} value - Open or close dropdown.
   */
  set is_open(value) { this.#is_open = value; }

  /**
   * @getter
   * @returns {HTMLElement} Dropdown container element.
   */
  get dropdown_container() { return this.#dropdown_container; }

  /**
   * @setter
   * @param {HTMLElement} value - Dropdown container element.
   */
  set dropdown_container(value) { this.#dropdown_container = value; }

  /**
   * @getter
   * @returns {HTMLElement} Dropdown root element.
   */
  get dropdown_root() { return this.#dropdown_root; }

  /**
   * @setter
   * @param {HTMLElement} value - Dropdown root element.
   */
  set dropdown_root(value) { this.#dropdown_root = value; }

  /**
   * @getter
   * @returns {Function} Resize event handler.
   */
  get resize_handler() { return this.#resize_handler; }

  /**
   * @setter
   * @param {Function} value - Resize event handler.
   */
  set resize_handler(value) { this.#resize_handler = value; }

  /**
   * @getter
   * @returns {object} First item in store.
   */
  get first() { return this.store[0].data; }

  /**
   * @getter
   * @returns {object} Last item in store.
   */
  get last() { return this.store[this.store.length - 1].data; }

  /**
   * @getter
   * @returns {object|null} Last selected item data.
   */
  get selected() { return this.#item?.data; }

  /**
   * @getter
   * @returns {string} Current label text.
   */
  get label() { return this.item && this.fn_label(this.item.data) || ""; }

  /**
   * @setter
   * @param {boolean} value - Disable or enable input.
   */
  set disabled(value) { this.elems.input.disabled = value; }

  /**
   * @getter
   * @returns {boolean} Input disabled state.
   */
  get disabled() { return this.elems.input.disabled; }

  /**
   * @setter
   * @param {string} value - Placeholder text for input.
   */
  set placeholder(value) { this.elems.input.setAttribute('placeholder', value); }

  /**
   * @setter
   * @param {string} value - Title attribute for input.
   */
  set title(value) { this.elems.input.setAttribute('title', value); }

  /**
   * @getter
   * @returns {HTMLElement} Input element.
   */
  get input() { return this.elems.input; }

  /**
   * @constructor
   * @description Initializes the select component.
   */
  constructor() {
    super();
  }

  /**
   * @method initialize
   * @description Sets up event listeners and dropdown elements.
   */
  initialize() {
    this.item = null;
    this.active = null;
    this.is_open = false;
    this.fn_label = (item) => item.label || "";
    this.fn_node = (item) => item.node || Dom.create("div", { innerHTML: this.fn_label(item) });
    this.cycle_when_closed = true;

    this.resize_handler = () => this.close_dropdown();
    this.elems.input.readOnly = true;

    this.dropdown_container = Dom.create("div", { className: "csge select-ui" });
    this.dropdown_root = Dom.create("span", { className: "input-select" }, this.dropdown_container);
    Dom.place(this.elems.list, this.dropdown_root);

    this.elems.input.addEventListener("keydown", (ev) => this.on_input_key_down_handler(ev));
    this.elems.list.addEventListener("keydown", (ev) => this.on_input_key_down_handler(ev));
    this.elems.input.addEventListener("focusout", (ev) => this.on_input_blur_handler(ev));
    this.dropdown_container.addEventListener("focusin", (ev) => this.elems.input.focus());
    this.elems.input.addEventListener("click", (ev) => this.on_input_click_handler(ev));
  }

  /**
   * @method empty
   * @description Clears the dropdown list.
   */
  empty() {
    Dom.empty(this.elems.list);
    this.items = [];
  }

  /**
   * @method refresh
   * @description Filters store items by search string.
   * @param {string} mask - Search string.
   * @returns {object[]} Filtered items.
   */
  refresh(value) {
    return this.store.filter(item => {
      const item_value = this.fn_label(item.data).toLowerCase();
      return item_value.includes(value.toLowerCase());
    });
  }

  /**
   * @method fill
   * @description Populates dropdown with filtered items.
   * @param {object[]} items - Items to display.
   * @param {string} mask - Search string for highlighting.
   */
  fill(items, mask) {
    this.items = items;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < items.length; i++) {
      const curr = items[i];
      this.decorate_list_content(curr.data, curr.content, mask);
      curr.next = items[(i + 1) % items.length];
      curr.next.prev = curr;
      Dom.place(curr.node, frag);
    }

    Dom.place(frag, this.elems.list);
  }

  /**
   * @method decorate_list_content
   * @description Highlights search matches in item content.
   * @param {object} item_data - Item data.
   * @param {HTMLElement} item_content - Item content element.
   * @param {string} value - Search string to highlight.
   */
  decorate_list_content(item_data, item_content, value) {
    const escapedMask = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const maskRegex = new RegExp(`(${escapedMask})`, 'i');
    item_content.innerHTML = this.fn_label(item_data).replace(maskRegex, '<b>$1</b>');
  }

  /**
   * @method close_dropdown
   * @description Closes the dropdown and removes resize listener.
   */
  close_dropdown() {
    Dom.toggle_css(this, "collapsed", true);
    Dom.remove(this.dropdown_container, document.body);
    window.removeEventListener("resize", this.resize_handler);
  }

  /**
   * @method open_dropdown
   * @description Opens the dropdown and adds resize listener.
   */
  open_dropdown() {
    Dom.toggle_css(this, "collapsed", false);
    Dom.place(this.dropdown_container, document.body);
    this.update_dropdown_position();
    window.addEventListener("resize", this.resize_handler);
  }

  /**
   * @method update_dropdown_position
   * @description Updates dropdown position relative to input.
   */
  update_dropdown_position() {
    if (this.is_open) {
      const rect = this.elems.input.getBoundingClientRect();
      this.dropdown_container.style.top = `${rect.bottom + window.scrollY}px`;
      this.dropdown_container.style.left = `${rect.left + window.scrollX}px`;
      this.dropdown_container.style.width = `${rect.width}px`;
    }
  }

  /**
   * @method select
   * @description Selects an item using a delegate function.
   * @param {Function} delegate - Function to find item.
   */
  select(delegate) {
    for (var i = 0; i < this.store.length; i++) {
      if (delegate(this.store[i].data, i)) break;
    }
    this.select_index(i);
  }

  /**
   * @method select_index
   * @description Selects item by index and updates input.
   * @param {number} i - Index of item to select.
   */
  select_index(i) {
    this.item = i == this.store.length ? null : this.store[i];
    this.elems.input.value = this.label;
  }

  /**
   * @method reset
   * @description Resets dropdown and input state.
   */
  reset() {
    this.active = null;
    this.is_open = false;
    this.empty();
    this.elems.input.value = this.label;
  }

  /**
   * @method on_input_click_handler
   * @description Toggles dropdown on input click.
   * @param {Event} ev - Click event.
   */
  async on_input_click_handler(ev) {
    if (this.is_open) {
      this.reset();
      this.close_dropdown();
    } else {
      this.is_open = true;
      this.open_dropdown();
      const items = await this.refresh("");
      this.fill(items, "");
      if (this.item) {
        this.active = this.item;
        this.scroll_to(this.active);
      }
    }
  }

  /**
   * @method on_input_key_down_handler
   * @description Handles keyboard navigation and selection.
   * @param {KeyboardEvent} ev - Keyboard event.
   */
  on_input_key_down_handler(ev) {
    if (ev.keyCode == 40 || ev.keyCode == 38 || ev.keyCode == 13 || ev.keyCode == 27) ev.preventDefault();
    if (ev.shiftKey == true && ev.keyCode == 38) this.elems.input.select();
    else if (ev.keyCode == 40 || ev.keyCode == 38) {
      if (!this.is_open && this.cycle_when_closed) {
        let next = this.store[0];
        if (this.item) next = (ev.keyCode == 40) ? this.item.next : this.item.prev;
        this.on_li_click_handler(next, ev);
        return;
      }
      if (!this.items.length && !this.cycle_when_closed) return;
      if (!this.active) {
        this.active = (ev.keyCode == 40) ? this.items[0] : this.items[this.items.length - 1];
      } else {
        this.active = (ev.keyCode == 40) ? this.active.next : this.active.prev;
      }
      this.elems.input.value = this.fn_label(this.active.data);
      this.scroll_to(this.active);
    } else if (ev.keyCode == 13) {
      if (!this.is_open) this.on_input_click_handler();
      else if (this.active) this.on_li_click_handler(this.active, ev);
      else if (this.items.length > 0) this.on_li_click_handler(this.items[0], ev);
    } else if (ev.keyCode == 27) this.on_input_blur_handler();
  }

  /**
   * @method on_input_blur_handler
   * @description Resets and closes dropdown on blur.
   * @param {Event} ev - Focus event.
   */
  on_input_blur_handler(ev) {
    this.reset();
    this.close_dropdown();
  }

  /**
   * @method on_li_click_handler
   * @description Updates selection and emits change event on item click.
   * @param {object} item - Selected item.
   * @param {Event} ev - Click event.
   */
  on_li_click_handler(item, ev) {
    if (ev != undefined) ev.preventDefault();
    const current = this.item;
    this.item = item;
    this.reset();
    this.close_dropdown();
    if (this.item !== current) {
      this.emit("select-change", { item: this.item.data });
    }
  }

  /**
   * @method scroll_to
   * @description Scrolls dropdown to show active item.
   * @param {object} item - Item to scroll to.
   */
  scroll_to(item) {
    const ul = this.elems.list;
    const liBx = item.node.getBoundingClientRect();
    const ulBx = ul.getBoundingClientRect();
    if (liBx.bottom > ulBx.bottom) ul.scrollTop = ul.scrollTop + liBx.bottom - ulBx.top - ulBx.height;
    else if (liBx.top < ulBx.top) ul.scrollTop = ul.scrollTop + liBx.top - ulBx.top;
  }

  /**
   * @method make_store_nodes
   * @description Creates store items with DOM nodes.
   * @param {object[]} value - Data for dropdown items.
   * @returns {object[]} Store items with nodes.
   */
  make_store_nodes(value) {
    let size = value.length;
    return value.map((i, index) => {
      const li = Dom.create("li", { tabIndex: -1 });
      li.setAttribute("role", "option");
      li.setAttribute("aria-setsize", size);
      li.setAttribute("aria-posinset", index + 1);
      li.setAttribute("aria-selected", "false");
      li.setAttribute("id", Core.next_id());
      Dom.add_css(li, "dropdown-item");
      const content = this.fn_node(i);
      li.appendChild(content);
      const item = { data: i, node: li, content: content, next: null, prev: null };
      li.addEventListener("mousedown", ev => this.on_li_click_handler(item, ev));
      return item;
    });
  }

  /**
   * @method html
   * @description Defines HTML for select input and dropdown.
   * @returns {string} HTML template for the component.
   */
  html() {
    return `<div handle='root' class='input-select'>
                <div class='input-container' handle='input_container'>
                    <input handle='input' type='text' role='combobox' title='nls(Input_Title)'>
                    <i handle='input_chevron' class='fa fa-chevron-down'></i>
                </div>
                <ul handle='list' class='dropdown-items list' role='listbox'></ul>
            </div>`;
  }

  /**
   * @method localize
   * @description Sets up English and French translations for input title.
   * @param {Nls} nls - Localization instance.
   */
  localize(nls) {
    nls.add("Input_Title", "en", "Click to select an option from the dropdown");
    nls.add("Input_Title", "fr", "Cliquez pour choisir une option dans la liste déroulante");
  }
}

/**
 * @description Registers Select as <somejs-select>.
 * @example
 * // HTML: <somejs-select></somejs-select>
 */
WebComponent.register("somejs-select", Select);