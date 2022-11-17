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
