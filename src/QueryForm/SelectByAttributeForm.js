import React, { useContext, useEffect, useState } from "react";
import { Fill, Stroke, Circle, Style } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import GeoJSON from "ol/format/GeoJSON";

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

  const valueOperator = {
    greater_than: ">",
    less_than: "<",
    equal_to: "=",
    greater_than_equal_to: ">=",
    less_then_equal_to: "<=",
    like: "ILIKE",
  };

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

  const queryHandler = () => {
    var layer = document.getElementById("layer");
    var value_layer = layer.options[layer.selectedIndex].value;

    var attribute = document.getElementById("attributes");
    var value_attribute = attribute.options[attribute.selectedIndex].text;
    // alert(value_attribute);

    var operator = document.getElementById("operator");
    var value_operator = operator.options[operator.selectedIndex].value;
    // alert(value_operator);

    var txt = document.getElementById("value");
    var value_txt = txt.value;

    var url =
      "http://localhost:8082/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      value_layer +
      "&CQL_FILTER=" +
      value_attribute +
      "+" +
      value_operator +
      "+'" +
      value_txt +
      "'&outputFormat=application/json";
    // alert(url);

    var style = new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.7)",
      }),
      stroke: new Stroke({
        color: "#ffcc33",
        width: 3,
      }),

      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: "#ffcc33",
        }),
      }),
    });

    var geojson = new VectorLayer({
      //title:'dfdfd',
      //title: '<h5>' + value_crop+' '+ value_param +' '+ value_seas+' '+value_level+'</h5>',
      source: new VectorSource({
        url: url,
        format: new GeoJSON(),
      }),
      style: style,
    });
  };

  const selectLayerHandler = (e) => {
    setSelectedLayerName(e.target.value);
    // setSelectedLayerName("");
  };

  const fieldTypeHandler = (e) => {
    setSelectFieldName(e.target.value);
  };

  return (
    <div>
      <form>
        <div className="form-group">
          <select
            id="layer"
            onChange={selectLayerHandler}
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
            onChange={fieldTypeHandler}
            className="form-control"
          >
            {fieldNameAndType.map((attributeName, index) => {
              return (
                <option value={attributeName.fieldType} key={index}>
                  {attributeName.fieldName}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <select id="operator" className="form-control">
            <option value="">Select operators</option>
            {Object.keys(valueOperator).map((key, index) => {
              return (
                <option value={key} key={index}>
                  {valueOperator[key]}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <input
            type="text"
            id="value"
            name="value"
            placeholder="Enter value"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <button className="btn btn-success" onClick={queryHandler}>
            Load Query
          </button>
        </div>
      </form>
    </div>
  );
};
export default SelectByAttributeForm;
