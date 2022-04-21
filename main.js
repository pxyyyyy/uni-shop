import Vue from 'vue'
import App from './App'
import store from './store/store.js'

// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
// $http.baseurl = 'https://www.uinav.com'
// $http.baseUrl = 'https://www.uinav.com'
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求拦截器
$http.beforeRequest = function(options){
  uni.showLoading({
    title:'数据加载中...'
  })
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
