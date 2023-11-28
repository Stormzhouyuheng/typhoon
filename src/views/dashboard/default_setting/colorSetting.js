import echarts from 'echarts'
import {defaultChartColor1,defaultChartColor2,defaultChartColor3,defaultChartColor4,defaultChartColor5,defaultChartColor6} from '@/utils/color'
/*默认渐变数组*/
export function defaultChartColorGradient1() {
  let colorArr = [];
  let colorArr1 = defaultChartColor1();
  let colorArr2 = defaultChartColor2();
  colorArr1.forEach((item,i)=>{
    let temp =  new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
      offset: 0,
      color: item // 0% 处的颜色
    }, {
      offset: 1,
      color: colorArr2[i] // 100% 处的颜色
    }]);
    colorArr.push(temp);
  });
  return colorArr;
}
/*默认渐变数组2*/
export function defaultChartColorGradient2() {
  let colorArr = [];
  let colorArr1 = defaultChartColor4();
  let colorArr2 = defaultChartColor5();
  colorArr1.forEach((item,i)=>{
    let temp =  new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
      offset: 0,
      color: item // 0% 处的颜色
    }, {
      offset: 1,
      color: colorArr2[i] // 100% 处的颜色
    }]);
    colorArr.push(temp);
  });
  return colorArr;
}
/*获取渐变组1中的某个index的渐变值*/
export function getColorGradientByIndex(index) {
  let colorArr1 = defaultChartColor4();
  let colorArr2 = defaultChartColor5();

  let temp =  new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
    offset: 0,
    color: colorArr1[index] // 0% 处的颜色
  }, {
    offset: 1,
    color: colorArr2[index] // 100% 处的颜色
  }])
  return temp;
}
/*获取渐变组2中的某个index的渐变值*/
export function getColorGradient2ByIndex(index) {
  let colorArr1 = defaultChartColor4();
  let colorArr2 = defaultChartColor5();

  let temp =  new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
    offset: 0,
    color: colorArr1[index] // 0% 处的颜色
  }, {
    offset: 1,
    color: colorArr2[index] // 100% 处的颜色
  }])

  return temp;
}
