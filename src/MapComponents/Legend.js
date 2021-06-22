import React, { useEffect, useState } from "react";
import { overlays } from "../Layers/Overlays";

const Legend = () => {
  const [layerNameAndStyle, setLayerNameAndStyle] = useState([]);
  // Creating Legend
  useEffect(() => {
    var no_layers = overlays.getLayers().getLength();

    for (var i = 0; i < no_layers; i++) {
      let value = {
        src:
          "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +
          overlays.getLayers().item(i).get("title"),
        title: overlays.getLayers().item(i).get("title"),
      };

      setLayerNameAndStyle((prevState) => [...prevState, value]);
    }
  }, [overlays]);

  return (
    <div>
      <h4>Legend</h4>
      {layerNameAndStyle.map((layer, index) => {
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
