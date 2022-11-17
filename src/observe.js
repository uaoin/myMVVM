/**
 * obseve函数
 * 用于劫持某对象中的元素
 *
 * 1. 如果参数不是对象则return
 * 2. 如果参数对象中的元素已被劫持 返回ob实例
 * 3. 如果参数对象中的元素未被劫持 将对象作为参数进行 new Observer() 返回ob实例
 *
 * 返回的ob实例在defineReactive中使用：
 * - 在getter中收集依赖 ob.dep.depend()
 * - 这个dep中存的watcher主要在数组更新与$set $delete方法中使用
 *
 * observe的过程是一个递归的过程
 * 1. observe一个对象 用这个对象实例化Observer
 * 2. Observer中对这个对象中的元素进行defineReactive
 * 3. defineReactive中又会调用obseve对传入的元素进行第1步
 * 4. 在set一个newValue时也会对newValue进行observe
 */

import { Observer } from "./observer.js";

function observe(value) {
  // 如果value不是对象什么都不做
  if (typeof value != "object") return;
  let ob;
  if (typeof value.__ob__ != "undefined") {
    // 对象中的元素已被observe
    ob = value.__ob__;
  } else {
    // 对象中的元素未被observe
    ob = new Observer(value);
  }
  return ob;
}

export default observe;
