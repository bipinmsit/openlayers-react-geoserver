import React, { useContext, useState } from "react";
import MapContext from "../Map/MapContext";
import { overlays } from "../Layers/Overlays";
import ImageWMS from "ol/source/ImageWMS";
import { Modal } from "react-bootstrap";
import HtmlToReact from "html-to-react";
import parse from "html-react-parser";

const FeatureInfo = () => {
  const { map } = useContext(MapContext);
  const [selectIdentify, setSelectIdentify] = useState("");
  // let [featureInfo, setFeatureInfo] = useState("");
  const [showModal, setShowModal] = useState(false);

  var htmlInfo = document.createElement("div");
  console.log(htmlInfo);
  htmlInfo.innerHTML = "";

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
            { INFO_FORMAT: "text/html" }
            // { INFO_FORMAT: "application/json" }
          );

          if (url[i]) {
            fetch(url[i])
              .then(function (response) {
                return response.text();
              })
              .then(function (html) {
                htmlInfo.innerHTML += html;
                console.log(htmlInfo);
              })
              .catch((err) => {
                console.error(err);
              });
          }
        }
      }
    });
  };

  // console.log(featureInfo);

  return (
    <div>
      <div>
        <label>GetFeatureinfo: &nbsp;</label>
        <select
          className="custom-select mr-sm-2"
          id="inlineFormCustomSelect"
          onChange={changeHandler}
          value={selectIdentify}
        >
          <option value="default">Select Option</option>
          <option value="activeLayer">Identify Tool</option>
        </select>
      </div>

      <Modal
        show={showModal && selectIdentify === "activeLayer"}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Header closeButton closeLabel="">
          <Modal.Title>Feature Information</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>{parse(`$`, htmlInfo)}</div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default FeatureInfo;
