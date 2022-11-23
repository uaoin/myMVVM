//def一个设置不可枚举方法的工具函数

export function def(data, key, value, enumerable) {
  Object.defineProperty(data, key, {
    value,
    enumerable,
    writable: true,
    configurable: true,
  });
}

export function parsePath(str) {
  const segments = str.split(".");

  return obj => {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }
    return obj;
  };
  //不reduce因为不能break
  // return obj => {
  //   return segments.reduce((prev, next) => {
  //     return prev[next];
  //   }, obj);
  // };
}

//判断v是否为undefined或者null
export function isUndef(v) {
  return v === undefined || v === null;
}

//判断是否为原始类型值 (string number symbol boolean)
export function isPrimitive(value) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "symbol" ||
    typeof value === "boolean"
  );
}

// 判断val是否为合法的数组索引
export function isValidArrayIndex(val) {
  const n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

//hasOWnProperty
const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

export const isArray = Array.isArray;
