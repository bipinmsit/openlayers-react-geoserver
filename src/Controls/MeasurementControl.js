import React, { useContext, useEffect } from "react";
import "ol/ol.css";
import Draw from "ol/interaction/Draw";
import Overlay from "ol/Overlay";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { LineString, Polygon } from "ol/geom";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { getArea, getLength } from "ol/sphere";
import { unByKey } from "ol/Observable";
import MapContext from "../Map/MapContext";

const MeasurementControl = () => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    var source = new VectorSource();

    var vector = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "#ffcc33",
          }),
        }),
      }),
    });

    map.addLayer(vector);

    /**
     * Currently drawn feature.
     * @type {import("../src/ol/Feature.js").default}
     */
    var sketch;

    /**
     * The help tooltip element.
     * @type {HTMLElement}
     */
    var helpTooltipElement;

    /**
     * Overlay to show the help messages.
     * @type {Overlay}
     */
    var helpTooltip;

    /**
     * The measure tooltip element.
     * @type {HTMLElement}
     */
    var measureTooltipElement;

    /**
     * Overlay to show the measurement.
     * @type {Overlay}
     */
    var measureTooltip;

    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     */
    var continuePolygonMsg = "Click to continue drawing the polygon";

    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
    var continueLineMsg = "Click to continue drawing the line";

    /**
     * Handle pointer move.
     * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
     */
    var pointerMoveHandler = function (evt) {
      if (evt.dragging) {
        return;
      }
      /** @type {string} */
      var helpMsg = "Click to start drawing";

      if (sketch) {
        var geom = sketch.getGeometry();
        if (geom instanceof Polygon) {
          helpMsg = continuePolygonMsg;
        } else if (geom instanceof LineString) {
          helpMsg = continueLineMsg;
        }
      }

      if (helpTooltipElement) {
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        helpTooltipElement.classList.remove("hidden");
      } else {
        return;
      }
    };

    map.on("pointermove", pointerMoveHandler);

    map.getViewport().addEventListener("mouseout", function () {
      if (helpTooltipElement) {
        helpTooltipElement.classList.add("hidden");
      } else {
        return;
      }
    });

    var typeSelect = document.getElementById("type");

    var draw; // global so we can remove it later

    /**
     * Format length output.
     * @param {LineString} line The line.
     * @return {string} The formatted length.
     */
    var formatLength = function (line) {
      var length = getLength(line);
      var output;
      if (length > 1000) {
        output = Math.round((length / 1000) * 100) / 100 + " " + "km";
      } else {
        output = Math.round(length * 100) / 100 + " " + "m";
      }
      return output;
    };

    /**
     * Format area output.
     * @param {Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    var formatArea = function (polygon) {
      var area = getArea(polygon);
      var output;
      if (area > 100000) {
        output =
          Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
      } else {
        output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
      }
      return output;
    };

    function addInteraction() {
      // var type = typeSelect.value === "area" ? "Polygon" : "LineString";
      var type;
      if (typeSelect.value === "area") {
        type = "Polygon";
      } else if (typeSelect.value === "length") {
        type = "LineString";
      }

      draw = new Draw({
        source: source,
        type: type,
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.5)",
            lineDash: [10, 10],
            width: 2,
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: "rgba(0, 0, 0, 0.7)",
            }),
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.2)",
            }),
          }),
        }),
      });

      if (typeSelect.value === "select" || typeSelect.value === "clear") {
        map.removeInteraction(draw);
        if (vector) {
          vector.getSource().clear();
        }
        map.removeOverlay(helpTooltip);

        if (measureTooltipElement) {
          var elem = document.getElementsByClassName(
            "ol-tooltip ol-tooltip-static"
          );

          for (var i = elem.length - 1; i >= 0; i--) {
            elem[i].remove();
          }
        }
      } else if (typeSelect.value === "area" || typeSelect.value === "length") {
        map.addInteraction(draw);

        createMeasureTooltip();
        createHelpTooltip();

        var listener;
        draw.on("drawstart", function (evt) {
          // set sketch
          sketch = evt.feature;

          /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
          var tooltipCoord = evt.coordinate;

          listener = sketch.getGeometry().on("change", function (evt) {
            var geom = evt.target;
            var output;
            if (geom instanceof Polygon) {
              output = formatArea(geom);
              tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof LineString) {
              output = formatLength(geom);
              tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
          });
        });

        draw.on("drawend", function () {
          measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
          measureTooltip.setOffset([0, -7]);
          // unset sketch
          sketch = null;
          // unset tooltip so that a new one can be created
          measureTooltipElement = null;
          createMeasureTooltip();
          unByKey(listener);
        });
      }
    }

    /**
     * Creates a new help tooltip
     */
    function createHelpTooltip() {
      if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
      }
      helpTooltipElement = document.createElement("div");
      helpTooltipElement.className = "ol-tooltip hidden";
      helpTooltip = new Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: "center-left",
      });
      map.addOverlay(helpTooltip);
    }

    /**
     * Creates a new measure tooltip
     */
    function createMeasureTooltip() {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
      }
      measureTooltipElement = document.createElement("div");
      measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
      measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: "bottom-center",
      });
      map.addOverlay(measureTooltip);
    }

    /**
     * Let user change the geometry type.
     */
    typeSelect.onchange = function () {
      map.removeInteraction(draw);
      addInteraction();
    };

    addInteraction();

    // return () => map.controls.remove(fullScreenControl);
  }, [map]);

  return (
    <div>
      <form className="measure">
        <label htmlFor="type" style={{ color: "blue" }}>
          <strong>Measurement type:</strong> &nbsp;
        </label>
        <select id="type">
          <option value="select">Select Measurement Option</option>
          <option value="length">Length (LineString)</option>
          <option value="area">Area (Polygon)</option>
          <option value="clear">Clear</option>
        </select>
      </form>
    </div>
  );
};

export default MeasurementControl;
