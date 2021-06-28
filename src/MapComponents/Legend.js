import React, { useContext, useEffect, useState } from "react";
import { OverlayContext } from "../Layers/Overlays";

const Legend = () => {
  const [layerNameAndStyle, setLayerNameAndStyle] = useState([]);
  const [overlayLayers, setOverlayLayers] = useContext(OverlayContext);

  // console.log(overlayLayers);

  // Creating Legend
  useEffect(() => {
    var no_layers = overlayLayers.length;

    for (var i = 0; i < no_layers; i++) {
      let value = {
        src:
          "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +
          overlayLayers[i].get("title"),
        title: overlayLayers[i].get("title"),
      };

      // console.log(overlayLayers[i].getVisible())

      setLayerNameAndStyle((prevState) => [...prevState, value]);
    }

    return () => setLayerNameAndStyle([]);
  }, [overlayLayers]);

  return (
    <div className="mapLegend">
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
