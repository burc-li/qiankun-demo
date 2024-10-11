# 主应用

主应用不限技术栈，只需要提供一个容器 DOM，然后注册微应用并 start 即可。

先安装 qiankun ：
  ```
    $ yarn add qiankun # 或者 npm i qiankun -S
  ```

注册微应用并启动：
  ```
    import { registerMicroApps, start, initGlobalState } from 'qiankun'

    registerMicroApps([{
      ...
    }])

    // 启动 qiankun
    start();
  ```

# 子应用
1. 在 src 目录新增 public-path.js 文件，用于修改运行时的 publicPath，
  ```
    if (window.__POWERED_BY_QIANKUN__) {
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
  ```

2. 在入口文件最顶部引入 public-path.js，修改并导出三个生命周期函数。
  ```
    import './public-path.js'
    import { createApp } from 'vue'
    import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
    import App from './App.vue'
    import routes from './router'



    let app;
    let history;
    let router;
    function render(props) {
        app = createApp(App)
        history = createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/vue' : '/')
        router = createRouter({
            history,
            routes
        })
        app.use(router)
        const container = props.container
        app.mount(container ? container.querySelector('#app'):document.getElementById('app'))
    }

    if(!window.__POWERED_BY_QIANKUN__){
        render({})
    }

    export async function bootstrap() {
        console.log('vue bootsrap')
    }
    export async function mount(props) {
        render(props)
    }
    export async function unmount() {
        app.unmount()
        history.destroy();
        app = null;
        router = null
    }
  ```

3. 修改 webpack 打包（vue.config.js），允许开发环境跨域和 umd 打包。
  ```
    const { name } = require('./package');
    module.exports = {
      devServer: {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
      configureWebpack: {
        output: {
          library: `${name}-[name]`,
          libraryTarget: 'umd', // 把微应用打包成 umd 库格式
          jsonpFunction: `webpackJsonp_${name}`, // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
        },
      },
    };
  ```
