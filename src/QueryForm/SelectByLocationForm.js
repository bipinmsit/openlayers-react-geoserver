import React from "react";

const SelectByLocationForm = () => {
  return (
    <div>
      <label>Select Layer: &nbsp;</label>
      <select>
        <option value="">Select Layer</option>
      </select>
      <br />

      <label>Geometry type: &nbsp;</label>
      <select>
        <option value="select">Select Shape</option>
        <option value="square">Square</option>
        <option value="box">Box</option>
        <option value="polygon">Polygon</option>
        <option value="star">Star</option>
        <option value="clear">Clear</option>
      </select>
    </div>
  );
};

export default SelectByLocationForm;
