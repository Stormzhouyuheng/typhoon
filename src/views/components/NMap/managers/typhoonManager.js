import {
  point,
  marker,
  polyline,
  featureGroup,
  divIcon,
  circleMarker,
  circle
} from "leaflet";
import moment from "moment";

const SVG = `<svg class="animate-typhoon" viewBox="0 0 58.67 58.67"><style type="text/css">.icon{fill:currentColor;stroke:#fff;stroke-width:1;stroke-miterlimit:10;}.circle{fill:#fff;}</style><path class="icon" 
        d="M38,2.46A29.43,29.43,0,0,1,47.52,4,29.24,29.24,0,0,0,35.23,8.6l0,0A29.36,29.36,0,0,1,59.75,47.31,29.19,29.19,0,0,0,55.16,35,29.35,29.35,0,0,1,16.48,59.55,29.13,29.13,0,0,0,28.77,
        55l0,0A29.36,29.36,0,0,1,4.25,16.28,29.1,29.1,0,0,0,8.84,28.6,29.33,29.33,0,0,1,38,2.46ZM32,21.79a10,10,0,1,0,10,10A10,10,0,0,0,32,21.79Z" transform="translate(-2.67 -2.46)"/>
        <circle class="circle" cx="29.33" cy="29.33" r="11.12"/></svg>`;
const levelColors = [
  "#000000",
  "#FBF558",
  "#2C7EEF",
  "#5BF95D",
  "#F6B344",
  "#E687EA",
  "#F02125"
];
const PANE = "typhoonPane";

export default class TyphoonManager {
  constructor(map) {
    if (!arguments.length) {
      throw new Error("构造函数入参不可为空!");
    }
    this.map = map;
    this.init();
  }
  static getInstance(map) {
    if (!this.Instance && map) {
      this.Instance = new TyphoonManager(map);
    }
    return this.Instance;
  }
  static setInstance(){
    this.Instance = null;
  }
  init() {
    this.map.getPane(PANE) || this.map.createPane(PANE);
    this.map.addLayer((this.warnLine = this.createWarnLine()));
    this.typhoons = [];
    this.forecastsChecked = [];
    this.forecasts = ["中国", "香港", "台湾", "日本", "美国", "广州"];
  }
  //创建台风
  create(source, name) {
    let typhoon = new Typhoon(source, this.map, {
      forecasts: this.forecasts,
      name
    });
    this.typhoons.push(typhoon);
    this.showExtend();
    return typhoon;
  }
  //获取台风实例
  getTyphoon(id) {
    let res = null;
    this.typhoons.some((item, i) => {
      if (item.id === id) {
        res = item;
        return true;
      }
    });
    return res;
  }
  getAll() {
    return [...this.typhoons];
  }
  getForecasts() {
    return [...this.forecasts];
  }
  getForecastsChecked() {
    return [...this.forecastsChecked];
  }
  setForecasts(forecasts) {
    this.forecastsChecked = [...forecasts];
    this.typhoons.map(typhoon => {
      typhoon.showForecastRoute([...forecasts]);
    });
  }
  //移除台风
  remove(tfbh) {
    this.typhoons.some((item, i, arr) => {
      if (item.id === tfbh) {
        let [delTyphoon] = arr.splice(i, 1);
        delTyphoon.destroy();
        return true;
      }
    });
  }
  removeAll() {
    this.typhoons.map(typhoon => {
      typhoon.destroy();
    });
    this.typhoons = [];
  }
  //展示预测路径
  showForecat(feature, data) {
    this.typhoons.some((item, i) => {
      if (item.id === feature.tfbh) {
        item.showForecat(feature, data);
        return true;
      }
    });
  }

  /**
   * 打开或关闭台风点tip
   * @param {String} typhoon 台风标识
   * @param {String} nodeId 台风节点标识(T)
   * @param {Boolean} show 是否显示
   */
  toggleTip(typhoon, nodeId, show) {
    let target = null;
    if (typhoon instanceof Typhoon) {
      target = typhoon;
    } else {
      this.typhoons.some(item => {
        if (item.id == typhoon) {
          target = item;
          return true;
        }
      });
    }

    if (target) {
      target.route.getLayers().some(layer => {
        if (layer._latlng && layer.options.id == nodeId) {
          layer.fire(show ? "mouseover" : "mouseout");
          return true;
        }
      });
    }
  }
  //模拟点击台风
  imitateClick(typhoon, nodeId) {
    let target = null;
    if (typhoon instanceof Typhoon) {
      target = typhoon;
    } else {
      this.typhoons.some(item => {
        if (item.id == typhoon) {
          target = item;
          return true;
        }
      });
    }
    if (target) {
      target.route.getLayers().some(layer => {
        if (layer._latlng && layer.options.id == nodeId) {
          layer.fire("click");
          return true;
        }
      });
    }
  }

