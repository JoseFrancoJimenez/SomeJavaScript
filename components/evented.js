'use strict';

import Core from '../tools/core.js';

/**
 * @module components/base/evented
 * @class Evented
 * @description Provides event handling for emitting and listening to events.
 */
export default class Evented {
  /**
   * @private
   * @type {object}
   * @description Stores event listeners by type.
   */
  #listeners;

  /**
   * @getter
   * @returns {object} Event listeners by type.
   */
  get listeners() { return this.#listeners; }

  /**
   * @constructor
   * @description Initializes event listeners object.
   * @example
   * const evented = new Evented();
   */
  constructor() {
    this.#listeners = {};
  }

  /**
   * @method #add_listener
   * @private
   * @description Adds a listener for an event type.
   * @param {string} type - Event type (e.g., "click").
   * @param {Function} callback - Callback function.
   * @param {boolean} once - If true, listener is single-use.
   * @param {object} [origin] - Event origin.
   * @returns {object} Listener object.
   */
  #add_listener(type, callback, once, origin) {
    if (!(type in this.listeners)) this.#listeners[type] = [];
    const h = { target: this, type: type, callback: callback, once: !!once, origin: origin || null };
    this.#listeners[type].push(h);
    return h;
  }

  /**
   * @method #remove_listener
   * @private
   * @description Removes a listener for an event type.
   * @param {string} type - Event type (e.g., "click").
   * @param {Function} callback - Callback function to remove.
   */
  #remove_listener(type, callback) {
    let stack = this.listeners[type] || [];
    for (let i = 0, l = stack.length; i < l; i++) {
      if (stack[i].callback === callback) {
        stack.splice(i, 1);
        return this.#remove_listener(type, callback);
      }
    }
  }

  /**
   * @method #dispatch_event
   * @private
   * @description Calls listeners for an event and removes one-time listeners.
   * @param {object} event - Event object.
   * @param {object} [origin] - Event origin.
   */
  #dispatch_event(event, origin) {
    let stack = this.listeners[event.type] || [];
    for (let i = 0; i < stack.length; i++) {
      if (!!stack[i].origin && origin === stack[i].origin) continue;
      stack[i].callback.call(this, event);
    }
    for (let i = stack.length - 1; i >= 0; i--) {
      if (!!stack[i].once) this.#remove_listener(event.type, stack[i].callback);
    }
  }

  /**
   * @method emit
   * @description Emits an event with optional data.
   * @param {string} type - Event type (e.g., "click").
   * @param {object} [data] - Data to include in event.
   * @param {object} [origin] - Event origin.
   * @example
   * this.emit("click", { value: 1 }); // Emits click event
   */
  emit(type, data, origin) {
    const event = { bubbles: true, cancelable: true };
    Core.mixin(event, data);
    event.type = type;
    event.target = this;
    this.#dispatch_event(event, origin);
  }

  /**
   * @method on
   * @description Adds a persistent event listener.
   * @param {string} type - Event type (e.g., "click").
   * @param {Function} callback - Callback function.
   * @param {object} [origin] - Event origin.
   * @returns {object} Listener object.
   * @example
   * this.on("click", () => console.log("Clicked")); // Adds listener
   */
  on(type, callback, origin) {
    return this.#add_listener(type, callback, false, origin);
  }

  /**
   * @method once
   * @description Adds a one-time event listener.
   * @param {string} type - Event type (e.g., "click").
   * @param {Function} callback - Callback function.
   * @param {object} [origin] - Event origin.
   * @returns {object} Listener object.
   * @example
   * this.once("click", () => console.log("Clicked once")); // Adds one-time listener
   */
  once(type, callback, origin) {
    return this.#add_listener(type, callback, true, origin);
  }

  /**
   * @method off
   * @description Removes an event listener.
   * @param {string} type - Event type (e.g., "click").
   * @param {object} handler - Handler object with callback.
   * @example
   * const handler = this.on("click", fn); this.off("click", handler);
   */
  off(type, handler) {
    this.#remove_listener(type, handler.callback);
  }
}