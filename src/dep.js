/**
 * Dep类
 * 发布者
 * 当数据发生变化时，会循环依赖列表，把所有的watcher都通知一遍
 *
 * dep存在于：
 * defineReactive的闭包中
 * 每个obsever实例中
 *
 * 什么时候收集Watcher：
 * 触发getter时
 *
 * 什么时候通知Watcher：
 * 1. 触发setter时
 * 2. 调用array的七个方法时
 * 3. $set $delete方法
 */
let uid = 0;
export default class Dep {
  constructor() {
    this.id = uid++;
    // 用数组储存自己的订阅者(watcher)
    this.subs = [];
  }

  // 添加订阅者
  addSub(sub) {
    this.subs.push(sub);
  }

  // 收集依赖 添加订阅者
  depend() {
    // Dep.target就是一个我们自己指定的全局的位置
    // window.target也行
    if (Dep.target) {
      this.addSub(Dep.target);
      //修改
      // 由watcher来处理添加订阅者
      // Dep.target.addDep(this)
    }
  }

  // 通知订阅者
  notify() {
    // 浅拷贝 避免update过程中subs被修改
    const subs = this.subs.slice();
    console.log("notify", subs);
    // 遍历通知
    for (let i = 0, l = subs.length; i < l; i++) {
      //update watcher
      subs[i].update();
    }
  }
}
