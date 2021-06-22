import React, { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import ZoomToExtent from "ol/control/ZoomToExtent";

const ZoomToExtentControl = () => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    let zoomtoextent = new ZoomToExtent({
      extent: [
        -8218910.693915979, 5022862.252127298, -8217340.510962429,
        5024071.866242805,
      ],
      className:"zoomToExtent"
    });

    map.controls.push(zoomtoextent);

    return () => map.controls.remove(zoomtoextent);
  }, [map]);

  return null;
};

export default ZoomToExtentControl;
