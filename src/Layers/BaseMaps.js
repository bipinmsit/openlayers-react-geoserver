import Group from "ol/layer/Group";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";

// Basemaps
export const baseMaps = new Group({
  title: "Base maps",
  layers: [
    new TileLayer({
      title: "OSM",
      type: "base",
      visible: true,
      source: new OSM(),
    }),

    new TileLayer({
      title: "Satellite Map",
      type: "base",
      visible: false,
      source: new XYZ({
        attributions: [
          "Powered by Esri",
          "Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community",
        ],
        attributionsCollapsible: false,
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        maxZoom: 23,
      }),
    }),
  ],
});
