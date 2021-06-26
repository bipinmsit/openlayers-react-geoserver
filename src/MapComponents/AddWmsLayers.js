import React, { useContext, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { overlays } from "../Layers/Overlays";
import Image from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import MapContext from "../Map/MapContext";
import { transformExtent } from "ol/proj";

const AddWmsLayers = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [layerDetails, setLayerDetails] = useState([]);

  const { map } = useContext(MapContext);

  useEffect(() => {
    fetch("http://localhost:8080/geoserver/wms?request=getCapabilities")
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/xml");

        // console.log(xml);

        const capability = xml.getElementsByTagName("Capability")[0];

        const layerNameList = capability.getElementsByTagName("Layer");

        for (var i = 1; i < layerNameList.length; i++) {
          const layerName = capability.getElementsByTagName("Layer")[i];
          let boundingBox = layerName.getElementsByTagName("BoundingBox")[0];
          // console.log(boundingBox.attributes.length);
          let name = layerName.getElementsByTagName("Name")[0].textContent;
          let title = layerName.getElementsByTagName("Title")[0].textContent;
          let abst = layerName.getElementsByTagName("Abstract")[0].textContent;

          setLayerDetails((prevState) => [
            ...prevState,
            {
              layerName: name,
              layerTitle: title,
              layerAbstract: abst,
              layerExtent: [
                parseFloat(boundingBox.getAttribute("minx")),
                parseFloat(boundingBox.getAttribute("miny")),
                parseFloat(boundingBox.getAttribute("maxx")),
                parseFloat(boundingBox.getAttribute("maxy")),
              ],
            },
          ]);
        }
      });
  }, []);

  // console.log(layerDetails);
  // console.log(name, title);

  const wmsLayerListHandler = () => {
    setShowModal(true);
  };

  const addLayerHandler = () => {
    setShowModal(false);
    const layer_wms = new Image({
      title: title,
      source: new ImageWMS({
        url: "http://localhost:8080/geoserver/wms",
        params: { LAYERS: name },
        ratio: 1,
        serverType: "geoserver",
      }),
    });

    overlays.getLayers().push(layer_wms);

    const getLayerDetailsFromTitle = layerDetails.find(
      (obj) => obj.layerTitle === title
    );
    // console.log(getLayerDetailsFromTitle);
    const extent = getLayerDetailsFromTitle.layerExtent;
    const convertedExtent = transformExtent(extent, "EPSG:4326", "EPSG:3857");
    // console.log(convertedExtent);

    if (map) {
      map
        .getView()
        .fit(convertedExtent, {
          size: map.getSize(),
          maxZoom: 16,
          duration: 1590,
        });
      // map.addControl(layerSwitcher);
    }
  };

  const wmsRowClickHandler = (e) => {
    const row = e.target.parentElement;
    row.style.backgroundColor = "blue";
    // console.log(row.childNodes[0].textContent, row.childNodes[1].textContent);

    setName(row.childNodes[0].textContent);
    setTitle(row.childNodes[1].textContent);
  };

  // console.log(title.split(":")[1]);
  return (
    <div>
      <div className="wmsLayers">
        <button
          type="button"
          className="btn btn-primary"
          onClick={wmsLayerListHandler}
        >
          WMS Layers
        </button>
      </div>

      <div>
        <Modal
          show={showModal}
          size="lg"
          scrollable={true}
          onHide={() => {
            setShowModal(false);
          }}
        >
          <Modal.Header closeButton closeLabel="">
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <table className="table wmsTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Abstract</th>
                  </tr>
                </thead>
                <tbody>
                  {layerDetails.map((layer, index) => {
                    return (
                      <tr
                        key={index}
                        onClick={wmsRowClickHandler}
                        // data-href="#"
                      >
                        <td>{layer.layerName}</td>
                        <td>{layer.layerTitle}</td>
                        <td>{layer.layerAbstract}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={addLayerHandler}>
              Add Layer to map
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AddWmsLayers;
