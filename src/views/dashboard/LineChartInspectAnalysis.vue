<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        val && this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions(this.chartData || {});
    },
    setOptions({ xData, yData } = {}) {
      this.chart.setOption({
        title: {
          left: 'center',
          text: '问题高峰分析曲线图'
        },
        xAxis: {
          data: xData,
          boundaryGap: true,
          type: 'category',
          axisTick: {
            show: false
          }
        },
        grid: {
          left: '6%',
          right: '6%',
          bottom: 20,
          top: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          left: '10%',
          data: ['问题']
        },
        series: [
          {
            name: '问题',
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: yData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      });
    }
  }
};
</script>
