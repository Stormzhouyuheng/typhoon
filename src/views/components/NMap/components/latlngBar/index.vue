<template>
  <l-control ref="lc" :position="position">
    <div class="latlng-wrapper">
      <span>经度:</span
      ><span>{{ (mouseLatlng.lng || "-") | latlngFormat }}</span
      ><span>&nbsp;纬度:</span
      ><span>{{ (mouseLatlng.lat || "-") | latlngFormat }}</span>
    </div>
  </l-control>
</template>

<script>
import { LControl } from "vue2-leaflet";
import lControl from "../mixins/lControl";

export default {
  name: "NLatlngBar",
  components: { LControl },
  mixins: [lControl],
  props: {
    position: {
      type: String,
      default: "bottomright"
    }
  },
  data() {
    return {
      mouseLatlng: {}
    };
  },
  filters: {
    latlngFormat: function(val) {
      let str = val;
      if (!isNaN(val)) {
        str = Number(val).toFixed(2);
      }
      return str;
    }
  },
  watch: {
    map: function(val) {
      if (val) {
        this.map.on("mousemove", e => {
          // 经纬度显示
          this.mouseLatlng = e.latlng;
        });
      }
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.latlng-wrapper {
  font-size: 14px;
  padding: 2px 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 2px 1px 5px #ccc;
  span {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>
