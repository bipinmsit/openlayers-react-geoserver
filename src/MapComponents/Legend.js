import React from "react";
import { overlays } from "../Layers/Overlays";

const Legend = () => {
  // Creating Legend
  var no_layers = overlays.getLayers().getLength();

  var layers = [];
  var i;
  for (i = 0; i < no_layers; i++) {
    layers.push({
      src:
        "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +
        overlays.getLayers().item(i).get("title"),
      title: overlays.getLayers().item(i).get("title"),
    });
  }

  return (
    <div>
      <h4>Legend</h4>
      {layers.map((layer, index) => {
        return (
          <div key={index}>
            <p>{layer.title}</p>
            <img src={layer.src} alt={layer.title}></img>
          </div>
        );
      })}
    </div>
  );
};

export default Legend;
