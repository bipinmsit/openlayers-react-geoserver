import React, { useContext, useEffect } from "react";
import Geocoder from "ol-geocoder";
import MapContext from "../Map/MapContext";
import "ol-geocoder/dist/ol-geocoder.min.css";

const SearchLocation = () => {
  const { map } = new useContext(MapContext);

  useEffect(() => {
    if (!map) {
      return;
    }

    const geocoder = new Geocoder("nominatim", {
      provider: "osm",
      autoComplete: true,
      autoCompleteMinLength: 2,
      limit: 5,
      keepOpen: true,
    });

    map.controls.push(geocoder);
  });

  return null;
};

export default SearchLocation;
