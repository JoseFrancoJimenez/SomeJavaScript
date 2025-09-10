'use strict';

import WebComponent from '../base/web-component.js';
import Dom from '../../tools/dom.js';
import List from '../../components/list.js';

/**
 * @module widgets/waiting
 * @class wWaiting
 * @extends WebComponent
 * @description A web component to display a waiting state for widgets.
 */
export default class wWaiting extends WebComponent {
  /**
   * @method initialize
   * @description Initializes the waiting list and sets default message.
   */
  initialize() {
    // Initialize the list to manage busy widgets
    this.waiting_list = new List(item => item.widget);

    // waiting_label is the default message. If widgets send a message when emitting 'busy,'
    // that message will be shown; otherwise, the default message is displayed.
    this.elems.label.innerHTML = this.nls.get("waiting_label");

    //this.hide();
  }

  /**
   * @method handle_widget
   * @description Handles busy and idle events for a widget.
   * @param {WebComponent} widget - The widget to monitor.
   */
  handle_widget(widget) {
    widget.on("busy", (ev) => {
      this.waiting_list.add({ widget: ev.target, message: ev.message });

      this.elems.label.innerHTML = ev.message ?? this.nls.get("waiting_label");

      this.show();
    });

    widget.on("idle", (ev) => {
      this.waiting_list = this.waiting_list.filter(item => item.widget != ev.target);

      if (!this.waiting_list.length) this.hide();

      else this.elems.label.innerHTML = this.waiting_list.last.message ?? this.nls.get("waiting_label");
    });
  }

  /**
   * @method handle_widgets
   * @description Sets up busy/idle event listeners for multiple widgets.
   * @param {WebComponent[]} widgets - Array of widgets to monitor.
   */
  handle_widgets(widgets) {
    widgets.forEach(w => this.handle_widget(w));
  }

  /**
   * @method show
   * @description Shows the waiting widget by removing hidden class.
   */
  show() {
    Dom.remove_css(this, "hidden");
  }

  /**
   * @method hide
   * @description Hides the waiting widget by adding hidden class.
   */
  hide() {
    Dom.add_css(this, "hidden");
  }

  /**
   * @method html
   * @description Defines HTML for the waiting widget.
   * @returns {string} HTML string for component template.
   */
  html() {
    return `<div class='hidden waiting'>
               <label handle='label'></label>
               <i class='fa fa-circle-o-notch fa-spin'></i>
           </div>`;
  }

  /**
   * @method localize
   * @description Sets up English and French translations for label.
   * @param {Nls} nls - Localization instance.
   */
  localize(nls) {
    nls.add("waiting_label", "en", "Working...");
    nls.add("waiting_label", "fr", "Chargement...");
  }
}

/**
 * @description Registers wWaiting as <somejs-map-wait>.
 * @example
 * // HTML: <somejs-map-wait></somejs-map-wait>
 */
WebComponent.register("somejs-map-wait", wWaiting);