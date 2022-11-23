import { Compile } from "./compile.js";
import observe from "./observe.js";
import { set } from "./set.js";
import { del } from "./del.js";
export default class MVVM {
  constructor(options) {
    this._isMVVM = true;
    // 先把需要的东西挂载到实例(this)上
    this.$el = options.el;
    this.$data = options.data;
    // 如果有需要编译的模板 我们才进行编译
    // 思考一下 在vue中主动new Vue时有不需要挂载点的情况吗
    // 总线 const eventBus = new Vue()
    if (this.$el) {
      // 数据劫持
      observe(this.$data, true);
      //代理数据
      this.proxyData(this.$data);
      // 用数据和元素进行编译
      new Compile(this.$el, this);
    }
    //执行测试
    if (options.test) {
      options.test.apply(this);
    }
  }

  proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newValue) {
          if (data[key] === newValue) return;
          data[key] = newValue;
        },
      });
    });
  }

  static set = set;
  static delete = del;
  $set = set;
  $delete = del;
}
