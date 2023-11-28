import { featureGroup, polyline, polygon } from "leaflet";


export default {
  data() {
    return {
      featureGroup: null,
      drawPolylineInstance: null,
      drawPolygonInstance: null
    };
  },
  watch: {
    map: function(val) {
      if (val) {
        val.on(L.Draw.Event.CREATED, this.drawCreated);
        this.featureGroup = featureGroup().addTo(val);
      }
    }
  },
  methods: {
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
    },
    drawPolygon() {
      if (this.drawPolygonInstance) {
        //再次点击取消绘制状态
        this.drawPolygonInstance.disable();
        this.drawPolygonInstance = null;
        return;
      }
      let polygon = new L.Draw.Polygon(this.map);
      polygon.enable();
      this.drawPolygonInstance = polygon;
      this.map.once(L.Draw.Event.DRAWSTOP, evt => {
        this.drawEnd(evt, polygon);
        this.drawPolygonInstance = null;
      });
    },
    //绘制完成
    drawCreated(evt) {
      if (evt.layerType === "polyline") {
        this.addPolyline(evt.layer);
      } else {
        this.addPolygon(evt.layer);
      }
    },
    //绘制结束
    drawEnd(evt, instance) {
      instance.disable();
    },
    addPolyline(layer) {
      let latlngs = layer._latlngs;
      let distance = 0;
      latlngs.reduce((prev, item) => {
        if (prev) {
          distance += prev.distanceTo(item);
        }
        return item;
      }, null);
      let pop = (distance / 1000).toFixed(2) + " KM";
      let line = polyline(latlngs, {
        contextmenu: true,
        contextmenuItems: [
          {
            text: "删除",
            callback: e => {
              this.deleteFeature(e, line);
            }
          }
        ]
      });
      this.featureGroup.addLayer(
        line.bindTooltip(pop, {
          direction: "auto",
          permanent: true
        })
      );
    },
    addPolygon(layer) {
      let latlngs = layer._latlngs;
      let area = turf.area(layer.toGeoJSON()).toFixed(2) + " ㎡";
      let gon = polygon(latlngs, {
        contextmenu: true,
        contextmenuItems: [
          {
            text: "删除",
            callback: e => {
              this.deleteFeature(e, gon);
            }
          }
        ]
      });
      this.featureGroup.addLayer(
        gon.bindTooltip(area, {
          direction: "auto",
          permanent: true
        })
      );
    },
    //删除要素
    deleteFeature(e, feature) {
      this.featureGroup.removeLayer(feature);
    }
  }
};
