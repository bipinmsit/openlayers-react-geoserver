import React, { useEffect, useState } from "react";

const SelectByLocationForm = () => {
  const [layers, setLayers] = useState([]);
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

  console.log(layers);

  return (
    <div>
      <form>
        <div className="form-group">
          <select className="form-control">
            <option value="">Select Layer</option>
            {layers.map((lname, index) => {
              return (
                <option value={lname} key={index}>
                  {lname}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <select className="form-control">
            <option value="select">Select Shape</option>
            <option value="square">Square</option>
            <option value="box">Box</option>
            <option value="polygon">Polygon</option>
            <option value="star">Star</option>
            <option value="clear">Clear</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default SelectByLocationForm;
