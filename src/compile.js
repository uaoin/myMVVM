/**
 * Compile类
 * 进行模板编译
 *
 * 1. 将真实DOM放入fragment中
 * 2. 进行编译
 *  2.1 是元素节点
 *    2.1.1 编译元素节点
 *    2.1.2 递归编译childNodes (2)
 *  2.2 是文本节点
 *    2.2.1 编译文本节点
 * 3. 将编译好的fragment又塞回页面
 */

import { parsePath } from "./utils.js";
import Watcher from "./watcher.js";
class Compile {
  constructor(el, vm) {
    // 看看传递的el是不是node节点，不是需要获取
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;

    //获取到元素 才开始编译
    if (this.el) {
      //1.先把这些真实的DOM移入内存中 fragment(性能优化)
      const fragment = this.node2fragment(this.el);
      //2.进行编译
      this.compile(fragment);
      //3.将编译好的fragment再塞回页面
      this.el.appendChild(fragment);
    }
  }

  //将el中的内容移入放到内存中 TMD注意了是移入 剪切 懂？
  //我认为.vue文件中的template中的是直接放在fragment编译的 不需要这步
  node2fragment(el) {
    //创建一个新的空白的文档片段 不是主DOM树的一部分（内存中）
    const fragment = document.createDocumentFragment();
    let firstChild;
    while ((firstChild = el.firstChild)) {
      //appendChild 具有移动性 循环一次少一个
      fragment.appendChild(firstChild);
    }
    return fragment;
  }

  // 编译
  compile(fragment) {
    // childNodes 和 children 的区别
    // children returns only those nodes that are elements.
    // childNodes returns all nodes (elements, attributes, text, comment, etc.).
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        //是元素节点
        this.compileElement(node);
        // 递归
        this.compile(node);
      } else {
        // 文本节点
        // 编译文本
        this.compileText(node);
      }
    });
  }

  // 编译元素节点
  compileElement(node) {
    //取出当前节点的属性 是一个类数组结构
    let attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      //name 和 value
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        let expr = attr.value;
        //解构赋值 s-可以不要
        let [, type] = attrName.split("-");
        //调用对应的编译方法 编译哪个节点 用数据替换掉表达式
        CompileUtil[type](node, this.vm, expr);
      }
    });
  }

  // 编译文本节点
  compileText(node) {
    //文本中的内容
    let expr = node.textContent;
    // 非集[^}]
    let reg = /{{([^}]+)}}/g;
    // let reg = /\{\{([^}]+)\}\}/g

    if (reg.test(expr)) {
      //调用编译文本的方法 编译哪个节点，用数据替换掉表达式
      CompileUtil["text"](node, this.vm, expr);
    }
  }

  // *** 一些辅助的方法

  // 是不是指令
  isDirective(name) {
    return name.includes("s-");
  }

  // 是不是Node节点
  isElementNode(node) {
    //node.nodeType表示节点类型
    //1为元素节点 例如<p>和<div>
    return node.nodeType === 1;
  }
}

//专门用来配合Compile类的工具对象
const CompileUtil = {
  //文本处理
  text(node, vm, expr) {
    let updateFn = this.updater["textUpdater"];
    //expr 可能是 '{{message.text}}{{a}}'
    //调用getTextVal方法去取到对应的结果
    let value = this.getTextVal(vm, expr);

    expr.replace(/{{([^}]+)}}/g, (...args) => {
      //使用watcher
      new Watcher(vm.$data, args[1], newValue => {
        // 如果数据变化了,文本节点需要重新获取依赖的属性更新文本中的内容
        updateFn && updateFn(node, this.getTextVal(vm, expr));
      });
    });
    //用处理好的节点和内容进行编译
    updateFn && updateFn(node, value);
  },
  getTextVal(vm, expr) {
    //获取编译文本后的结果
    return expr.replace(/{{([^}]+)}}/g, (match, p, offset, string) => {
      //replace的参数: match, p1,p2,p3...,offset,string
      //p1 p2 p3 ... 为第n个括号匹配的字符串 我们只要p1
      // 箭头函数没有自己的arguments 所以arguments[1]其实是expr
      //可以用...args 接收 然后args[1]

      // 依次去取数据对应的值
      return this.getVal(vm, p);
    });
  },

  getVal(vm, expr) {
    //获取实例上对应的数据
    //'message.text'=>[mesage,a]
    const getter = parsePath(expr);
    return getter(vm.$data);
  },

  setVal(vm, expr, value) {
    expr = expr.split(".");
    return expr.reduce((prev, next, currentIndex) => {
      if (currentIndex === expr.length - 1) {
        return (prev[next] = value);
      }
      return prev[next];
    }, vm.$data);
  },

  model(node, vm, expr) {
    let updateFn = this.updater["modelUpdater"];
    //用处理好的节点和内容进行编译

    //加一个监控在这里 数据变化 调用这个watch的callback
    new Watcher(vm.$data, expr, newValue => {
      // 当值变化后会调用cb 将新的值传递过来
      updateFn && updateFn(node, newValue);
    });

    //监听输入事件

    node.addEventListener("input", e => {
      let newValue = e.target.value;
      // 监听输入时间将输入的内容设置到对应数据上
      this.setVal(vm, expr, newValue);
    });

    updateFn && updateFn(node, this.getVal(vm, expr));
  },

  updater: {
    // 文本更新
    textUpdater(node, value) {
      node.textContent = value;
    },
    // 输入框更新
    modelUpdater(node, value) {
      node.value = value;
    },
  },
};

export { Compile };
