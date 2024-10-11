/**
 * 1. 新增 public-path.js 文件，用于修改运行时的 publicPath，
 * 2. 在入口文件最顶部引入 public-path.js，修改并导出三个生命周期函数。
 * 3. 修改 webpack 打包，允许开发环境跨域和 umd 打包。
 **/

import './public-path.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

let root
function render(props) {
  const container = props.container
  root = ReactDOM.createRoot(container ? container.querySelector('#root') : document.getElementById('root'))
  root.render(<App />)
}

// 4. 独立运行时调用 render 方法
if (!window.__POWERED_BY_QIANKUN__) {
  render({}) // qiankun 提供了一些标识，用于表示当前应用是否在父应用中被引入过
}

// 1. 配置静态资源路径（public-path.js）
// 2. 导出相应的生命周期钩子（微应用需要在自己的入口 js 导出 bootstrap、mount、unmount 三个生命周期钩子，以供主应用在适当的时机调用。）
// 3. 配置微应用的打包工具（除了代码中暴露出相应的生命周期钩子之外，为了让主应用能正确识别微应用暴露出来的一些信息，需要更改 webpack配置，暴露的方式为 umd格式）

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap(props) {
  console.log('react子应用___bootstrap', props)
}
/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log('react子应用___mount', props)
  render(props) // 父应用挂载的时候会传递props，props 中有 container挂载点
}
/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  console.log('react子应用___unmount', props)
  root.unmount()
}
