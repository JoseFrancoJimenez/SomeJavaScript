'use strict';

import WebComponent from "./web-component.js";

/**
 * @class Application
 * @extends WebComponent
 * @description Base class for web applications, extends WebComponent.
 * Manages widget error handling and application failure.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components}
 */
export default class Application extends WebComponent {
  /**
   * @constructor
   * @description Initializes the component, checks for static "tag" property.
   * @throws {Error} If static "tag" property is not defined.
   */
  constructor() {
    super();
    const ctor = this.constructor;
    if (!Object.prototype.hasOwnProperty.call(ctor, "tag")) {
      throw new Error(`${ctor.name} must define a static property "tag". The tag property is used to register the app as web component`);
    }
  }

  /**
   * @method handle_errors
   * @description Adds error event handlers to an array of widgets.
   * @param {object[]} widgets - Array of widget instances.
   * @example
   * // Widgets throw errors
   * app.handle_errors([widget1, widget2]);
   */
  handle_errors(widgets) {
    widgets.forEach(w => this.handle_error(w));
  }

  /**
   * @method handle_error
   * @description Adds error event handler to a single widget.
   * @param {object} widget - Widget instance.
   * @example
   * // Widget throw error
   * app.handle_error(widget);
   */
  handle_error(widget) {
    widget.on("error", error => this.on_application_error(error));
  }

  /**
   * @method on_application_error
   * @description Handles widget-level errors. Override in subclasses.
   * @param {*} error - Error object or message.
   * @example
   * // Subclass override
   * on_application_error(error) { console.log(error.message); }
   */
  on_application_error(error) {
    Application.Fail(error);
  }

  /**
   * @static
   * @method Fail
   * @description Shows alert, logs error, and stops execution.
   * @param {*} error - Error object or message.
   * @example
   * Application.Fail(new Error("Server error"));
   * // Alerts and logs error, then throws
   */
  static Fail(error) {
    if (error.name === "request:server") {
      error.message = `The data portal is currently unavailable as we work on some improvements. We apologize for the inconvenience and appreciate your patience. Please try again later.\r\n\r\nLe portail de données est actuellement indisponible pendant que nous effectuons des améliorations. Nous nous excusons pour le dérangement et apprécions votre patience. Veuillez réessayer plus tard.`;
    }

    alert(error.message);
    console.error(error);
    throw error; // Prevents further execution
  }
}