const config = {
  baseLayers: {
    defaultLabel: "行政区",
    alwaysShow: [
      {
        url:
          "http://10.7.220.91:6080/arcgis/rest/services/zw_shape/zw_river1/MapServer",
        type: "Dynamic"
      }
    ],
    water: {
      label: "水系",
      type: "Arcgis",
      imgUrl: "../static/img/map_assets/shuixi.png",
      layers: [
        {
          url:
            "http://10.7.220.91:6080/arcgis/rest/services/zw_shape/zw_map1/MapServer",
          type: "Dynamic"
        }
      ]
    },
    satellite: {
      label: "卫星",
      type: "TianDiTu",
      imgUrl: "../static/img/map_assets/weixin.png",
      layers: [
        { type: "TianDiTu.Satellite.Map" },
        { type: "TianDiTu.Satellite.Annotion" }
      ]
    },
    terrain: {
      label: "地形",
      type: "TianDiTu",
      imgUrl: "../static/img/map_assets/dixing.png",
      layers: [
        { type: "TianDiTu.Terrain.Map" }
        // { type: "TianDiTu.Terrain.Annotion" }
      ]
    },
    region: {
      label: "行政区",
      type: "TianDiTu",
      imgUrl: "../static/img/map_assets/xingzhenqu.png",
      layers: [
        { type: "TianDiTu.Normal.Map" },
        { type: "TianDiTu.Normal.Annotion" }
      ]
    }
  },
  modules: {
    typhoon: {
      baseLayer: "行政区"
    }
  }
};

export default config;
