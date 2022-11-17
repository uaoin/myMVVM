/**
 * defineReactive函数
 * 1. 利用Object.defineProperty方法来做数据劫持
 *    数据劫持：给一个对象中的元素 加上setter 和 getter 触发时调用某些方法
 *    哪些方法：getter中触发依赖收集 setter中利用dep.notity通知watcher
 * 2. 利用闭包保存了一个dep实例
 * 3. 利用observe函数对该元素的子级进行observe
 *    observe返回ob ob中也有dep 可供数组 $set $delete使用
 *    https://segmentfault.com/q/1010000015363815?utm_source=tag-newest
 *    在$set时会defineReactive 然后ob.dep.notify()
 *    这时这个数据就变为响应式的了（在模板编译时或者手动new Watcher）
 */

import observe from "./observe.js";
import Dep from "./dep.js";

function defineRective(data, key, value = data[key]) {
  //在参数中 通过闭包保存了一个value变量 setter中修改value getter中返回value
  const dep = new Dep();

  //在这里observe value (value)
  let childOb = observe(value);

  Object.defineProperty(data, key, {
    //可枚举
    enumerable: true,
    //可配置 比如可以被删除
    configurable: true,
    //accessor(getter setter)不能与value和writable:true同时存在
    get() {
      console.log(`getter:访问${key}:`, value);
      // 如果现在处于依赖收集阶段
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          // 对object类型进行收集依赖 供数组和内置方法使用
          childOb.dep.depend();
        }
      }
      return value;
    },
    set(newValue) {
      console.log(`setter:${key}的值set为`, newValue);
      if (newValue === value) {
        return;
      }
      value = newValue;
      // set 一个新对象 需要observe
      childOb = observe(newValue);
      //发布订阅模式 通知watcher
      dep.notify();
    },
  });
}

export default defineRective;
