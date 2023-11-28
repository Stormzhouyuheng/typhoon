import LayerManager from "./layerManager";
import DrawManager from "./drawManager";
import { createdTipMarker } from "../utils";

export default class MapApi {
  /**
   * 初始化
   * @param {*} mapObject 地图组件对象
   * @param {*} configs 配置文件内容
   */
  constructor(mapObject, configs) {
    if (!arguments.length) {
      throw new Error("构造函数入参不可为空!");
    }
    this.mapObject = mapObject;
    this.map = mapObject.map;
    this._init(configs);
    this.mapObject.$store.commit("NMap/SET_MAPAPI", this);
  }
  _init(configs) {
    this.layerManager = new LayerManager(this.map, configs);
    // this.drawManager = new DrawManager(this.map);
    this.mapObject.$store.commit(
      "NMap/SET_CURRENTBASELAYER",
      configs.baseLayers.defaultLabel
    );
    this.mapObject.$store.commit(
      "NMap/SET_BASELAYERS",
      this.layerManager.initBaseLayers()
    );
  }
}
