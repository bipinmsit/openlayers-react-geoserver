import React, { useState, createContext } from "react";
import Image from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

export const OverlayContext = createContext();

export const Overlays = ({ children }) => {
  const [overlayLayers, setOverlayLayers] = useState([
    new Image({
      title: "BOUNDARY",
      source: new ImageWMS({
        url: "http://localhost:8080/geoserver/wms",
        params: { LAYERS: "custom:BOUNDARY" },
        ratio: 1,
        serverType: "geoserver",
      }),
    }),

    new Image({
      title: "BUILDING_ATTR",
      source: new ImageWMS({
        url: "http://localhost:8080/geoserver/wms",
        params: { LAYERS: "custom:BUILDING_ATTR" },
        ratio: 1,
        serverType: "geoserver",
      }),
    }),

    new Image({
      title: "PAINTL",
      source: new ImageWMS({
        url: "http://localhost:8080/geoserver/wms",
        params: { LAYERS: "custom:PAINTL" },
        ratio: 1,
        serverType: "geoserver",
      }),
    }),

    new Image({
      title: "BASKETBALL_COURT",
      source: new ImageWMS({
        url: "http://localhost:8080/geoserver/wms",
        params: { LAYERS: "custom:BASKETBALL_COURT" },
        ratio: 1,
        serverType: "geoserver",
      }),
    }),

    new Image({
      title: "CURB",
      source: new ImageWMS({
        url: "http://localhost:8080/geoserver/wms",
        params: { LAYERS: "custom:CURB" },
        ratio: 1,
        serverType: "geoserver",
      }),
    }),
  ]);

  return (
    <OverlayContext.Provider value={[overlayLayers, setOverlayLayers]}>
      {children}
    </OverlayContext.Provider>
  );
};
