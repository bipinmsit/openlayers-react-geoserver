import React, { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import LayerSwitcher from "ol-layerswitcher";
import { OverlayContext } from "../Layers/Overlays";
import Group from "ol/layer/Group";
const MapLayerSwitcher = () => {
  const { map } = useContext(MapContext);
  const [overlayLayers, setOverlayLayers] = useContext(OverlayContext);

  let overlays = new Group({
    title: "Overlays",
    visible: true,
    layers: overlayLayers,
  });

  useEffect(() => {
    // Layers list toggling options
    if (!map) {
      return;
    }

    const layerSwitcher = new LayerSwitcher({
      // activationMode: "click",
      startActive: false,
      tipLabel: "Layers", // Optional label for button
      groupSelectStyle: "children", // Can be 'children' [default], 'group' or 'none'
      collapseTipLabel: "Collapse layers",
    });

    map.addControl(layerSwitcher);
    // map.addLayer(baseMaps);
    map.addLayer(overlays);

    return () => {
      map.controls.remove(layerSwitcher);
      map.removeLayer(overlays);
    };
  }, [overlayLayers, map]);

  return null;
};

export default MapLayerSwitcher;
