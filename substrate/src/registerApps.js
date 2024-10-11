/**
 * 1. 主应用不限技术栈，只需要提供一个容器 DOM，然后注册微应用并 start 即可。
 **/

import { registerMicroApps, start, initGlobalState } from 'qiankun'

// 每次加载切换子应用都会调用此方法
const loader = loading => {
  console.log('加载状态___loading', loading)
}

// 定义全局状态，并返回通信方法，建议在主应用使用，微应用通过 props 获取通信方法。
const actions = initGlobalState({
  name: '柏成',
  age: 25,
})
actions.onGlobalStateChange((newVal, oldVal) => {
  console.log('主应用___onGlobalStateChange', newVal, oldVal)
})

// 1. 在基座中注册子应用
registerMicroApps(
  [
    {
      name: 'reactApp', // 微应用的名称，微应用之间必须确保唯一
      entry: '//localhost:40000', // 微应用的入口
      activeRule: '/react', // 微应用的激活规则，当路径以 /react 为前缀时启动
      container: '#container', // 微应用的容器节点的选择器或者 Element 实例
      loader, // loading 状态发生变化时会调用的方法
      props: { userInfo:{ name: 'burc', password: 'xxxxxx'} }, // 主应用需要传递给微应用的数据
    },
    {
      name: 'vueApp',
      entry: '//localhost:20000', // 默认react启动的入口是10000端口
      activeRule: '/vue', // 当路径是 /react的时候启动
      container: '#container', // 应用挂载的位置
      loader,
      props: { userInfo:{ name: 'burc', password: 'xxxxxx'}},
    },
  ],
  {
    beforeLoad() {
      console.log('registerMicroApps___beforeLoad')
    },
    beforeMount() {
      console.log('registerMicroApps___beforeMount')
    },
    afterMount() {
      console.log('registerMicroApps___afterMount')
    },
    beforeUnmount() {
      console.log('registerMicroApps___beforeUnmount')
    },
    afterUnmount() {
      console.log('registerMicroApps___afterUnmount')
    },
  },
)
start({
  sandbox: {
    // 实现了动态样式表
    // css-module,scoped 可以再打包的时候生成一个选择器的名字  增加属性 来进行隔离
    // BEM
    // CSS in js
    // shadowDOM 严格的隔离
    // strictStyleIsolation:true,// 不建议使用
    experimentalStyleIsolation:true // 不建议使用 缺点：开启experimentalStyleIsolation样式隔离后，子应用中的弹窗，下拉框等直接挂在body下的元素获取不到样式
  },
})
