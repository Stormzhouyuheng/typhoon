import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("NMap", ["baseLayers", "currentBaseLayer"])
  },
  watch: {
    currentBaseLayer: function(val, oldVal) {
      const { map, baseLayers } = this;
      let keys = Object.keys(baseLayers);
      if (!oldVal) {
        keys.map(key => {
          let item = baseLayers[key];
          (item.layers || []).map(layer => {
            map.removeLayer(layer);
          });
        });
      } else {
        (baseLayers[oldVal].layers || []).map(layer => {
          map.removeLayer(layer);
        });
      }

      if (val) {
        (baseLayers[val].layers || []).map(layer => {
          map.addLayer(layer);
        });
      }
    }
  },
  methods: {
    baseLayerClick(key) {
      this.$store.commit("NMap/SET_CURRENTBASELAYER", key);
    }
  }
};
