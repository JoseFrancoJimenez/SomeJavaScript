'use strict';

import Core from './core.js';

/**
 * @module tools/net
 * @description Utility class for network operations and URL handling.
 */
export default class Net {
  /**
   * @static
   * @method json_from_url
   * @description Fetches and parses JSON from a URL, avoiding cache.
   * @param {string} url - URL of the JSON file.
   * @returns {Promise<object>} Parsed JSON object.
   * @throws {Error} If the fetch request fails.
   * @example
   * Net.json_from_url("data.json").then(data => console.log(data));
   */
  static async json_from_url(url) {
    let resp = await fetch(`${url}?v=${Date.now()}`, { // prevents json caching
      headers: { "Content-Type": "application/json" }
    });

    if (resp.error) throw new Error(resp.status);

    return await resp.json();
  }

  /**
   * @static
   * @method get
   * @description Sends a GET request with optional headers and response type.
   * @param {string} url - Request URL.
   * @param {object} [headers] - HTTP headers (key-value pairs).
   * @param {string} [responseType] - Response type (e.g., "json", "blob").
   * @returns {Promise<any>} Response data.
   * @example
   * Net.get("api/data", { "Accept": "application/json" }, "json")
   *   .then(data => console.log(data));
   */
  static get(url, headers, responseType) {
    var d = Core.Defer();

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState != 4) return; // 4 - DONE

      if (this.status == 200) d.Resolve(this.response); // 200 - OK

      else d.Reject({ status: this.status, response: this.response });
    };

    xhttp.open("GET", url, true);

    if (headers) {
      for (var id in headers) xhttp.setRequestHeader(id, headers[id]);
    }

    if (responseType) xhttp.responseType = responseType;

    xhttp.send();

    return d.promise;
  }

  /**
   * @static
   * @method post
   * @description Sends a POST request with optional data, headers, and type.
   * @param {string} url - Request URL.
   * @param {string} [data] - Request body data.
   * @param {object} [headers] - HTTP headers (key-value pairs).
   * @param {string} [responseType] - Response type (e.g., "json", "blob").
   * @returns {Promise<any>} Response data.
   * @example
   * Net.post("api/submit", JSON.stringify({ id: 1 }), { "Content-Type": "application/json" })
   *   .then(data => console.log(data));
   */
  static post(url, data, headers, responseType) {
    var d = Core.Defer();

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState != 4) return; // 4 - DONE

      if (this.status == 200) d.Resolve(this.response); // 200 - OK

      else d.Reject({ status: this.status, response: this.response });
    };

    xhttp.open("POST", url, true);

    if (responseType) xhttp.responseType = responseType;

    if (headers) {
      for (var id in headers) xhttp.setRequestHeader(id, headers[id]);
    }

    (data) ? xhttp.send(data) : xhttp.send();

    return d.promise;
  }

  /**
   * @static
   * @method file
   * @description Fetches a file from a URL and returns it as a File object.
   * @param {string} url - URL of the file.
   * @param {string} name - Name for the File object.
   * @returns {Promise<File>} File object.
   * @example
   * Net.file("image.jpg", "photo.jpg").then(file => console.log(file.name));
   */
  static file(url, name) {
    var d = Core.Defer();

    Net.get(url, null, 'blob').then(b => {
      d.Resolve(new File([b], name));
    }, d.Reject);

    return d.promise;
  }

  /**
   * @static
   * @method blob
   * @description Fetches a blob from a URL.
   * @param {string} url - URL of the resource.
   * @returns {Promise<Blob>} Blob object.
   * @example
   * Net.blob("image.jpg").then(blob => console.log(blob.size));
   */
  static blob(url) {
    var d = Core.Defer();

    Net.get(url, null, 'blob').then(b => {
      d.Resolve(b);
    }, d.Reject);

    return d.promise;
  }

  /**
   * @static
   * @method parse_url_query
   * @description Parses query string into key-value pairs.
   * @returns {object} Dictionary of query parameters.
   * @example
   * // URL: http://example.com?name=Alice&age=30
   * console.log(Net.parse_url_query()); // { name: "Alice", age: "30" }
   */
  static parse_url_query() {
    var params = {};
    var query = location.search.slice(1);

    if (query.length == 0) return params;

    query.split("&").forEach(p => {
      var lr = p.split("=");

      params[lr[0]] = lr[1];
    });

    return params;
  }

  /**
   * @static
   * @method get_url_parameter
   * @description Gets a parameter value from the URL query string.
   * @param {string} name - Parameter name.
   * @returns {string|null} Parameter value or null if not found.
   * @example
   * // URL: http://example.com?name=Alice
   * console.log(Net.get_url_parameter("name")); // "Alice"
   */
  static get_url_parameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');

    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');

    var results = regex.exec(window.location.href);

    if (!results) return null;

    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  /**
   * @static
   * @method download
   * @description Downloads a file from a URL with a specified name.
   * @param {string} name - File name for download.
   * @param {string} url - URL of the file.
   * @example
   * Net.download("file.txt", "data/file.txt");
   */
  static download(name, url) {
    var link = document.createElement("a");

    link.href = url;
    link.download = name;
    link.click();
    link = null;
  }

  /**
   * @static
   * @method app_path
   * @description Gets the base URL path of the web app.
   * @returns {string} Base path of the app.
   * @example
   * // URL: http://example.com/app/index.html
   * console.log(Net.app_path()); // "http://example.com/app"
   */
  static app_path() {
    var path = location.href.split("/");

    path.pop();

    return path.join("/");
  }

  /**
   * @static
   * @method file_path
   * @description Builds a URL for a file relative to the app path.
   * @param {string} file - File name or path.
   * @returns {string} Full URL for the file.
   * @example
   * // App path: http://example.com/app
   * console.log(Net.file_path("data.txt")); // "http://example.com/app/data.txt"
   */
  static file_path(file) {
    file = file.charAt(0) == "/" ? file.substr(1) : file;

    var path = [Net.AppPath(), file];

    return path.join("/");
  }
}