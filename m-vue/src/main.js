/**
 * 1. 新增 public-path.js 文件，用于修改运行时的 publicPath，
 * 2. 在入口文件最顶部引入 public-path.js，修改并导出三个生命周期函数。
 * 3. 修改 webpack 打包（vue.config.js），允许开发环境跨域和 umd 打包。
 **/

import './public-path.js'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './router'

let app
let history
let router
function render(props) {
  app = createApp(App)
  history = createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/vue' : '/')
  router = createRouter({
    history,
    routes,
  })
  app.use(router)
  const container = props.container
  app.mount(container ? container.querySelector('#app') : document.getElementById('app'))
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}

export async function bootstrap(props) {
  console.log('vue子应用___bootstrap', props)
}
export async function mount(props) {
  console.log('vue子应用___mount', props)
  props.onGlobalStateChange((newVal, oldVal) => {
    console.log('子应用___onGlobalStateChange', newVal, oldVal)
  })
  props.setGlobalState({ name: '马里奥', age: 999 })
  render(props)
}
export async function unmount(props) {
  console.log('vue子应用___unmount', props)
  app.unmount()
  history.destroy()
  app = null
  router = null
}
