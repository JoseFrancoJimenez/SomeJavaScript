'use strict';

/**
 * @module components/list
 * @class List
 * @extends Array
 * @description A list with key-based indexing and item management.
 */
export default class List extends Array {
  /**
   * @private
   * @type {Function|null}
   * @description Function to generate item keys.
   */
  #fn_key;

  /**
   * @private
   * @type {Map}
   * @description Map for key-based item lookup.
   */
  #index;

  /**
   * @getter
   * @returns {Function|null} Key generation function.
   */
  get fn_key() { return this.#fn_key; }

  /**
   * @getter
   * @returns {Map} Key-item index map.
   */
  get index() { return this.#index; }

  /**
   * @getter
   * @returns {object|undefined} First item in the list.
   */
  get first() { return this[0]; }

  /**
   * @getter
   * @returns {object|undefined} Last item in the list.
   */
  get last() { return this[this.length - 1]; }

  /**
   * @constructor
   * @description Initializes the list with optional key function and items.
   * @param {Function} [fn_key] - Function to generate item keys.
   * @param {object[]} [items] - Initial items for the list.
   * @example
   * const list = new List(item => item.id, [{ id: 1 }, { id: 2 }]);
   */
  constructor(fn_key, items) {
	// When the list auto creates another list (when using map or slice for example) it passes
	// the length of the array to the constructor. This is documented in the Array reference on MDN
	// Here we handle that case so that our list can work with an empty key function and items array.

	// In the auto case, fn_key will be equal to the length of the array. We overwrite with null
	// so the class knows it doesn't have a key function.
    if (arguments.length == 1 && typeof arguments[0] == 'number') fn_key = undefined;
    super();
    this.#fn_key = fn_key ?? null;
    this.#index = new Map();
    if (items) items.forEach(i => this.add(i));
  }

  /**
   * @method key
   * @description Gets the key for an item using the key function.
   * @param {object} item - List item.
   * @returns {number|string} Item key.
   * @example
   * this.key({ id: 1 }); // Returns 1
   */
  key(item) {
    return this.fn_key(item);
  }

  /**
   * @method get
   * @description Retrieves an item by its key.
   * @param {string|number} key - Key to look up.
   * @returns {object|null} Item matching the key or null.
   * @example
   * this.get(1); // Returns item with key 1
   */
  get(key) {
    return this.index.get(key) ?? null;
  }

  /**
   * @method has
   * @description Checks if a key exists in the list.
   * @param {string|number} key - Key to check.
   * @returns {boolean} True if key exists, false otherwise.
   * @example
   * this.has(1); // Returns true if key 1 exists
   */
  has(key) {
    return this.index.has(key);
  }

  /**
   * @method has_item
   * @description Checks if an item exists in the list by its key.
   * @param {object} item - Item to check.
   * @returns {boolean} True if item exists, false otherwise.
   * @example
   * this.has_item({ id: 1 }); // Returns true if item exists
   */
  has_item(item) {
    return this.has(this.key(item));
  }

  /**
   * @method add
   * @description Adds an item to the list if not already present.
   * @param {object} item - Item to add.
   * @returns {object} Added or existing item.
   * @example
   * this.add({ id: 1 }); // Adds item with key 1
   */
  add(item) {
    if (this.fn_key) {
      const key = this.key(item);
      if (this.has(key)) return this.get(key);
      this.index.set(key, item);
    }
    this.push(item);
    return item;
  }

  /**
   * @method add_many
   * @description Adds multiple items to the list.
   * @param {object[]} items - Items to add.
   * @example
   * this.add_many([{ id: 1 }, { id: 2 }]); // Adds multiple items
   */
  add_many(items) {
    items.forEach(item => this.add(item));
  }

  /**
   * @method remove
   * @description Removes an item from the list by its key.
   * @param {object} item - Item to remove.
   * @returns {object|null} Removed item or null if not found.
   * @example
   * this.remove({ id: 1 }); // Removes item with key 1
   */
  remove(item) {
    if (this.fn_key) {
      const key = this.key(item);
      if (!this.has(key)) return null;
      item = this.get(key);
      this.index.delete(key);
    }
    const i = this.indexOf(item);
    if (i == -1) return null;
    this.splice(i, 1);
    return item;
  }

  /**
   * @method empty
   * @description Clears the list and index map.
   * @example
   * this.empty(); // Removes all items and clears index
   */
  empty() {
    this.length = 0;
    this.#index = new Map();
  }

  /**
   * @method map
   * @description Applies a mapping function to create a new list.
   * @param {Function} fn_map - Mapping function.
   * @param {Function} [fn_index] - Key function for new list.
   * @returns {List} New list with mapped items.
   * @example
   * this.map(item => ({ id: item.id }), item => item.id);
   */
  map(fn_map, fn_index) {
    return new List(fn_index, super.map(fn_map));
  }

  /**
   * @method filter
   * @description Filters the list using a function.
   * @param {Function} fn_filter - Filter function.
   * @returns {List} New filtered list.
   * @example
   * this.filter(item => item.id > 1); // Returns filtered list
   */
  filter(fn_filter) {
    return new List(this.fn_key, super.filter(fn_filter));
  }

  /**
   * @method make_index
   * @description Creates a new index map with a key function.
   * @param {Function} fn_key - Key function for indexing.
   * @returns {Map} New index map.
   * @example
   * this.make_index(item => item.name); // Creates index by name
   */
  make_index(fn_key) {
    const index = new Map();
    for (let i = 0; i < this.length; i++) {
      let item = this[i];
      let key = fn_key(item);
      index.set(key, item);
    }
    return index;
  }
}