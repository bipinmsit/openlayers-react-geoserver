import React, { useContext, useEffect, useState } from "react";
import { Fill, Stroke, Circle, Style } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import GeoJSON from "ol/format/GeoJSON";
import MapContext from "../Map/MapContext";
import { transformExtent } from "ol/proj";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { get as getProjection } from "ol/proj";
import "./queryForm.css";

const SelectByAttributeForm = () => {
  const [layers, setLayers] = useState([]);
  const [fieldNameAndType, setFieldNameAndType] = useState([
    {
      fieldName: "Select Attribute",
      fieldType: "Attribute Type",
    },
  ]);

  const [selectedLayerName, setSelectedLayerName] = useState("");
  const [selectFieldName, setSelectFieldName] = useState("");
  const [selectOperator, setSelectOperator] = useState("");
  const [inboxValue, setInboxValue] = useState("");
  const [queryOutputRecord, setQueryOutputRecord] = useState([]);
  const [queryOutputHeader, setQueryOutputHeader] = useState([]);

  const { map } = useContext(MapContext);

  const valueOperator = {
    greater_than: ">",
    less_than: "<",
    equal_to: "=",
    greater_than_equal_to: ">=",
    less_then_equal_to: "<=",
    like: "ILIKE",
  };

  const createCustomProjection = () => {
    proj4.defs(
      "EPSG:2260",
      "+proj=tmerc +lat_0=38.83333333333334 +lon_0=-74.5 +k=0.9999 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=us-ft +no_defs "
    );
    register(proj4);
    const customProjection = getProjection("EPSG:2260");

    return customProjection;
  };

  // Fetch WFS Layer from geoserver
  useEffect(() => {
    fetch("http://localhost:8080/geoserver/wfs?request=getCapabilities")
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        let xml = parser.parseFromString(data, "text/xml");

        let featureTypeList = xml.getElementsByTagName("FeatureTypeList")[0];
        const childElementCount = featureTypeList.childElementCount;

        for (var i = 0; i < childElementCount; i++) {
          const node1 = featureTypeList.childNodes[i];
          // layerArr.push(node1.childNodes[0].textContent);

          setLayers((geoLayer) => [
            ...geoLayer,
            node1.childNodes[0].textContent,
          ]);
        }
      });
  }, []);

  // Extract field names from WFS Layers
  useEffect(() => {
    if (!selectedLayerName) {
      return;
    }
    fetch(
      `http://localhost:8080/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=${selectedLayerName}`
    )
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        let xml = parser.parseFromString(data, "text/xml");

        let attributeListNode = xml.getElementsByTagName("xsd:sequence")[0];
        // console.log(attributeListNode);
        const attributeListCount = attributeListNode.childElementCount;
        // console.log(attributeListCount);

        for (var i = 0; i < attributeListCount; i++) {
          const attrubuteFieldName = xml.getElementsByTagName("xsd:element")[i];
          // console.log(attrubuteFieldName.getAttribute("name"));
          // console.log(attrubuteFieldName.getAttribute("type"));
          setFieldNameAndType((preValue) => [
            ...preValue,
            {
              fieldName: attrubuteFieldName.getAttribute("name"),
              fieldType: attrubuteFieldName.getAttribute("type"),
            },
          ]);
        }
      });
    return () => {
      setFieldNameAndType([]);
    };
  }, [selectedLayerName]);

  const queryHandler = (e) => {
    e.preventDefault();

    // console.log(selectedLayerName, selectFieldName, selectOperator, inboxValue);

    var url =
      "http://localhost:8080/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      selectedLayerName +
      "&CQL_FILTER=" +
      selectFieldName +
      "+" +
      selectOperator +
      "+'" +
      inboxValue +
      "'&outputFormat=application/json";
    // console.log(url);

    var highlightStyle = new Style({
      stroke: new Stroke({
        color: "#f00",
        width: 1,
      }),
      fill: new Fill({
        color: "rgba(255,0,0,0.1)",
      }),
      text: new Text({
        font: "12px Calibri,sans-serif",
        fill: new Fill({
          color: "#000",
        }),
        stroke: new Stroke({
          color: "#f00",
          width: 3,
        }),
      }),
    });

    var geojson = new VectorLayer({
      source: new VectorSource({
        url: url,
        format: new GeoJSON(),
      }),
      style: highlightStyle,
    });

    geojson.getSource().on("addfeature", function () {
      const extent = geojson.getSource().getExtent();
      console.log(extent);
      const convertedExtent = transformExtent(
        extent,
        createCustomProjection(),
        "EPSG:3857"
      );
      console.log(convertedExtent);
      // alert(geojson.getSource().getExtent());
      map.getView().fit(convertedExtent, {
        duration: 1590,
        size: map.getSize(),
      });
    });
    // overlays.getLayers().push(geojson);
    map.addLayer(geojson);
    fetch(url)
      .then((response) => response.json())
      .then((out) => {
        const { features } = out;
        const { properties } = features[0];

        setQueryOutputHeader(Object.keys(properties));
        setQueryOutputRecord(features);
      });
  };

  const rowClickHandler = (e) => {
    const row = e.target.parentElement;
    row.style.backgroundColor = "blue";
  };

  const layerNameHandler = (e) => {
    setSelectedLayerName(e.target.value);
    // setSelectedLayerName("");
  };

  const fieldNameHandler = (e) => {
    setSelectFieldName(e.target.value);
  };

  const operatorNameHandler = (e) => {
    setSelectOperator(e.target.value);
  };

  const inputBoxValueHandler = (e) => {
    setInboxValue(e.target.value);
  };

  return (
    <div>
      <div className="selectByAttributeForm">
        <form>
          <div className="form-group">
            <select
              id="layer"
              onChange={layerNameHandler}
              value={selectedLayerName}
              className="form-control"
            >
              <option value="">Select Layer</option>
              {layers.map((layer, index) => {
                return (
                  <option value={layer} key={index}>
                    {layer}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <select
              id="attribute"
              onChange={fieldNameHandler}
              className="form-control"
            >
              {fieldNameAndType.map((attributeName, index) => {
                return (
                  <option value={attributeName.fieldName} key={index}>
                    {attributeName.fieldName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <select
              id="operator"
              className="form-control"
              onChange={operatorNameHandler}
            >
              <option value="">Select operators</option>
              {Object.keys(valueOperator).map((key, index) => {
                return (
                  <option value={valueOperator[key]} key={index}>
                    {valueOperator[key]}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <input
              type="number"
              id="value"
              name="value"
              placeholder="Enter value"
              className="form-control"
              onChange={inputBoxValueHandler}
              value={inboxValue}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-success" onClick={queryHandler}>
              Load Query
            </button>
          </div>
        </form>
      </div>
      <div className="queryOutputTable">
        <table>
          <thead>
            <tr>
              {queryOutputHeader.map((header, index) => {
                return <th key={index}>{header}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {queryOutputRecord.map((queryOutput, index) => {
              return (
                <tr key={index} onClick={rowClickHandler}>
                  {Object.keys(queryOutput.properties).map((key, index) => {
                    return <td key={index}>{queryOutput.properties[key]}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default SelectByAttributeForm;
