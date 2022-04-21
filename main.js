import Vue from 'vue'
import App from './App'
import store from './store/store.js'

// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
// $http.baseurl = 'https://www.uinav.com'
$http.baseUrl = 'https://www.uinav.com'

// $http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求拦截器
$http.beforeRequest = function(options){
  uni.showLoading({
    title:'数据加载中...'
  })
  // console.log(options)
    // 判断请求的是否为有权限的 API 接口
    if (options.url.indexOf('/my/') !== -1) {
      // console.log('Authorization' + store.state.m_user.token)
      // 为请求头添加身份认证字段
      options.header = {
        // 字段的值可以直接从 vuex 中进行获取
        Authorization: store.state.m_user.token,
      }
      console.log(store.state.m_user.token)
    }
}

//封装弹框失败
uni.$showMsg = function(title="请求数据失败！",duration = 1500){
  uni.showToast({
    title,
    duration,
    icon:'none'
  })
}

// 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading()
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
  store,
})
app.$mount()
