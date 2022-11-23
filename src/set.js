/**
 * vm.$set 方法
 * 用于给一个响应式对象添加属性
 */

import defineRective from "./defineReactive.js";
import { isUndef, isPrimitive, isValidArrayIndex } from "./utils.js";

export function set(target, key, val) {
  //处理target为null undefined 和 原始类型的情况
  if (isUndef(target) || isPrimitive(target)) {
    //isUndef用来判断一个值是否为null或undefined
    //isPrimitive用来判断一个值是否为原始类型(string,number,boolean,symbol)
    console.warn(
      `Cannot set reactive proerty on undefined,null,or primitive value:${target}`
    );
  }

  // 现在可以保证target是引用类型

  //处理readonly 我这里没处理

  // 处理target是数组的情况&&key为数组索引
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    //先设置数组的长度 如果key大于数组的长度 splice会不生效
    target.length = Math.max(target.length, key);
    //这里的splice是被替换的 会触发dep.notify
    target.splice(key, 1, val);
    return val;
  }

  // 处理对象 属性已经存在的情况
  // 不用hasOwnProperty是因为有修改原型链上属性的情况(但不能是内置属性)
  if (key in target && !(key in Object.prototype)) {
    // 已经存在的会触发setter中的dep.notify
    target[key] = val;
    return val;
  }

  const ob = target.__ob__;

  //不能给vue实例增加属性 避免覆盖vue本身的方法
  //对于已经创建的实例 vue不允许动态添加根级别的响应式property
  if (target._isMVVM || (ob && ob.vmCount)) {
    console.warn(
      "Avoid adding reactive properties to a Vue instance or its root $data " +
        "at runtime - declare it upfront in the data option."
    );
  }

  if (!ob) {
    //如果target对象不存在__ob__
    //说明target对象并不是一个响应式的数据
    //只需修改属性并返回
    target[key] = val;
    return val;
  }

  //此时target必然有__ob__ 因为vm.$data已被observe

  defineRective(ob.value, key, val);
  //通知watcher
  ob.dep.notify();
  return val;
}