  //显示范围调整
  showExtend() {
    this.map.flyToBounds(
      this.typhoons
        .reduce((prev, { bounds }) => {
          return prev ? prev.extend(bounds) : bounds;
        }, null)
        .pad(0.1)
    );
  }

  //绘制警戒线
  createWarnLine() {
    let latlngs48 = [[34, 132], [15, 132], [0, 120], [0, 105]],
      latlngs24 = [
        [34, 127],
        [22, 127],
        [18, 119],
        [11, 119],
        [4.5, 113],
        [0, 105]
      ],
      lineOption = color => {
        return {
          color,
          weight: 2,
          dashArray: "8",
          dashOffset: "4"
        };
      },
      iconOption = time => {
        return {
          html: `<p style="color:#FFFF00;">${time}小时警戒线</p>`,
          iconSize: [20, 120],
          iconAnchor: [-4, -10],
          className: "warning-line-tip-wrapper"
        };
      },
      line48 = polyline(latlngs48, lineOption("#FFFF00")),
      line24 = polyline(latlngs24, lineOption("#5378F8")),
      line48Lable = marker(latlngs48[0], {
        icon: divIcon(iconOption(48)),
        pane: "overlayPane"
      }),
      line24Lable = marker(latlngs24[0], {
        icon: divIcon(iconOption(24)),
        pane: "overlayPane"
      });
    return featureGroup([line24, line24Lable, line48, line48Lable], {
      pane: "overlayPane"
    });
  }

  destroy() {
    console.log('调用销毁');
    this.map.removeLayer(this.warnLine);
    this.removeAll();
  }
}

class Typhoon {
  /**
   * 台风数据源
   * @param {*} source
   * @param {*} map
   */
  constructor(source, map, options) {
    if (!arguments.length) {
      throw new Error("入参不可为空！");
    }
    this.map = map;
    this.options = options;
    this.init(source);
  }
  init(source) {
    //数据处理
    let features = handleData(source);
    this.id = source[0]["tfbh"]; //id

    //台风生成
    this.forecastLayer = featureGroup([], { pane: PANE });
    this.windCircleLayer = featureGroup([], { pane: PANE });
    this.typhoonIcon = this.createTyphoonIcon(features[0].latlng).on(
      "mouseover mouseout",
      this.dotMouseEventHandle
    );
    this.route = this.createTyphoon(features).on("snakeend", ({ target }) => {
      let t = features[features.length - 1]["t"];
      target.getLayers().some(layer => {
        if (layer._latlng && layer.options.id === t) {
          layer.fire("click", { showPop: false });
          return true;
        }
      });
    });
    this.bounds = this.route.getBounds();
    //将台风添加到地图
    this.map.addLayer(this.windCircleLayer);
    this.map.addLayer(this.route.on("add", this.route.snakeIn));
    this.map.addLayer(this.typhoonIcon);
    this.map.addLayer(this.forecastLayer);
    this.features = features;
    this.forecastRoutes = [];

    let _this = this;
    setTimeout(()=>{
      _this.map.setView([22.8723, 108.9184], 5);
    },100);
  }
  destroy() {
    this.map.removeLayer(this.typhoonIcon);
    this.map.removeLayer(this.forecastLayer);
    this.map.removeLayer(this.route);
    this.map.removeLayer(this.windCircleLayer);
    this.features = null;
    this.forecastRoutes = null;
    this.options = null;
  }

