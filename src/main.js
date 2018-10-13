// global lodash binding.
import _ from 'lodash'
window._ = _

import Vue from 'vue'
import ElementUI from 'element-ui'
import './common/events'
import './common/install'

import './assets/styles/css_initialize.css'
import 'element-ui/lib/theme-default/index.css'
import './assets/font-icon/iconfont.css'

import store from './store'
import App from './App'

// add element ui to Vue
Vue.use(ElementUI)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: {
    App
  }
})
