import { tileLayer } from "leaflet";
import { dynamicMapLayer } from "esri-leaflet";

export default class LayerManager {
  constructor(map, configs) {
    if (!arguments.length) {
      throw new Error("构造函数不可为空!");
    }
    this.map = map;
    this.configs = configs;
    this.addedLayers = {};
    this.controlLayers = [];
    this.baseLayer = {};
    this.esriDynamicIndex = 20;
  }

  //添加图层
  addLayer(layer) {
    if (layer) {
      let added = this.map.addLayer(layer);
      layer.visible = true;
      this.addedLayers[added._leaflet_id] = layer;
    }
    return this.addedLayers;
  }

  //移除图层
  removeLayer(layer) {
    if (layer) {
      this.map.removeLayer(layer);
      layer.visible = false;
      delete this.addedLayers[layer._leaflet_id];
    }
    return this.addedLayers;
  }

  initBaseLayers() {
    const {
      baseLayers: { defaultLabel, alwaysShow, ...bLayers }
    } = this.configs;
    let res = {};
    Object.keys(bLayers || {}).map(key => {
      const { type, label, imgUrl, layers } = bLayers[key];
      switch (type) {
        case "Arcgis":
          res[label] = {
            imgUrl,
            layers: layers.map(layer => {
              return this.createLayer(layer.type, layer);
            })
          };
          break;
        case "TianDiTu":
          res[label] = {
            imgUrl,
            layers: layers.map(layer => {
              return this.createLayer("TianDiTu", layer);
            })
          };
          break;
        default:
      }
    });
    this.baseLayer = res;
    (res[defaultLabel]["layers"] || []).map(layer => {
      this.addLayer(layer);
    });
    //总是显示的图层
    alwaysShow.map(layer => {
      this.addLayer(this.createLayer(layer.type || "Dynamic", layer));
    });
    return res;
  }

  createLayer(type, config) {
    let layer = null;
    switch (type) {
      case "Dynamic":
        layer = this.createEsriLayer(type, config);
        break;
      case "TianDiTu":
        layer = this.createTianDiTuLayer(config);
        break;
    }
    return layer;
  }

  createEsriLayer(type, config) {
    const dicts = {
      Dynamic: dynamicMapLayer
    };
    let layer = dicts[type]({
      ...config,
      f: "image",
      format: "png8",
      zIndex: this.esriDynamicIndex++
    });
    return layer;
  }

  createTianDiTuLayer({ type, ...other }) {
    return tileLayer.chinaProvider(type, other);
  }
}