  //生成台风图标
  createTyphoonIcon(latlng) {
    return marker(latlng, {
      icon: divIcon({
        html: SVG,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        className: "animate-typhoon-wrapper"
      }),
      pane: PANE
    });
  }
  //生成台风路径
  createTyphoon(features) {
    let geos = features.map(({ color, latlngs, latlng, ...other }, index) => {
      let geo = null;
      if (latlng) {
        geo = circleMarker(latlng, {
          initColor: color,
          radius: 3,
          color,
          fillColor: color,
          fillOpacity: 1,
          pane: PANE,
          id: other.t,
          data: other
        })
          .bindPopup(...this.getPopupContent(other))
          .on("mouseover mouseout", this.dotMouseEventHandle)
          .on("click", ({ target, showPop }) => {
            this.typhoonClick(target, index, geos, showPop);
          });
      } else {
        geo = polyline(latlngs, {
          snakingSpeed: 500, //轨迹速度
          color,
          initColor: color,
          pane: PANE
        }) //置底，不挡住点
          .once("snakestart", ({ target }) => {
            target.bringToBack();
          })
          .once("snakeend", ({ target }) => {
            target.off("snake", this.snaking);
          })
          .on("snake", this.snaking.bind(this));
      }
      return geo;
    });
    let first = geos[0];
    first
      .bindTooltip(this.options.name, {
        offset: point(5, 0),
        direction: "right",
        permanent: true
      })
      .openTooltip();

    return featureGroup(geos, {
      snakingPause: 0,
      pane: PANE
    });
  }
  //台风点鼠标事件处理
  dotMouseEventHandle({ type, target }) {
    if (type === "mouseover") {
      target.setRadius && target.setRadius(6);
      target.isPopupOpen() || target.openPopup();
    } else {
      target.setRadius && target.setRadius(3);
      target.isPopupOpen() && target.closePopup();
    }
  }
  //台风点点击
  typhoonClick(geo, index, geos, showPop = true) {
    let feature = this.features[index];
    this.route.fire("point-click", { feature });
    this.bindPopup(feature);

    if (showPop) {
      geo.isPopupOpen() || geo.openPopup();
    } else {
      geo.isPopupOpen() && geo.closePopup();
    }

    geos.map((item, i) => {
      if (i > index) {
        item.setStyle({ color: "#FAFAF8" });
      } else {
        const { color, initColor } = item.options;
        color !== initColor && item.setStyle({ color: initColor });
      }
    });
    this.update(geo.getLatLng(), geo.options.initColor);
    this.drawWindCircle(geo.getLatLng(), geo.options.data);
  }

  //台风路径更新
  snaking({ type, target }) {
    const {
      _latlngs,
      _snakingRings,
      options: { color }
    } = target;
    let latlngs = _latlngs[_snakingRings];
    this.update(latlngs[latlngs.length - 1], color);
  }

  //更新台风位置和颜色
  update(latlng, color) {
    this.typhoonIcon.setLatLng(latlng)._icon.style.color = color;
  }

  //绘制风圈
  drawWindCircle(latlng, { radius10, radius7 }) {
    this.windCircleLayer.clearLayers();
    if (radius7) {
      this.windCircleLayer.addLayer(
        circle(latlng, {
          radius: +radius7 * 1000,
          color: "#D35568"
        })
      );
    }
    if (radius10) {
      this.windCircleLayer.addLayer(
        circle(latlng, {
          radius: +radius10 * 1000
        })
      );
    }
  }

  //展示预测线路
  showForecat({ t, latlng }, data) {
    let source = data.reduce((prev, item) => {
      let cur = prev[item.sets];
      if (!cur) {
        prev[item.sets] = [item];
      } else {
        cur.push(item);
      }
      return prev;
    }, {});

    this.forecastRoutes = Object.keys(source).map(key => {
      let item = source[key];
      item.unshift({ sets: key, forecastT: t, latlng });
      let res = handleForecastData(item);
      return this.createForecastRoute(res, key);
    });

    this.showForecastRoute();
  }

