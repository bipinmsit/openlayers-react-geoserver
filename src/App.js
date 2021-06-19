import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Map from "./Map";
import { Layers, MapLayerSwitcher } from "./Layers";
import { fromLonLat } from "ol/proj";
import "./App.css";
import {
  Controls,
  FullScreenControl,
  MousePositionControl,
  MeasurementControl,
  SearchLocation,
} from "./Controls";
import "ol/ol.css";
import Legend from "./MapComponents/Legend";
import FeatureInfo from "./MapComponents/FeatureInfo";
import QuerySelector from "./QueryForm/QuerySelector";
import SelectByLocationForm from "./QueryForm/SelectByLocationForm";
import SelectByAttributeForm from "./QueryForm/SelectByAttributeForm";

const App = () => {
  const [zoom, setZoom] = useState(15);
  const [attributQueryTable, setAttributeQueryTable] = useState(false);
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
        <div className="col-3 p-2">
          <QuerySelector
            attribute={attributeStateHandler}
            location={locationStateHandler}
          />
          {attributQueryTable ? (
            <SelectByAttributeForm />
          ) : locationQueryTable ? (
            <SelectByLocationForm />
          ) : null}

          <Legend />
        </div>
        <div className="col-9">
          <Map center={fromLonLat([-73.82745, 41.07567])} zoom={zoom}>
            <Layers>
              <MapLayerSwitcher />
              <FeatureInfo />
            </Layers>

            <Controls>
              <FullScreenControl />
              <MousePositionControl />
              <MeasurementControl />
              <SearchLocation />
            </Controls>
          </Map>
        </div>
      </div>
    </div>
  );
};

export default App;
