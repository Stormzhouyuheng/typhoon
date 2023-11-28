/**
 * 转换item某个key值内容的显示，用于显示在详情或列表中，无数据时用“-”显示,
 * @param item 树型数据
 * @param key 需要显示key值
 * @param unit 显示的单位
 * @param parentKey 上一级key值
 */
export function filterItemText(item,key,unit,parentKey){
  let returnStr = '-';
  const unitStr = unit?unit:'';
  if(item){
    if(parentKey && item[parentKey] &&item[parentKey][key]){
      returnStr = item[parentKey][key]+ unitStr;
    }else if(item[key]){
      returnStr = item[key]+ unitStr;
    }
  }
  return returnStr;
}

/**
 * （当key值内容为数字时）转换item某个key值内容的显示，用于显示在详情或列表中处理数字为多少位有效数字或者强制保留几位小数，无数据时用“-”显示，
 * @param item 树型数据
 * @param key 需要显示key值
 * @param unit 显示的单位
 * @param parentKey 上一级key值
 * @param isValid 是否为有效数字处理，true为是
 * @param num 有效数字位数或者强制保留的小数位数
 */
export function filterItemNum(item,key,unit,parentKey,isValid,num){
  let returnStr = '-';
  const unitStr = unit?unit:'';
  if(item){
    let value = null;
    if(parentKey && item[parentKey] &&item[parentKey][key]){
      value = toDecimalNum(item[parentKey][key],num);
    }else if(item[key]){
      value = Number(item[key]).toFixed(num);
    }
    returnStr = value + unitStr;
  }
  return returnStr;
}

/**
 * 有效数字
 * @param val
 * @param n 有效数字位数
 */
export function toDecimalNum(val, n) {
  let value = Number(val);
  if (value < Math.pow(10, n)) {
    return value.toPrecision(n);
  }
  else {
    let i = 0;
    while (value >= Math.pow(10, n)) {
      value = value / 10;
      i++;
    }
    let tempValue = value.toPrecision(n);
    tempValue = Number(tempValue) * Math.pow(10, i);
    return tempValue + '';
  }
}
