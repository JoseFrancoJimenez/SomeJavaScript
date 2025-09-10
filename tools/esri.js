'use strict';

import Core from "./core.js";
import Net from "./net.js";
import { FeatureLayer, EsriRequest, GeometryEngine } from "../esri/arcgis-modules.js";

/**
 * @module esri
 * @description Utility class for ESRI ArcGIS operations, including queries
 * and geometry buffering.
 */
export default class ESRI {
  /**
   * @static
   * @method query
   * @description Executes a feature query on a FeatureLayer.
   * @param {FeatureLayer} layer - ESRI FeatureLayer instance.
   * @param {Object} query - Query parameters.
   * @returns {Promise<Object>} Query result from the layer.
   * @example
   * ESRI.query(layer, { where: "1=1" }).then(result => console.log(result));
   */
  static query(layer, query) {
    return layer.queryFeatures(query);
  }

  /**
   * @static
   * @method query_url
   * @description Creates a FeatureLayer from URL and runs a query.
   * @param {string} url - URL of the feature layer.
   * @param {Object} query - Query parameters.
   * @returns {Promise<Object>} Query result.
   * @example
   * ESRI.query_url("https://server/FeatureServer/0", { where: "1=1" })
   *   .then(result => console.log(result));
   */
  static query_url(url, query) {
    const layer = new FeatureLayer({ url: url });
    return ESRI.query(layer, query);
  }

  /**
   * @static
   * @method buffer
   * @description Creates a buffer geometry around geometries.
   * @param {Array|Object} geometries - Geometry or array of geometries.
   * @param {number|Array<number>} distance - Buffer distance(s).
   * @param {string} unit - Unit of distance (e.g., "Meters").
   * @param {boolean} unionResults - Whether to union buffer results.
   * @returns {Object} Buffered geometry.
   * @example
   * const geom = { type: "point", x: 0, y: 0 };
   * ESRI.buffer(geom, 100, "meters", false);
   */
  static buffer(geometries, distance, unit, unionResults) {
    const min_distance = 0.00001;

    if (typeof distance === 'number' && distance === 0) {
      distance = min_distance;
    } else if (distance.length) {
      distance = distance.map(n => Math.max(n, min_distance));
    }

    return GeometryEngine.buffer(geometries, distance, unit, unionResults)[0];
  }

  /**
   * @static
   * @method get_intersecting_features
   * @description Gets features from a layer intersecting a geometry.
   * @param {FeatureLayer} layer - ESRI FeatureLayer instance.
   * @param {Object} geometry - Geometry to intersect with.
   * @returns {Promise<Array>} Array of intersecting features.
   * @example
   * ESRI.get_intersecting_features(layer, geometry)
   *   .then(features => console.log(features.length));
   */
  static async get_intersecting_features(layer, geometry) {
    // Get feature count first
    const formData = new FormData();
    formData.set("returnCountOnly", true);
    formData.set("where", '1=1');
    formData.set("f", "json");
    formData.set("geometry", JSON.stringify(geometry));
    formData.set("geometryType", "esriGeometryPolygon");
    formData.set("spatialRel", "esriSpatialRelIntersects");
    formData.set("inSR", 102100);
    formData.set("distance", 1);
    formData.set("units", "esriSRUnit_Meter");

    const response = await EsriRequest(`${layer.parsedUrl.path}/query`, {
      responseType: "json",
      method: "post",
      timeout: 0,
      body: formData
    });

    const features_count = response.data.count;

    let start = 0;
    let requested = 0;
    const num = 50000;
    const features_promises = [];

    while (requested < features_count) {
      const query = {
        geometry: geometry,
        spatialRelationship: "intersects",
        returnGeometry: true,
        outFields: ["*"],
        start: start,
        num: num
      };

      features_promises.push(layer.queryFeatures(query));
      start += num;
      requested += num;
    }

    let features = [];
    await Promise.all(features_promises)
      .then(results => results.forEach(r => features = features.concat(r.features)));

    return features;
  }
}