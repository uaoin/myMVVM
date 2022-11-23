/**
 * vm.$delete方法
 * 删除一个响应式对象
 */

import {
  isUndef,
  isPrimitive,
  isValidArrayIndex,
  hasOwn,
  isArray,
} from "./utils.js";

export function del(target, key) {
  //处理target为null undefined 和 原始类型的情况
  if (isUndef(target) || isPrimitive(target)) {
    console.warn(
      `Cannot delete reactive property on undefined, null, or primitive value: ${target}`
    );
  }

  // 现在可以保证target是引用类型

  // 处理target是数组的情况&&key为数组索引

  if (isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }

  const ob = target.__ob__;

  //不能删除vue实例中的属性
  //对于已经创建的实例 vue不允许动态删除根级别的响应式property
  //应该set为null
  if (target._isMVVM || (ob && ob.vmCount)) {
    console.warn(
      "Avoid deleting properties on a Vue instance or its root $data " +
        "- just set it to null."
    );
  }

  //处理readonly 我这里没处理

  //处理对象
  if (!hasOwn(target, key)) {
    //没有 则return
    return;
  }
  delete target[key];
  if (!ob) {
    return;
  }

  //通知watcher
  ob.dep.notify();
}
