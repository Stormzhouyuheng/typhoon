<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';

const defaultConfig = {
  type: 'pie',
  clockWise: false, //顺时加载
  hoverAnimation: false, //鼠标移入变大
  center: ['40%', '50%'],
  label: {
    show: false
  },
  itemStyle: {
    label: { show: false },
    labelLine: { show: false },
    borderWidth: 5
  }
};

function getData(data) {
  let series = [];
  let yAxis = data.map(({ value, name, count }, i) => {
    series.push({
      name: '告警级别',
      radius: [90 - i * 18 + '%', 78 - i * 18 + '%'],
      ...defaultConfig,
      data: [
        {
          value,
          name
        },
        {
          value: count ? count - value : 1,
          itemStyle: { color: 'rgba(0,0,0,0)', borderWidth: 0 },
          tooltip: { show: false },
          hoverAnimation: false
        }
      ]
    });
    series.push({
      name: '',
      silent: true,
      z: 1,
      radius: [90 - i * 18 + '%', 78 - i * 18 + '%'],
      ...defaultConfig,
      data: [
        {
          value: 7.5,
          itemStyle: { color: '#E3F0FF', borderWidth: 0 },
          tooltip: { show: false },
          hoverAnimation: false
        },
        {
          value: 2.5,
          itemStyle: { color: 'rgba(0,0,0,0)', borderWidth: 0 },
          tooltip: { show: false },
          hoverAnimation: false
        }
      ]
    });
    return (count ? (value / count) * 100 : count).toFixed(2) + '%';
  });
  return {
    yAxis,
    series
  };
}
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
      default: '300px'
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
  mounted() {
    this.initChart();
  },
  watch: {
    chartData: {
      deep: true,
      handler: function(val) {
        this.$nextTick(() => {
          if (this.chart) {
            this.chart.clear(); //清除数据重叠问题
          }
          if (val) {
            this.setOptions(val);
          }
        });
      }
    }
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
      if (this.chartData) {
        this.setOptions(this.chartData);
      }
    },
    setOptions({ data, legendArr } = {}) {
      const optionData = data ? getData(data) : {};
      let option = {
        backgroundColor: '#fff',
        legend: {
          show: true,
          top: 'center',
          left: '75%',
          data: legendArr,
          itemWidth: 30,
          itemHeight: 20,
          width: 50,
          padding: [0, 5],
          itemGap: 15,
          formatter: function(name) {
            return '{title|' + name + '}';
          },
          textStyle: {
            rich: {
              title: {
                fontSize: 12,
                lineHeight: 10,
                color: 'rgba(0,0,0,.45)'
              },
              value: {
                fontSize: 14,
                lineHeight: 18,
                color: 'rgba(0,0,0,.85)'
              }
            }
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{a}<br>{b}:{c}({d}%)'
        },
        color: ['#E60000', '#EF6C00', '#FFC958', '#4B88E2'],
        grid: {
          top: '4%',
          bottom: '60%',
          left: '40%',
          containLabel: false
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              interval: 0,
              inside: true,
              textStyle: { color: '#000', fontSize: 12 },
              show: true
            },
            data: optionData.yAxis
          }
        ],
        xAxis: [{ show: false }],
        series: optionData.series
      };
      this.chart && this.chart.setOption(option);
    }
  }
};
</script>
