import {
  featureGroup,
  polyline,
  polygon,
  point,
  icon,
  divIcon,
  marker,
  Marker,
  layerGroup,
  LatLng,
  LatLngBounds
} from "leaflet";

/** 防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  var args, result, thisArg, timeoutId;

  function delayed() {
    timeoutId = null;
    if (!immediate) {
      result = func.apply(thisArg, args);
    }
  }

  return function() {
    var isImmediate = immediate && !timeoutId;
    args = arguments;
    thisArg = this;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(delayed, wait);

    if (isImmediate) {
      result = func.apply(thisArg, args);
    }
    return result;
  };
}

//节流
export function throttling(fn, wait, immediate) {
  let timer,
    timeStamp = 0;
  let context, args;

  let run = () => {
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(context, args);
      }
      clearTimeout(timer);
      timer = null;
    }, wait);
  };

  return function() {
    context = this;
    args = arguments;
    if (!timer) {
      if (immediate) {
        fn.apply(context, args);
      }
      run();
    }
  };
}

/**
 * 定位图形到视图中心
 * @param {*} geo
 * @param {*} map
 * @returns
 */
export function locationFeature(geo, map) {
  if (!geo || !map) {
    return;
  }
  if (geo instanceof Marker) {
    map.flyTo(geo.getLatLng());
  } else {
    map.flyToBounds(geo.getBounds());
  }
}


/**
 *通过坐标串数据获取坐标点范围
 * @param {Latlng[]} latlngs
 */
export function getBoundsByLatlngs(latlngs) {
  let bounds = null;
  if (latlngs) {
    bounds = new LatLngBounds(latlngs);
  }
  return bounds;
}


/**
 * 获取文本px宽度
 * @param font{String}: 字体样式
 **/
String.prototype.pxWidth = function(font = "") {
  // re-use canvas object for better performance
  var canvas =
      String.prototype.pxWidth.canvas ||
      (String.prototype.pxWidth.canvas = document.createElement("canvas")),
    context = canvas.getContext("2d");

  font && (context.font = font);
  var metrics = context.measureText(this);

  return metrics.width;
};

String.prototype.byteLength = function() {
  var length = 0;
  Array.from(this).map(function(char) {
    if (char.charCodeAt(0) > 255) {
      //字符编码大于255，说明是双字节字符
      length += 2;
    } else {
      length++;
    }
  });

  return length;
};

/**
 * 鼠标可以移动的范围
 * pt:鼠标按下的点
 * compRact：要移动组件的矩形对象
 * containerRact：容器的矩形对象
 * return 的范围为浏览器窗口中的范围（offset为左上角相对于浏览器的偏移）
 */
export const mouseBounds = (pt, compRact, containerRact) => {
  return {
    left: containerRact.left + (pt.x - compRact.left),
    right: containerRact.right - (compRact.right - pt.x),
    top: containerRact.top + (pt.y - compRact.top),
    bottom: containerRact.bottom - (compRact.bottom - pt.y),
    offsetX: containerRact.left + (pt.x - compRact.left),
    offsetY: containerRact.top + (pt.y - compRact.top)
  };
};
/**
 * 计算窗口在父节点中的位置
 * @param {*} pt
 * @param {*} bounds
 */
export const calcPositon = (pt, bounds) => {
  const left =
    (pt.x > bounds.left && pt.x < bounds.right
      ? pt.x
      : pt.x >= bounds.right
      ? bounds.right
      : bounds.left) - bounds.offsetX;
  const top =
    (pt.y > bounds.top && pt.y < bounds.bottom
      ? pt.y
      : pt.y >= bounds.bottom
      ? bounds.bottom
      : bounds.top) - bounds.offsetY;
  return { left, top };
};

/**
 * 计算子窗体在父窗体内居中的位置
 * @param {*} parentRect
 * @param {*} childRect
 */
export const getMiddlePositon = (parentRect, childRect) => {
  let left = 0,
    top = 0;
  if (parentRect && childRect) {
    left = (parentRect.width - childRect.width) / 2;
    top = (parentRect.height - childRect.height) / 2;
  }
  return { left, top };
};
