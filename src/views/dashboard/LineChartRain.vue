<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {defaultChartColorGradient1} from '@/views/dashboard/default_setting/colorSetting'
import {defaultChartColor2} from '@/utils/color'
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
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData);
    },
    setOptions({ titleText,legendArr, xData,periodicData,dailyData } = {}) {
      const colorList = defaultChartColor2();
      const colorSeries = defaultChartColorGradient1();
      this.chart.setOption({
        title: {
          text: titleText,
          textStyle: {
            fontSize: 12,
            fontWeight: 400
          },
          left: 'center',
          top: '5%'
        },
        legend: {
          icon: 'circle',
          top: '5%',
          right: '5%',
          itemWidth: 6,
          itemGap: 20,
          textStyle: {
            color: '#556677'
          },
          data:legendArr,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              show: true,
              backgroundColor: '#fff',
              color: '#556677',
              borderColor: 'rgba(0,0,0,0)',
              shadowColor: 'rgba(0,0,0,0)',
              shadowOffsetY: 0
            },
            lineStyle: {
              width: 0
            }
          },
          backgroundColor: '#fff',
          textStyle: {
            color: '#5c6c7c'
          },
          padding: [10, 10],
          extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
        },
        grid: {
          top: '15%',
          bottom:'8%',
        },
        xAxis: [{
          type: 'category',
          data: xData,
          axisLine: {
            lineStyle: {
              color: '#DCE2E8'
            }
          },
          axisTick: {
            show: true
          },
          axisLabel: {
          //  interval: 0,
            textStyle: {
              color: '#556677'
            },
            // 默认x轴字体大小
            fontSize: 12,
            // margin:文字到x轴的距离
          },
          axisPointer: {
            label: {
              padding: [0, 0, 10, 0],
              // 移入时的字体大小
              fontSize: 12,
              backgroundColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: '#fff' // 0% 处的颜色
                }, {
                  // offset: 0.9,
                  offset: 0.86,
                  color: '#fff' // 0% 处的颜色
                }, {
                  offset: 0.86,
                  color: '#33c0cd' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#33c0cd' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          boundaryGap: true
        }],
        yAxis: [{
          name:'时段雨量（mm）',
          nameLocation:'center',
          nameGap:50,
          nameTextStyle:{
            color:'#999'
          },
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#DCE2E8'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#556677'
            }
          },
          splitLine: {
            show: false
          }
        }, {
          name:'日降雨量（mm）',
          nameLocation:'center',
          nameGap:50,
          nameTextStyle:{
            color:'#999'
          },
          type: 'value',
          position: 'right',
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#556677'
            },
            formatter: '{value}'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#DCE2E8'
            }
          },
          splitLine: {
            show: false
          }
        }],
        series: [{
          name: legendArr[0],
          type: 'line',
          data: periodicData,
          symbolSize: 1,
          symbol: 'circle',
          smooth: true,
          yAxisIndex: 0,
          showSymbol: false,
          lineStyle: {
            width: 5,
            color: colorSeries[0],
            shadowColor: 'rgba(158,135,255, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 20
          },
          itemStyle: {
            normal: {
              color: colorList[0],
              borderColor: colorList[0]
            }
          }
        }, {
          name: legendArr[1],
          type: 'line',
          data: dailyData,
          symbolSize: 1,
          symbol: 'circle',
          smooth: true,
          yAxisIndex: 1,
          showSymbol: false,
          lineStyle: {
            width: 5,
            color: colorSeries[1],
            shadowColor: 'rgba(115,221,255, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 20
          },
          itemStyle: {
            normal: {
              color: colorList[1],
              borderColor: colorList[1]
            }
          }
        },
        /*  {
            name: legendArr[2],
            type: 'line',
            data: inData,
            symbolSize: 1,
            yAxisIndex: 1,
            symbol: 'circle',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: '#fe9a'
              },
                {
                  offset: 1,
                  color: '#fe9a8b'
                }
              ]),
              shadowColor: 'rgba(254,154,139, 0.3)',
              shadowBlur: 10,
              shadowOffsetY: 20
            },
            itemStyle: {
              normal: {
                color: colorList[2],
                borderColor: colorList[2]
              }
            }
          }*/
        ]
      })
    }
  }
}
</script>