  //生成预测线路
  createForecastRoute({ points, lineLatlngs }, SETS) {
    let layers = points.map(item => {
      const { color, latlng, sets, ...other } = item;
      return circleMarker(latlng, {
        radius: 3,
        color,
        fillColor: color,
        fillOpacity: 1,
        pane: PANE
      })
        .bindPopup(...this.getPopupContent(item, "forecast"))
        .on("mouseover mouseout", this.dotMouseEventHandle);
    });
    layers.unshift(
      polyline(lineLatlngs, {
        color: getYBColor(SETS),
        pane: PANE,
        dashArray: "8",
        dashOffset: "4",
        weight: 2
      }).once("add", e => {
        e.sourceTarget.bringToBack();
      })
    );
    return featureGroup(layers, { pane: PANE, sets: SETS });
  }
  //显示预报路径
  showForecastRoute(forecasts) {
    this.forecastLayer.clearLayers();
    let fs = forecasts || this.options.forecasts || [];
    if (fs.length) {
      this.forecastRoutes.map(route => {
        let setStr = getYBDepartment(route.options.sets);
       // if (fs.indexOf(route.options.sets) > -1) {
        if (fs.indexOf(setStr) > -1) {
          this.forecastLayer.addLayer(route);
        }
      });
    }
    this.options.forecasts = fs;
  }

  //台风绑定弹窗内容
  bindPopup(params) {
    if (this.typhoonIcon.getPopup()) {
      this.typhoonIcon.setPopupContent(...this.getPopupContent(params));
    } else {
      this.typhoonIcon.bindPopup(...this.getPopupContent(params));
    }
  }

  //弹窗内容生成 type: forecast
  getPopupContent(data, type) {
    const {
      t,
      strong,
      speed,
      power,
      moveSpeed,
      pressure,
      longitude,
      latitude,
      moveDir,
      radius7,
      radius10,
      radius12,
      sets,
      forecastT
    } = data;
    let str = "";
    if (type === "forecast") {
      str = `<div class="content-wrap">
        <div><div class="title">${sets || ""} ${moment(forecastT).format(
        "MM月DD日 HH时"
      )} 预报</div></div>
        <div><div class="label">强度</div><span>${strong || ""}</span></div>
        <div><div class="label">风力等级</div><span>${power ||
          ""}级</span></div>
        <div><div class="label">最大风速</div><span>${speed ||
          ""}m/s</span></div>
        <div><div class="label">中心气压</div><span>${pressure ||
          ""}Pa</span></div>
      </div>`;
    } else {
      str = `<div class="content-wrap">
        <div><div class="title">${moment(t).format("MM月DD日 HH时")}</div></div>
        <div><div class="label">中心位置</div><span>${longitude}°/${latitude}°</span></div>
        <div><div class="label">强度</div><span>${strong || ""}</span></div>
        <div><div class="label">风力等级</div><span>${power ||
          ""}级</span></div>
        <div><div class="label">最大风速</div><span>${speed ||
          ""}m/s</span></div>
        <div><div class="label">中心气压</div><span>${pressure ||
          ""}Pa</span></div>
        <div><div class="label">移动速度</div><span>${moveSpeed ||
          ""}km/h</span></div>
        <div><div class="label">移动方向</div><span>${moveDir ||
          ""}</span></div>
        <div><div class="label">七级半径</div><span>${radius7 ||
          ""}km</span></div>
        <div><div class="label">十级半径</div><span>${radius10 ||
          ""}km</span></div>
      </div>`;
    }
    return [
      str,
      {
        closeButton: false,
        offset: point(0, -10)
      }
    ];
  }
}

//根据预报单位获取预报路径颜色
export function getYBColor(source) {
  var color = "";
  switch (source) {
    case "美国":
    case "关岛（美国）":
      color = "#ff8c00";
      break;
    case "日本":
      color = "#2B4678";
      break;
    case "中国":
    case "广东":
      color = "#ff0000";
      break;
    case "香港":
    case "中国香港":
      color = "#C8C800";
      break;
    case "台湾":
    case "中国台湾":
      color = "#3C7832";
      break;
    case "广州":
    case "中国广州":
      color = "#914daa";
      break;
    case "韩国":
      color = "#1ae2f2";
      break;
    default:
      color = "#3C7832";
  }
  return color;
}

//根据数据获取图例的预报单位
export function getYBDepartment(source) {
  var str = "";
  switch (source) {
    case "美国":
    case "关岛（美国）":
      str = "美国";
      break;
    case "日本":
      str = "日本";
      break;
    case "中国":
    case "广东":
      str = "中国";
      break;
    case "香港":
    case "中国香港":
      str = "香港";
      break;
    case "台湾":
    case "中国台湾":
      str = "#3C7832";
      break;
    case "广州":
    case "中国广州":
      str = "广州";
      break;
    case "韩国":
      str = "韩国";
      break;
    default:
      str = "台湾";
  }
  return str;
}

