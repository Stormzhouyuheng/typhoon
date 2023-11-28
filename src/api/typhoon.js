import request from "@/utils/request";

//按年份获取台风列表  ?tfbh=201829&year=2018
export function getTyphoonList(params) {
  return request({
    url: "typhoon/base",
    method: "get",
    params
  });
}

//获取台风路径实测点 ?tfbh=201801
export function getTyphoon(params) {
  return request({
    url: "typhoon/points",
    method: "get",
    params
  });
}

// 获取台风实测的点到各城市的距离 ?tfbh=201801&t=2018/01/03 08:00:00
export function getCityDistance(params) {
  return request({
    url: "typhoon/point/distance",
    method: "get",
    params
  });
}

//获取台风实测的点的后续预报数据 ?pointT=2018/01/03 11:00:00&tfbh=201801
export function getForecase(params) {
  return request({
    url: "typhoon/forecast/points",
    method: "get",
    params
  });
}

/**
 * 台风分析
 * //必填台风编号，缓冲半径
 *  "tfbh":"202017",
 *  "radius":2  ,
 *
 * //非必填年月日
 *  "beginYyyy": "1954",
 *  "endYyyy":"2022",
 *  "beginMmdd":"0101",
 *  "endMmdd":"1231",
 *
 * //非必填 起点半径，经过区域，登录区域
 *  "startPointRadius" : 2,
 *  "crossPlace":"{\"type\":\"Polygon\",\"coordinates\":[[[108.215332,14.732386],[109.02832,13.581921],[108.193359,12.361466],[107.358398,12.704651],[108.061523,14.54105],[108.215332,14.732386]]]}",
 *  "landingPlace":"{\"type\":\"Polygon\",\"coordinates\":[[[108.215332,14.732386],[109.02832,13.581921],[108.193359,12.361466],[107.358398,12.704651],[108.061523,14.54105],[108.215332,14.732386]]]}",
 *
 * //非必填预测路径标识，预测单位
 *  "forecastFlag":"true",
 *  "sets":"美国",
 *
 * //台风最大强度选择
 *  // 超强台风 [16, 17, 18, 19, 20, 21, 22, 23],
 *  // 强台风   [14, 15],
 *  // 台风     [12, 13],
 *  // 强热带风暴 [10, 11],
 *  // 热带风暴  [8, 9]
 *  "powers":[8,9,10,11,12,13,14,15,16,17,18,19,20, 21, 22, 23]
 * */
export function typhoonAnalysis(data) {
  return request({
    url: "typhoon/analysis",
    method: "post",
    data
  });
}


//手动全量更新台风数据接口（非必要时不要使用）
export function updateAll() {
  return request({
    url: "/typhoon/analysis/aaaicsdolxjhfg",
    method: "get"
  });
}
