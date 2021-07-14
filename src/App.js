import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Map from "./Map";
import { fromLonLat } from "ol/proj";
import "./App.css";
import "ol/ol.css";
import {
  Controls,
  FullScreenControl,
  MousePositionControl,
  MeasurementControl,
  SearchLocation,
  ZoomtoExtentControl,
  MapLayerSwitcher,
} from "./Controls";

import {
  MapComponents,
  Legend,
  FeatureInfo,
  AddWmsLayers,
} from "./MapComponents";
import {
  QuerySelector,
  SelectByAttributeForm,
  SelectByLocationForm,
} from "./QueryForm";
import NavBar from "./NavBar";
import { Overlays } from "./Layers/Overlays";
import DrawFeatures from "./MapComponents/DrawFeatures";

const App = () => {
  const [attributQueryTable, setAttributeQueryTable] = useState(true);
  const [locationQueryTable, setLocationQueryTable] = useState(false);

  const attributeStateHandler = () => {
    setAttributeQueryTable(true);
    setLocationQueryTable(false);
  };

  const locationStateHandler = () => {
    setLocationQueryTable(true);
    setAttributeQueryTable(false);
  };

  return (
    <div>
      <div className="row">
        <div className="col">
          <NavBar />
        </div>
      </div>
      <div className="row">
        <div className="col-3 p-2">
          <div>
            <QuerySelector
              attribute={attributeStateHandler}
              location={locationStateHandler}
            />
          </div>
        </div>
        <div className="col-9">
          <Overlays>
            <Map center={fromLonLat([-73.82745, 41.07567])} zoom={15}>
              <MapComponents>
                <Legend />
                <FeatureInfo />
                <DrawFeatures />
                <AddWmsLayers />
              </MapComponents>

              {attributQueryTable ? (
                <SelectByAttributeForm />
              ) : locationQueryTable ? (
                <SelectByLocationForm />
              ) : null}

              <Controls>
                <FullScreenControl />
                <MapLayerSwitcher />
                <ZoomtoExtentControl />
                <MousePositionControl />
                <MeasurementControl />
                <SearchLocation />
              </Controls>
            </Map>
          </Overlays>
        </div>
      </div>
    </div>
  );
};

export default App;
