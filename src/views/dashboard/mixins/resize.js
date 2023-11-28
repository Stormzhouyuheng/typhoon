import { debounce } from "@/utils";
import { downloadImage } from "@/utils/custom";

export default {
  data() {
    return {
      $_sidebarElm: null,
      $_resizeHandler: null
    };
  },
  mounted() {
    this.initListener();
  },
  activated() {
    if (!this.$_resizeHandler) {
      // avoid duplication init
      this.initListener();
    }

    // when keep-alive chart activated, auto resize
    this.resize();
  },
  beforeDestroy() {
    this.destroyListener();
  },
  deactivated() {
    this.destroyListener();
  },
  watch: {
    chart: function(val) {
      if (val) {
        val.off("click");
        val.on("click", this.$_clickHandler);
      }
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_sidebarResizeHandler(e) {
      if (e.propertyName === "width") {
        this.$_resizeHandler();
      }
    },
    initListener() {
      this.$_resizeHandler = debounce(() => {
        this.resize();
      }, 100);
      this.$_clickHandler = debounce(this._clickHandler, 200, true);
      window.addEventListener("resize", this.$_resizeHandler);

      this.$_sidebarElm = document.getElementsByClassName(
        "sidebar-container"
      )[0];
      this.$_sidebarElm &&
        this.$_sidebarElm.addEventListener(
          "transitionend",
          this.$_sidebarResizeHandler
        );
    },
    destroyListener() {
      window.removeEventListener("resize", this.$_resizeHandler);
      this.$_resizeHandler = null;

      this.$_sidebarElm &&
        this.$_sidebarElm.removeEventListener(
          "transitionend",
          this.$_sidebarResizeHandler
        );
    },
    resize() {
      const { chart, resizeCallback } = this;
      chart && chart.resize();
      resizeCallback && resizeCallback();
    },
    _clickHandler(params) {
      if (params.componentType === "yAxis") {
        this.$emit("yAxisClick", params);
      } else if (params.componentType === "xAxis") {
        this.$emit("xAxisClick", params);
      } else {
        this.$emit("itemClick", params);
      }
    },
    saveImage(name) {
      if (this.chart) {
        let url = this.chart.getDataURL({
          type: "png"
        });
        downloadImage(url, name || +new Date());
      }
    }
  }
};
