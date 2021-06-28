import React, { useCallback, useContext, useEffect, useState } from "react";
import MapContext from "../Map/MapContext";
import ImageWMS from "ol/source/ImageWMS";
import { Modal } from "react-bootstrap";
import { OverlayContext } from "../Layers/Overlays";
import { set } from "ol/transform";

const FeatureInfo = () => {
  const { map } = useContext(MapContext);
  const [overlayLayers, setOverlayLayers] = useContext(OverlayContext);

  const [selectIdentify, setSelectIdentify] = useState("");
  let [featureInfo, setFeatureInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // console.log(selectIdentify);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (selectIdentify === "activeLayer") {
      map.on("singleclick", getFeatureInfo);
    } else if (selectIdentify === "default") {
      map.un("singleclick", getFeatureInfo);
    }

    // return () => setFeatureInfo([]);
  }, [selectIdentify, overlayLayers]);

  const changeHandler = (e) => {
    setSelectIdentify(e.target.value);
  };

  const getFeatureInfo = useCallback(
    (evt) => {
      setShowModal(true);

      var viewResolution = /** @type {number} */ (
        map.getView().getResolution()
      );
      var num_layers = overlayLayers.length;
      var url = [];
      var wmsSource = [];
      var layerParams = [];
      for (var i = 0; i < num_layers; i++) {
        var visibility = overlayLayers[i].getVisible();
        if (visibility) {
          layerParams[i] = overlayLayers[i].getSource().getParams().LAYERS;
          // console.log(overlayLayers[i].getSource().getParams().LAYERS);

          wmsSource[i] = new ImageWMS({
            url: "http://localhost:8080/geoserver/wms",
            params: { LAYERS: layerParams[i] },
            serverType: "geoserver",
            crossOrigin: "anonymous",
          });

          // console.log(wmsSource[i]);

          url[i] = wmsSource[i].getFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            "EPSG:3857",
            // { INFO_FORMAT: "text/html" }
            { INFO_FORMAT: "application/json" }
          );

          // console.log(url[i]);

          if (url[i]) {
            fetch(url[i])
              .then(function (response) {
                return response.json();
              })
              .then(function (data) {
                if (data.features.length !== 0) {
                  setFeatureInfo((info) => [...info, data.features[0]]);
                }
              })
              .catch((err) => {
                console.error(err);
              });
          }
        }
      }
    },
    [setFeatureInfo, setShowModal, map, overlayLayers]
  );

  // console.log(featureInfo);

  return (
    <div>
      <div className="featureInfo">
        <form>
          <label style={{ color: "blue" }}>
            <strong>GetFeatureinfo:</strong> &nbsp;
          </label>
          <select
            className="custom-select mr-sm-2"
            id="inlineFormCustomSelect"
            onChange={changeHandler}
            value={selectIdentify}
          >
            <option value="default">Select Option</option>
            <option value="activeLayer">Identify Tool</option>
          </select>
        </form>
      </div>

      <Modal
        show={showModal && selectIdentify === "activeLayer"}
        scrollable={true}
        onHide={() => {
          setShowModal(false);
          setFeatureInfo([]);
        }}
      >
        <Modal.Header closeButton closeLabel="">
          <Modal.Title>Feature Information</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {featureInfo.map((attr, index) => {
            return (
              <div key={index}>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      {Object.keys(attr.properties).map((key, index2) => {
                        return <th key={index2}>{key}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{attr.id}</td>
                      {/* <th>{attr.geometry.type}</th> */}
                      {Object.keys(attr.properties).map((key, index) => {
                        return <td key={index}> {attr.properties[key]} </td>;
                      })}
                    </tr>
                  </tbody>
                </table>
                &nbsp;
              </div>
            );
          })}
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default FeatureInfo;
