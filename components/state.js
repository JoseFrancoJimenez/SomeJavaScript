'use strict';

import Evented from './evented.js';

/**
 * @module components/base/state
 * @class State
 * @extends Evented
 * @description Base class for application state with event handling.
 */
export default class State extends Evented {
  /**
   * @method initialize
   * @description Asynchronously initializes the application state.
   * @throws {Error} If not implemented by subclass.
   */
  async initialize() {
    throw new Error("initialize function must be implemented");
  }

  /**
   * @method emit
   * @description Emits an event with state in payload.
   * @param {string} event - Event name.
   * @param {object} origin - Event origin.
   * @example
   * this.emit("state-changed", origin); // Emits event with state
   */
  emit(event, origin) {
    super.emit(event, { state: this }, origin);
  }
}