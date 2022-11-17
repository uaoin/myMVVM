/**
 * Observer类
 * 将一个object对每个层级进行defineReactive
 * __ob__属性是Observer类的实例
 * 对象有__ob__属性 说明此对象中的元素已被劫持(defineReactive)
 *
 * 1. 每个实例中都保存一个dep实例
 * 2. 传入的value中__ob__保存this（observer实例）
 * 3. 将对象的属性进行遍历 然后defineReactive
 * 4. 对于数组
 *    4.1 更改原型链
 *    4.2 对数组中的元素进行逐项observe
 *        4.2.1 元素不是对象 什么也不做
 *        4.2.2 元素是对象 进行new Observe操作
 */

import defineReactive from "./defineReactive.js";
import { def } from "./utils.js";
import { newArrProto } from "./array.js";
import observe from "./observe.js";
import Dep from "./dep.js";

class Observer {
  constructor(value) {
    // 每个Observer的实例身上,都有一个dep
    this.dep = new Dep();
    // __ob__ 用来存Observer实例(this) 不可枚举
    def(value, "__ob__", this, false);

    // 将对象的属性变为响应式
    if (Array.isArray(value)) {
      // 如果是数组 更改原型链
      Object.setPrototypeOf(value, newArrProto);
      this.observeArray(value);
      // array中的元素没有被劫持(更改setter和getter)
      // 因此直接通过数组下标去修改某一项不是响应式的
      // 通过七个方法去改写 会触发value.__ob__.dep.notity 是响应式的
    } else {
      this.walk(value);
    }
  }
  walk(value) {
    for (const key in value) {
      defineReactive(value, key);
    }
  }

  // 数组的特殊遍历
  observeArray(arr) {
    for (let i = 0, l = arr.length; i < l; i++) {
      // 逐项进行observe
      observe(arr[i]);
    }
  }
}

export { Observer };
