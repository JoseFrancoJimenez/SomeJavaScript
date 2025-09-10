'use strict';

import Evented from './evented.js';
import Nls from './nls.js';

/**
 * @module components/base/component
 * @class Component
 * @extends Evented
 * @description Base class for evented components with localization.
 */
export default class Component extends Evented {
  /**
   * @constructor
   * @description Initializes component with an Nls instance.
   */
  constructor() {
    super();
    this.nls = new Nls();
    this.localize(this.nls);
  }

  /**
   * @method localize
   * @description Placeholder for adding localized strings to nls.
   * @param {Nls} nls - Localization instance.
   */
  localize(nls) {
    return;
  }
}