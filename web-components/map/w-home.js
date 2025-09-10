'use strict';

import WebComponent from "../base/web-component.js";
import Button from "../button.js";

/**
 * @class wHome
 * @extends WebComponent
 * @description A web component for a home button to reset map view.
 */
export default class wHome extends WebComponent{
  /**
   * @private
   * @type {object}
   * @description Stores the map instance.
   */
  #map;

  /**
   * @getter
   * @returns {object} The map instance.
   */
  get map() { return this.#map; }

  /**
   * @setter
   * @param {object} value - The map instance to set.
   */
  set map(value) { this.#map = value; }

  /**
   * @method initialize
   * @description Sets up click event listener for the button.
   */
  initialize() {
    this.elems.button.on("click", (ev) => this.on_button_click());
  }

  /**
   * @method on_button_click
   * @description Resets map view and updates button icon.
   */
  async on_button_click() {
    this.elems.button.icon = "esri-icon esri-icon-loading-indicator esri-rotating";

    await this.map.view.go_home();

    this.elems.button.icon = "esri-icon esri-icon-home";
  }

  /**
   * @method html
   * @description Defines HTML with a button for map home action.
   * @returns {string} HTML string for component template.
   */
  html() {
    return `<div class="home-widget toolbar-button">
                <somejs-button handle='button' title='nls(button_title)' icon="esri-icon esri-icon-home"></somejs-button>
            <div>`;
  }

  /**
   * @method localize
   * @description Sets up English and French translations for button title.
   * @param {Nls} nls - Localization instance.
   */
  localize(nls) {
    nls.add("button_title", "en", "Default map view");
    nls.add("button_title", "fr", "Vue cartographique par défaut");
  }
}

/**
 * @description Registers wHome as <somejs-map-home>.
 * @example
 * // HTML: <somejs-map-home></somejs-map-home>
 */
WebComponent.register("somejs-map-home", wHome);