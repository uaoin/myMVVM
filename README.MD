
 - 目前做了Observer Dep Watcher Compile四大类里面的某些方法还没有实现
 - 没用Webpack，懒得用。顺便试试在标签中写ES6模块化
 - 数组的原型链也改写了
 - $delete $set

TODO：
- [ ] computed

# 啥是MVVM

又是这张图：

![](/assets/1.png)

## ViewModel

An object that syncs the Model and the View.
In Vue.js,every Vue instance is a ViewModel.
They are instantiated with the `Vue` constructor or its sub-classes:

```js
var vm = new Vue({/* options */})
```

> 用于同步Model和View的对象，每个通过`Vue`构造函数实例化的对象都是ViewModel。

## View

The actual DOM that is managed by Vue instances.

```
vm.$el // The View
```

> 被Vue实例控制的真实DOM就是View


## Model

A slightly modified plain JavaScript object.

```js
vm.$data // The Model
```

> 一个简单的经过修改的对象

# MVVM的实现方式

- 传统的MVC中通过发布订阅
- angular1.x中通过脏值检测来实现MVVM模式
- Vue：Object.defineProperty + 发布订阅
- Vue3:利用ES6新特性Proxy和Reflect

#  实现一个vue

代码注释写的很详细

## 需要实现

- 模板编译（Compile）
- 数据劫持（Observer）
- 发布者（Observer+Dep）
- 订阅者/观察者（Watcher）


## Vue基础案例

项目结构  

```
index.html
src
  compile.js         模板编译类
  MVVM.js            MVVM类
  observe.js         observe方法
  observer.js        observer类
  defineReactive.js  数据劫持方法
  array.js           数组的原型链改写
  watcher.js         Watcher类
  set.js             Vue.set(vm.$set)方法
  del.js             Vue.delete(vm.$delete)方法
  dep.js             Dep类
  utils.js           一些辅助函数
```

**接下来看代码吧我TM懒得写了,dota2启动!**
