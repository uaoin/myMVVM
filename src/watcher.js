/**
 * watcher 类
 * 实例化时会把实例设置在全局的一个指定位置
 * 读取数据-触发getter-dep收集watcher
 *
 * 当触发了数据的setter时：
 * dep.notify-watcher.update-如果数据和上面收集的不同会调用cb
 *
 * 什么时候实例化watcher：
 * 1. 模板编译时
 * 2. 手动实例化
 * 3. computed等API会实例化
 */

import Dep from "./dep.js";

import { parsePath } from "./utils.js";

let uid = 0;
export default class Watcher {
  constructor(target, expr, cb) {
    this.id = uid++;
    this.target = target;
    this.getter = parsePath(expr);
    this.callback = cb;
    this.value = this.get();
  }

  get() {
    //在getAndInvoke中又会收集一遍
    // 进入依赖收集阶段，将全局的target设置为Watcher实例本身
    // Dep.target = this;
    pushTarget(this);

    let value;
    // 只要能找就一直找
    try {
      value = this.getter(this.target);
    } finally {
      // 最后
      // Dep.target = null;
      popTarget();
    }
    return value;
  }

  update() {
    this.run();
  }

  run() {
    this.getAndInvoke(this.callback);
  }

  getAndInvoke(cb) {
    const value = this.getter(this.target);

    if (value !== this.value || typeof value == "object") {
      const oldValue = this.value;
      this.value = value;
      cb.call(this.target, value, oldValue);
    }
  }
}

//嵌套父子组件收集watcher时 需要
const targetStack = [];

function pushTarget(_target) {
  //把原来的target先存起来
  targetStack.push(Dep.target);
  Dep.target = _target;
}

function popTarget() {
  Dep.target = targetStack.pop() ?? null;
}
