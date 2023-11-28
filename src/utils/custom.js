import moment from "moment";

/**
 * 鼠标可以移动的范围
 * pt:鼠标按下的点
 * compRact：要移动组件的矩形对象
 * containerRact：容器的矩形对象
 * return 的范围为浏览器窗口中的范围（offset为左上角相对于浏览器的偏移）
 */
const mouseBounds = (pt, compRact, containerRact) => {
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
const calcPositon = (pt, bounds) => {
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
const getMiddlePositon = (parentRect, childRect) => {
  let left = 0,
    top = 0;
  if (parentRect && childRect) {
    left = (parentRect.width - childRect.width) / 2;
    top = (parentRect.height - childRect.height) / 2;
  }
  return { left, top };
};

/**
 * 获取图标配置
 * @param {*} param0
 */
const getIconOption = ({ iconUrl, iconSize } = {}) => {
  return {
    url: iconUrl || "../static/img/marker-icon.png",
    size: iconSize || [26, 50],
    anchor: iconSize ? [iconSize[0] / 2, iconSize[1]] : [13, 50]
  };
};
/**
 * 下在canvas里的内容图片
 * @param {canvas} canvas canvas实例
 * @param {Number} x 起点x
 * @param {Number} y 起点y
 * @param {Number} width 宽度
 * @param {Number} height 高度
 */
const downImageFormCanvas = (canvas, x, y, width, height) => {
  // 创建一个用于截取的canvas
  let clipCanvas = document.createElement("canvas");
  clipCanvas.width = width;
  clipCanvas.height = height;
  // 截取图片
  clipCanvas
    .getContext("2d")
    .drawImage(canvas, x, y, width, height, 0, 0, width, height);
  let clipImgBase64 = clipCanvas.toDataURL(); // 生成图片url

  // 下载图片
  downloadImage(clipImgBase64, new Date().toLocaleString() + "_截图");
};

/**
 * 图片下载
 * @param {*} dataUrl
 * @param {*} name
 */
const downloadImage = (dataUrl, name) => {
  download(dataUrl, name + ".png");
};

/**
 * 下载
 * @param {*} url
 * @param {*} name
 */
const download = (url, name) => {
  let link = document.createElement("a");
  link.href = url; //下载链接
  link.setAttribute("download", name);
  link.style.display = "none"; //a标签隐藏
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 地图配置文件中服务地址统一替换服务域
 * @param {*} data 配置文件内容
 * @param {*} domain 域
 * @param {*} replaceKeys 需替换的字段
 */
const replaceServiceDomain = (data, domain, replaceKeys) => {
  for (const key in data) {
    let obj = data[key];
    if (Array.isArray(obj)) {
      obj = obj.map(item => {
        if(typeof item === "object"){
          return replaceServiceDomain(item, domain, replaceKeys);
        }else{
          return item
        }

      });
    } else if (typeof obj === "object") {
      obj = replaceServiceDomain(obj, domain, replaceKeys);
    } else {
      if (replaceKeys.includes(key)) {
        let a = document.createElement("a");
        a.href = obj;
        obj.indexOf(a.hostname) < 0 && (obj = domain + obj);
        a = null;
      }
    }
    data[key] = obj;
  }
  return data;
};

/**
 * 边留空白计算，margin要与grid设置一致
 * @param {*} height
 * @param {*} width
 * @param {*} margin
 */
const calcMargin = (height, width, margin = 0) => {
  let ratio = window.devicePixelRatio;
  let mHeight = height * margin,
    mWidth = width * margin,
    innerWidth = (width - 2 * mWidth) * ratio,
    innerHeight = (height - 2 * mHeight) * ratio;
  return {
    outerWidth: width * ratio,
    outerHeight: height * ratio,
    innerHeight,
    innerWidth,
    marginHeight: mHeight * ratio,
    marginWidth: mWidth * ratio
  };
};

/**
 * canvas 绘制背景图片
 * @param {*} url
 * @param {*} param1
 */
const getImage = (
  url,
  {
    outerWidth,
    outerHeight,
    innerHeight,
    innerWidth,
    marginHeight,
    marginWidth
  }
) => {
  let img = new Image();
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = outerWidth;
  canvas.height = outerHeight;

  return new Promise((resolve, reject) => {
    img.onload = function() {
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        marginWidth,
        marginHeight,
        innerWidth,
        innerHeight
      );
      resolve({
        src: canvas.toDataURL(),
        width: img.width,
        height: img.height
      });
    };
    img.src = url;
  });
};

const handleSensorForChart = data => {
  let last = null,
    old = null,
    res = data.reduce((prev, { name, type, value, time }) => {
      let item = prev[name + type];
      let timeIns = moment(time);
      //最大最小时间，插值使用
      if (!(last && old)) {
        last = old = timeIns;
      } else {
        timeIns.isAfter(last, "hour") && (last = timeIns);
        timeIns.isBefore(old, "hour") && (old = timeIns);
      }

      if (item) {
        item.push([timeIns.format("YYYY-MM-DD HH"), value]);
      } else {
        prev[name + type] = [[timeIns.format("YYYY-MM-DD HH"), value]];
      }
      return prev;
    }, {});
  return {
    res,
    last,
    old
  };
};

export {
  mouseBounds,
  calcPositon,
  getMiddlePositon,
  getIconOption,
  downImageFormCanvas,
  replaceServiceDomain,
  getImage,
  calcMargin,
  handleSensorForChart,
  downloadImage,
  download
};
