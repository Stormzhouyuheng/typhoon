import {
  featureGroup,
  polyline,
  polygon,
  point,
  icon,
  marker,
  layerGroup,
  LatLng
} from "leaflet";


import { getIconOption, createTrack } from "../utils";

export default class DrawManager {
  constructor(map) {
    if (!arguments.length) {
      throw new Error("构造函数入参不可为空!");
    }
    this.map = map;
    this._init();
  }

  static getInstance(map) {
    if (!this.Instance) {
      this.Instance = new DrawManager(map);
    }
    return this.Instance;
  }
  static setInstance(){
    this.Instance = null;
  }

  _init() {
    this.featureGroup = null;
    this.drawPointInstance = null;
    this.drawPolylineInstance = null;
    this.drawPolygonInstance = null;
    this.drawRectInstance = null;

    // this.map.on(L.Draw.Event.CREATED, this.drawCreated);
    this.featureGroup = featureGroup().addTo(this.map);
  }
  //点绘制
  drawPoint(options) {
    if (this.drawPointInstance) {
      //再次点击取消绘制状态
      this.drawPointInstance.disable();
      this.drawPointInstance = null;
      return;
    }
    const { url, size, anchor } = getIconOption(options);
    let point = new L.Draw.Marker(this.map, {
      icon: new icon({
        iconUrl: url,
        iconSize: size,
        iconAnchor: anchor
      })
    });
    point.enable();
    this.drawPointInstance = point;
    this.map.once(L.Draw.Event.DRAWSTOP, evt => {
      this.drawEnd(evt, point);
      this.drawPointInstance = null;
    });
    return new Promise((resolve, reject) => {
      this.map.once(L.Draw.Event.CREATED, evt => {
        resolve(evt.layer);
      });
    });
  }
  //线绘制
  drawPolyline() {
    if (this.drawPolylineInstance) {
      //再次点击取消绘制状态
      this.drawPolylineInstance.disable();
      this.drawPolylineInstance = null;
      return;
    }
    let line = new L.Draw.Polyline(this.map);
    line.enable();
    this.drawPolylineInstance = line;
    this.map.once(L.Draw.Event.DRAWSTOP, evt => {
      this.drawEnd(evt, line);
      this.drawPolylineInstance = null;
    });
    return new Promise((resolve, reject) => {
      this.map.once(L.Draw.Event.CREATED, evt => {
        resolve(evt.layer);
      });
    });
  }
  //面绘制
  drawPolygon() {
    if (this.drawPolygonInstance) {
      //再次点击取消绘制状态
      this.drawPolygonInstance.disable();
      this.drawPolygonInstance = null;
      return Promise.reject("取消绘制");
    }
    let polygon = new L.Draw.Polygon(this.map);
    polygon.enable();
    this.drawPolygonInstance = polygon;
    this.map.once(L.Draw.Event.DRAWSTOP, evt => {
      this.drawEnd(evt, polygon);
      this.drawPolygonInstance = null;
    });
    return new Promise((resolve, reject) => {
      this.map.once(L.Draw.Event.CREATED, evt => {
        resolve(evt.layer);
      });
    });
  }
  //矩形绘制
  drawRect() {
    if (this.drawRectInstance) {
      this.drawRectInstance.disable();
      this.drawRectInstance = null;
      return;
    }
    let rect = new L.Draw.Rectangle(this.map);
    rect.enable();
    this.drawRectInstance = rect;
    this.map.once(L.Draw.Event.DRAWSTOP, evt => {
      this.drawEnd(evt, rect);
      this.drawRectInstance = null;
    });
    return new Promise((resolve, reject) => {
      this.map.once(L.Draw.Event.CREATED, evt => {
        resolve(evt.layer);
      });
    });
  }
  //绘制完成
  drawCreated(evt) {
    if (evt.layerType === "polyline") {
      this.addPolyline(evt.layer);
    } else {
      this.addPolygon(evt.layer);
    }
  }
  //绘制结束
  drawEnd(evt, instance) {
    instance.disable();
  }

  /****************************************************************************** */

  addPolygon(layer) {
    let latlngs = layer._latlngs;
    let gon = polygon(latlngs);
    this.featureGroup.addLayer(gon);
    return {
      polygon: gon,
      remove: () => {
        this.deleteFeature(gon);
      }
    };
  }

  //删除要素
  deleteFeature(feature) {
    this.featureGroup && this.featureGroup.removeLayer(feature);
  }
  //清除所有
  clearAllFeature() {
    if (this.featureGroup) {
      this.featureGroup.clearLayers();
    }
    if (this.drawPointInstance) {
      this.drawPointInstance.disable();
      this.drawPointInstance = null;
    }
    if (this.drawPolylineInstance) {
      this.drawPolylineInstance.disable();
      this.drawPolylineInstance = null;
    }
    if (this.drawPolygonInstance) {
      this.drawPolygonInstance.disable();
      this.drawPolygonInstance = null;
    }
  }

  destroy() {
    this.featureGroup = null;
    this.drawPointInstance = null;
    this.drawPolylineInstance = null;
    this.drawPolygonInstance = null;
    this.map && this.featureGroup && this.map.removeLayer(this.featureGroup);
    this.featureGroup = null;
  }
}
