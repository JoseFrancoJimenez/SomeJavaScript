'use strict';

import WebComponent from "../base/web-component.js";

/**
 * @module widgets/w-map
 * @class wMap
 * @extends WebComponent
 * @description A web component for displaying a map with a toolbar.
 */
export default class wMap extends WebComponent {
  /**
   * @private
   * @type {object}
   * @description Stores the map instance.
   */
  #map;

  /**
   * @private
   * @type {Array}
   * @description Stores the toolbar elements.
   */
  #toolbar;

  /**
   * @getter
   * @returns {object} The map instance.
   */
  get map() { return this.#map; }

  /**
   * @setter
   * @param {object} value - The map instance to set.
   * @description Assigns map and sets its view container.
   */
  set map(value) {
    this.#map = value;
    this.view.container = this.elems.map;
  }

  /**
   * @getter
   * @returns {Array} The toolbar elements.
   */
  get toolbar() { return this.#toolbar; }

  /**
   * @setter
   * @param {Array} value - The toolbar elements to set.
   */
  set toolbar(value) { this.#toolbar = value; }

  /**
   * @getter
   * @returns {object} The map view.
   */
  get view() { return this.map.view; }

  /**
   * @method initialize
   * @description Sets up the component, including toolbar configuration.
   * @todo Set up the toolbar using shadow DOM and slots.
   */
  initialize() {
    // todo: set up the toolbar here. I think we need to use a shadow dom to be able to transfer elements from another component.

    /*
        the idea is to do something like this from an external component:

        <somejs-map>
            <wait-widget position= "top-right">
            <overlay  postion= "manual">
        </somejs-map>

        then here with js do:
             this.toolbar = [each of those elements]

        that's normally achieved using shadow doms and slot elements. I tried but could not figure it out.
        we could probably use a mechanism that works with the light dom, but would required a bit more work on the base class, 
        so shadow dom would be the preference here.
    */
  }

  /**
   * @method html
   * @description Defines HTML with a map container.
   * @returns {string} HTML string for component template.
   */
  html() {
    return `
            <div handle='map' class='map-container'></div>
            `;
  }
}

/**
 * @description Registers wMap as <somejs-map>
 */
WebComponent.register("somejs-map", wMap);