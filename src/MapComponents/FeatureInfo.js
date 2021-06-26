import React, { useContext, useState } from "react";
import MapContext from "../Map/MapContext";
import { overlays } from "../Layers/Overlays";
import ImageWMS from "ol/source/ImageWMS";
import { Modal } from "react-bootstrap";

const FeatureInfo = () => {
  const { map } = useContext(MapContext);
  const [selectIdentify, setSelectIdentify] = useState("");
  let [featureInfo, setFeatureInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const changeHandler = (e) => {
    setSelectIdentify(e.target.value);

    // when click on the feature then you will get the feature info
    map.on("singleclick", (evt) => {
      setShowModal(true);

      var viewResolution = /** @type {number} */ (
        map.getView().getResolution()
      );
      var num_layers = overlays.getLayers().getLength();
      var url = [];
      var wmsSource = [];
      var layerTitile = [];
      for (var i = 0; i < num_layers; i++) {
        var visibility = overlays.getLayers().item(i).getVisible();
        if (visibility) {
          layerTitile[i] = overlays.getLayers().item(i).get("title");

          wmsSource[i] = new ImageWMS({
            url: "http://localhost:8080/geoserver/wms",
            params: { LAYERS: layerTitile[i] },
            serverType: "geoserver",
            crossOrigin: "anonymous",
          });

          url[i] = wmsSource[i].getFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            "EPSG:3857",
            // { INFO_FORMAT: "text/html" }
            { INFO_FORMAT: "application/json" }
          );

          if (url[i]) {
            fetch(url[i])
              .then(function (response) {
                return response.json();
              })
              .then(function (data) {
                if (data.features.length !== 0) {
                  // console.log(data.features[0]);
                  setFeatureInfo((info) => [...info, data.features[0]]);
                }
              })
              .catch((err) => {
                console.error(err);
              });
          }
        }
      }
    });
  };

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
                  <tbody>
                    <tr>
                      <th>Name</th>
                      {Object.keys(attr.properties).map((key, index2) => {
                        return <th key={index2}>{key}</th>;
                      })}
                    </tr>
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
