import React, { useContext, useEffect } from "react";
import { OverviewMap } from "ol/control";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import MapContext from "../Map/MapContext";

const MapOverview = () => {
  const { map } = useContext(MapContext);
  const overviewMapControl = new OverviewMap({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
  });

  useEffect(() => {
    if (!map) {
      return;
    }
    map.addControl(overviewMapControl);

    return () => map.controls.remove(overviewMapControl);
  }, [map]);
  return <div></div>;
};

export default MapOverview;
