import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Map from "./Map";
import { Layers, MapLayerSwitcher } from "./Layers";
import { fromLonLat } from "ol/proj";
import "./App.css";
import {
  Controls,
  FullScreenControl,
  MousePositionControl,
  MeasurementControl,
} from "./Controls";
import "ol/ol.css";
import Legend from "./MapComponents/Legend";
import FeatureInfo from "./MapComponents/FeatureInfo";

const App = () => {
  const [zoom, setZoom] = useState(15);
  return (
    <div>
      <div className="row">
        <div className="col-2">
          <Legend />
        </div>
        <div className="col-10">
          <Map center={fromLonLat([-73.82745, 41.07567])} zoom={zoom}>
            <Layers>
              <MapLayerSwitcher />
              <FeatureInfo />
            </Layers>

            <Controls>
              <FullScreenControl />
              <MousePositionControl />
              <MeasurementControl />
            </Controls>
          </Map>
        </div>
      </div>
    </div>
  );
};

export default App;
