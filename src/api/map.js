import request from "@/utils/mapRequest";

/**
 * 获取地图配置文件
 */
export function getMapConfig() {
  return request({
    url: "/config/mapConfig.json",
    method: "get"
  });
}

/**
 * 获取配置数据
 * @param {*} fileName
 */
export function getConfigData(fileName) {
  return request({
    url: "/config/" + fileName,
    method: "get"
  });
}

/**
 * 获取WFS服务的数据内容
 * @param {*} param  { url, layerName }
 */
export function getGeoJson({ url, layerName, filter, version }) {
  let params = {
    service: "WFS",
    version: version || "1.0.0",
    request: "GetFeature",
    typeName: layerName,
    maxFeatures: 100,
    outputFormat: "application/json"
  };
  if (filter) {
    params["filter"] = filter;
  }
  return request({
    url,
    method: "get",
    params
  });
}

/**
 * 获取wms的图例信息
 * @param {*} param0
 */
export function getLegend({ url, layerName }) {
  let params = {
    service: "WMS",
    request: "GetLegendGraphic",
    version: "1.0.0",
    height: 20,
    width: 20,
    format: "image/png",
    layer: layerName
  };
  return request({
    url,
    method: "get",
    params
  });
}

/**
 * 获取地图应用菜单相关信息文件
 */
export function getMapMenu() {
  return request({
    url: "/config/mapMenu.json",
    method: "get"
  });
}
