import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

// 时间插件 Moment
import Moment from 'moment'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.prototype.moment = Moment
Vue.filter('dateFormatD', function(value) {
  return Moment(value).format('YYYY-MM-DD')
})
Vue.filter('dateFormatM', function(value) {
  return Moment(value).format('YYYY-MM-DD HH:mm')
})
Vue.filter('dateFormat', function(value) {
  return Moment(value).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
