import Vue from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import lang from 'element-ui/lib/locale/lang/ru-RU'
import locale from 'element-ui/lib/locale'
import SvgIcon from 'vue-svgicon'

// configure language
locale.use(lang)

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/icons/components'
import '@/permission'

Vue.use(ElementUI)
Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
