<template>
  <div class="water-list-wrapper">
    <TyphoonPath v-if="curName === 'typhoonPath'"></TyphoonPath>
    <TyphoonAnalysis v-if="curName === 'typhoonAnalysis'"></TyphoonAnalysis>
  </div>
</template>

<script>
import TyphoonPath from "./typhoonPath";
import TyphoonAnalysis from "./typhoonAnalysis.vue";

export default {
  name: "typhoon-info", //工程列表
  components: { TyphoonPath, TyphoonAnalysis },
  props: {
    curName: {
      type: String,
      default: "typhoonPath"
    }
  },
  data() {
    return {};
  },
  watch: {},
  methods: {}
};
</script>

<style scoped lang="scss">
.water-list-wrapper {
  height: 100%;
}
.w-300 {
  width: 300px;
}

.w-250 {
  width: 230px;
  margin-left: 5px;
}

.search-panel {
  /deep/ .el-range-editor.el-input__inner {
    padding: 3px 0 3px 5px;
  }

  /deep/ .el-range-editor--medium .el-range__icon,
  /deep/ .el-range-editor--medium .el-range__close-icon {
    width: 22px;
  }
}
</style>
