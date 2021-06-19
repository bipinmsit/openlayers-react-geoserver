import React, { useContext, useEffect, useState } from "react";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
import MapContext from "../Map/MapContext";
import "./control.css";

const MousePositionControl = () => {
  const [precisionValue, setPrecisionValue] = useState(5);
  const [epsg, setEpsg] = useState("4326");
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) {
      return;
    }

    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(precisionValue),
      projection: `EPSG:${epsg}`,
      // comment the following two lines to have the mouse position
      // be placed within the map.
      className: "custom-mouse-position",
      target: document.getElementById("mouse-position"),
      undefinedHTML: "&nbsp;",
    });

    map.controls.push(mousePositionControl);
    // map.addControl(mousePositionControl);

    return () => map.controls.remove(mousePositionControl);
  }, [map, epsg, precisionValue]);

  const precisionValueHandler = (e) => {
    setPrecisionValue(e.target.value);
  };

  const epsgHandler = (e) => {
    setEpsg(e.target.value);
  };

  return (
    <div>
      <div id="mouse-position"></div>

      <label>Projection: &nbsp; </label>
      <select id="projection" onChange={epsgHandler} value={epsg}>
        <option value="4326">EPSG:4326</option>
        <option value="3857">EPSG:3857</option>
      </select>
      <label>Precision: &nbsp;</label>
      <input
        id="precision"
        type="number"
        min="0"
        max="12"
        value={precisionValue}
        onChange={precisionValueHandler}
      />
    </div>
  );
};

export default MousePositionControl;
