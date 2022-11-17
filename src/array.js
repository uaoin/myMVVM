/**
 * newArrProto 原型对象
 * 由于数组不能使用defineReactive进行数据劫持
 * 所以需要对数组中七个方法进行改写 将其变为响应式的方法
 * 改写：修改原型链（属性遮蔽）
 * 变为响应式：
 * - 对新加入的项进行observe
 * - __ob__.dep.notify()通知watcher进行响应
 *
 * 1. 以Array.prototype为原型创建一个对象作为我们的新数组原型对象(利用create)
 * 2. 依次设置七个方法 （不可枚举）
 *    2.1 对能够插入新项的方法push/unshift/splice逐项observe插入的新项
 * 3. 取出数组的ob(this.__ob__) 调用ob.dep.notify()
 * 4. 恢复原方法的功能
 */

import { def } from "./utils.js";

const arrayPrototype = Array.prototype;

const methodsNeedChange = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

//属性遮蔽
//创建一个空对象 它的__proto__是Array.prototype
export const newArrProto = Object.create(arrayPrototype);

for (const methodName of methodsNeedChange) {
  const originMethod = arrayPrototype[methodName];
  def(
    newArrProto,
    methodName,
    function () {
      // 为了使用observeArray方法 需要取出__ob__
      // __ob__肯定存在与此数组(this)中
      // 进行属性遮蔽前已经有了__ob__
      const ob = this.__ob__;
      // push/unshift/splice能够插入新项 把插入的新项进行observe
      let inserted = [];

      const args = [...arguments];

      switch (methodName) {
        case "push":
        case "unshift":
          inserted = args;
          break;

        case "splice":
          //splice(下标，数量，插入的新项)
          inserted = args.slice(2);
      }

      if (inserted.length !== 0) {
        console.log(inserted, "inserted");
        ob.observeArray(inserted);
      }

      console.log(`正在使用被修改后的${methodName}方法`);

      ob.dep.notify();
      //恢复功能 this是调用此函数的数组
      return originMethod.apply(this, args);
    },
    false
  ); //设置为不可枚举
}