//获取台风级别
export function getLevel(power) {
  let level = 0;
  switch (+power) {
    case 6:
    case 7:
      level = 1;
      break;
    case 8:
    case 9:
      level = 2;
      break;
    case 10:
    case 11:
      level = 3;
      break;
    case 12:
    case 13:
      level = 4;
      break;
    case 14:
    case 15:
      level = 5;
      break;
    default:
      power > 15 && (level = 6);
  }
  return level;
}

//处理台风数据
function handleData(data) {
  let features = [],
    lastFeature = null;
  (data || []).map(item => {
    const { t, longitude, latitude, power, strong, speed } = item;
    let level = getLevel(power),
      color = levelColors[level],
      latlng = [latitude, longitude];
    if (!lastFeature) {
      features.push((lastFeature = { ...item, color, latlng }));
    } else {
      //线
      features.push({
        ...item,
        color: lastFeature.color,
        latlngs: [[...lastFeature.latlng], latlng]
      });
      //点
      features.push((lastFeature = { ...item, color, latlng }));
    }
  });
  return features;
}

//节点点击后续预报数据处理
function handleForecastData(data) {
  let points = [],
    lineLatlngs = [];
  (data || []).map((item, index) => {
    const { longitude, latitude, power, latlng: _latlng, forecastT } = item;
    let color = levelColors[getLevel(power)],
      latlng = _latlng || [latitude, longitude];
    if (index !== 0) {
      points.push({ ...item, color, latlng });
    }
    lineLatlngs.push(latlng);
  });
  return {
    points,
    lineLatlngs
  };
}

/* function convertWindLevel(speed) {
  try {
    speed = Number(speed);
    var windLevel = "";
    if (speed >= 0 && speed < 0.2) {
      windLevel = "0";
    } else if (speed >= 0.3 && speed < 1.6) {
      windLevel = "1";
    } else if (speed >= 1.6 && 3.4 > speed) {
      windLevel = "2";
    } else if (speed >= 3.4 && 5.5 > speed) {
      windLevel = "3";
    } else if (speed >= 5.5 && 8.0 > speed) {
      windLevel = "4";
    } else if (speed >= 8.0 && 10.8 > speed) {
      windLevel = "5";
    } else if (speed >= 10.8 && 13.9 > speed) {
      windLevel = "6";
    } else if (speed >= 13.9 && 17.2 > speed) {
      windLevel = "7";
    } else if (speed >= 17.2 && 20.8 > speed) {
      windLevel = "8";
    } else if (speed >= 20.8 && 24.5 > speed) {
      windLevel = "9";
    } else if (speed >= 24.5 && 28.5 > speed) {
      windLevel = "10";
    } else if (speed >= 28.5 && 32.6 > speed) {
      windLevel = "11";
    } else if (speed >= 32.6 && 37.0 > speed) {
      windLevel = "12";
    } else if (speed >= 37.0 && 41.4 > speed) {
      windLevel = "13";
    } else if (speed >= 41.5 && 46.1 > speed) {
      windLevel = "14";
    } else if (speed >= 46.2 && 50.9 > speed) {
      windLevel = "15";
    } else if (speed >= 51.0 && 56.0 > speed) {
      windLevel = "16";
    } else if (speed >= 56.1 && 61.2 > speed) {
      windLevel = "17";
    } else if (speed >= 61.2) {
      windLevel = "17";
    }
    return windLevel;
  } catch (e) {
    return "";
  }
}

function GetPointColor(speed) {
  var b;
  if (speed >= 10.8 && speed < 17.1) b = "#2CF92E";
  //b = "#00D5CB";
  else if (speed >= 17.1 && speed < 24.4) b = "#2C7AF7";
  //b = "#FCFA00";
  else if (speed >= 24.4 && speed < 32.6) b = "#F9F723";
  //b = "#FDAE0D";
  else if (speed >= 32.6 && speed < 41.4) b = "#F9B526";
  //b = "#FB3B00";
  else if (speed >= 41.5 && speed < 50.9) b = "#ED87F1";
  //b = "#FC4d80";
  else if (speed >= 50.9) b = "#F72F25";
  //b = "#C2218E"
  else b = "#000000";
  return b;
} */
