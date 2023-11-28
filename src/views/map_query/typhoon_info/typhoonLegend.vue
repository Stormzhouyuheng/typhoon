<template>
  <Widget name="台风图例" :left="10" :bottom="40">
    <div class="legend-wrapper">
      <div class="title">
        <span>预报台</span>
      </div>
      <el-checkbox-group
        v-model="checked"
        @change="forecastChange"
        class="legend-group"
      >
        <el-checkbox v-for="city in forecasts" :label="city" :key="city">
          <span class="line" :style="{ color: getColor(city) }">━ ━</span>
          {{ city }}
        </el-checkbox>
      </el-checkbox-group>
      <div class="title">
        <span>台风等级</span>
      </div>
      <div class="legend-group">
        <div v-for="(level, i) in levelDict" :key="i">
          <div
            class="circle"
            :style="{ backgroundColor: levelColors[i] }"
          ></div>
          <span class="label">{{ level }}</span>
        </div>
      </div>
    </div>
  </Widget>
</template>

<script>
import { Widget } from "@/views/components/NMap/components";
import {
  default as TyphoonManager,
  getYBColor
} from "@/views/components/NMap/managers/typhoonManager";

export default {
  components: { Widget },
  data() {
    return {
      forecasts: [],
      checked: [],
      levelDict: [
        "热带低压",
        "热带风暴",
        "强热带风暴",
        "台风",
        "强台风",
        "超强台风",
        "无数据"
      ],
      levelColors: [
        "#FBF558",
        "#2C7EEF",
        "#5BF95D",
        "#F6B344",
        "#E687EA",
        "#F02125",
        "#000000"
      ],
      typhoonManager: null
    };
  },
  mounted() {
    this.typhoonManager = TyphoonManager.getInstance();

    this.forecasts = [...this.typhoonManager.getForecasts()];
   // this.checked = [...this.typhoonManager.getForecasts()];
  },
  computed:{
    checkedForecasts(){
      return this.typhoonManager?[...this.typhoonManager.getForecastsChecked()]:[]
    }
  },
  watch:{
    checkedForecasts(val){
      this.checked = val;
    }
  },
  methods: {
    getColor(val) {
      return getYBColor(val);
    },
    forecastChange(vals) {
      this.typhoonManager.setForecasts(vals);
    }
  }
};
</script>
<style lang="scss" scoped>
.legend-wrapper {
  width: 200px;
  > :not(:last-child) {
    margin-bottom: 8px;
  }
  .title {
    font-size: 14px;
  }
  .legend-group {
    display: grid;
    grid-template-columns: 50% 50%;

    /deep/.el-checkbox {
      margin-right: 10px;
    }
    > div {
      display: inline-flex;
      align-items: center;
      margin: 2px 0;
      .circle {
        height: 12px;
        width: 12px;
        border-radius: 6px;
        margin-right: 3px;
      }
      .label {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>
