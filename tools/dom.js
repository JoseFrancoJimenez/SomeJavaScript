'use strict';

import Core from './core.js';

/**
 * @module tools/dom
 * @description Utility class for DOM manipulation and CSS handling.
 */
export default class Dom {
  /**
   * @static
   * @method find_node
   * @description Finds the first element matching a selector.
   * @param {HTMLElement} parent_node - Parent node to search in.
   * @param {string} selector - CSS selector to match.
   * @returns {HTMLElement|null} First matching element or null.
   * @example
   * const div = Dom.find_node(document, ".my-class"); // First .my-class
   */
  static find_node(parent_node, selector) {
    return parent_node.querySelectorAll(selector).item(0) || null;
  }

  /**
   * @static
   * @method create
   * @description Creates an element with properties and optional parent.
   * @param {string} tag_name - Tag name (e.g., "div", "span").
   * @param {object} properties - Properties to assign to the element.
   * @param {HTMLElement} [parent_node] - Parent to append the element to.
   * @returns {HTMLElement} Created element.
   * @example
   * const div = Dom.create("div", { id: "myDiv" }, document.body);
   */
  static create(tag_name, properties, parent_node) {
    const elem = document.createElement(tag_name);

    Core.mixin(elem, properties);

    this.place(elem, parent_node);

    return elem;
  }

  /**
   * @static
   * @method place
   * @description Appends an element to a parent if provided.
   * @param {HTMLElement} elem - Element to append.
   * @param {HTMLElement} [parent_node] - Parent element.
   * @example
   * const div = document.createElement("div");
   * Dom.place(div, document.body); // Appends div to body
   */
  static place(elem, parent_node) {
    if (!!parent_node) parent_node.appendChild(elem);
  }

  /**
   * @static
   * @method remove
   * @description Removes an element from its parent if it is a child.
   * @param {HTMLElement} elem - Element to remove.
   * @param {HTMLElement} pNode - Parent node to remove from.
   * @example
   * const div = document.querySelector("#myDiv");
   * Dom.remove(div, document.body); // Removes div if child of body
   */
  static remove(elem, pNode) {
    // Convert the HTMLCollection to an array and check if `elem` is a direct child of `pNode`
    if (!Array.from(pNode.children).some(function(child) { return (child === elem); })) return;

    // Remove `elem` from `pNode`
    pNode.removeChild(elem);
  }

  /**
   * @static
   * @method empty
   * @description Removes all child nodes from an element.
   * @param {HTMLElement} elem - Element to empty.
   * @example
   * const div = document.querySelector("#myDiv");
   * Dom.empty(div); // Removes all children
   */
  static empty(elem) {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }

  /**
   * @static
   * @method add_css
   * @description Adds CSS classes to an element.
   * @param {HTMLElement} elem - Element to modify.
   * @param {string} css - Space-separated CSS classes to add.
   * @example
   * Dom.add_css(elem, "active hidden"); // Adds classes if not present
   */
  static add_css(elem, css) {
    const c1 = elem.className.split(" ");

    css.split(" ").forEach(function (c) {
      if (c1.indexOf(c) == -1) c1.push(c);
    })

    elem.className = c1.join(" ");
  }

  /**
   * @static
   * @method remove_css
   * @description Removes CSS classes from an element.
   * @param {HTMLElement} elem - Element to modify.
   * @param {string} css - Space-separated CSS classes to remove.
   * @example
   * Dom.remove_css(elem, "active hidden"); // Removes classes
   */
  static remove_css(elem, css) {
    const c1 = elem.className.split(" ");
    const c2 = css.split(" ");

    elem.className = c1.filter(function (c) { return c2.indexOf(c) == -1; }).join(" ");
  }

  /**
   * @static
   * @method has_css
   * @description Checks if an element has a CSS class.
   * @param {HTMLElement} elem - Element to check.
   * @param {string} css - CSS class to verify.
   * @returns {boolean} True if class exists, false otherwise.
   * @example
   * console.log(Dom.has_css(elem, "active")); // true if elem has "active"
   */
  static has_css(elem, css) {
    return (' ' + elem.className + ' ').indexOf(' ' + css + ' ') > -1;
  }

  /**
   * @static
   * @method set_css
   * @description Sets CSS classes on an element, replacing existing ones.
   * @param {HTMLElement} elem - Element to modify.
   * @param {string} css - Space-separated CSS classes to set.
   * @example
   * Dom.set_css(elem, "new-class"); // Sets className to "new-class"
   */
  static set_css(elem, css) {
    elem.className = css;
  }

  /**
   * @static
   * @method toggle_css
   * @description Toggles CSS classes based on enabled state.
   * @param {HTMLElement} elem - Element to modify.
   * @param {string} css - Space-separated CSS classes to toggle.
   * @param {boolean} enabled - True to add, false to remove classes.
   * @example
   * Dom.toggle_css(elem, "active", true); // Adds "active" class
   */
  static toggle_css(elem, css, enabled) {
    if (enabled) this.add_css(elem, css);

    else this.remove_css(elem, css);
  }

  /**
   * @static
   * @method set_attribute
   * @description Sets an attribute on an element.
   * @param {HTMLElement} elem - Element to modify.
   * @param {string} attr - Attribute name.
   * @param {string} value - Attribute value.
   * @example
   * Dom.set_attribute(elem, "title", "Tooltip"); // Sets title attribute
   */
  static set_attribute(elem, attr, value) {
    elem.setAttribute(attr, value);
  }

  /**
   * @static
   * @method remove_links
   * @description Removes <a> tags from a string, keeping inner text.
   * @param {string} str - HTML string with links.
   * @returns {string} String with <a> tags removed.
   * @example
   * const str = "<a href='#'>Click</a>";
   * console.log(Dom.remove_links(str)); // "Click"
   */
  static remove_links(str) {
    return str.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');
  }
}