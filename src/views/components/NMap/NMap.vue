<template>
  <div class="map-wrapper" id="mapWrapper">
    <l-map
      ref="mapref"
      style="height: 100%; width: 100%"
      :options="{
        attributionControl: false,
        zoomControl: false,
        contextmenu: true,
        contextmenuWidth: 80
      }"
      :zoom="zoom"
      :center="center"
      @ready="ready"
    >
      <LatlngBar position="bottomleft" />
      <l-control-zoom position="topleft"></l-control-zoom>
      <NavBar position="topleft" />
    </l-map>
  </div>
</template>

<script>
import "./assets/styles/leaflet-plugin.scss";
import "leaflet/dist/leaflet.css";
import { LMap, LControlScale, LControlZoom } from "vue2-leaflet";
import "./plugins"; //加载插件

import MapApi from "./managers/mapApi";
import config from "./config";
import TyphoonManager from "./managers/typhoonManager";
import DrawManager from "./managers/drawManager";
import { NavBar, LatlngBar } from "./components";

export default {
  components: {
    LMap,
    LControlScale,
    LControlZoom,
    NavBar,
    LatlngBar
  },
  data() {
    return { center: [22.8723, 108.9184], zoom: 6, configs: config };
  },
  beforeDestroy(){
    TyphoonManager.setInstance();
    DrawManager.setInstance();
  },
  methods: {
    ready(map) {
      this.map = map;
      window.nMap = map;
      this.initMap(map);
      this.$emit("ready");
    },

    initMap(map) {
      this.mapApi = new MapApi(this, this.configs);
      TyphoonManager.getInstance(map);
      DrawManager.getInstance(map);

      this.$store.commit("NMap/SET_MAPAPI", this.mapApi);

    }
  }
};
</script>

<style lang="scss" scoped>
.map-wrapper {
  height: 100vh;
  width: 100%;
  position: relative;
}
</style>
