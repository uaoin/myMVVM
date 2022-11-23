
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
