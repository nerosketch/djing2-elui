import Vue from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import lang from 'element-ui/lib/locale/lang/ru-RU'
import locale from 'element-ui/lib/locale'
import { CurrentPermissionsModule } from '@/store/current-user-permissions'
import ObjectPerms from '@/components/object-perms.vue'
import SitesAttach from '@/components/sites-attach.vue'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/permission'
import PushNotificationsClass from './utils/notifications'

// configure language
locale.use(lang)

Vue.use(ElementUI, { size: 'mini' })

Vue.component('ObjectPerms', ObjectPerms)
Vue.component('SitesAttach', SitesAttach)

Vue.config.productionTip = false

Vue.prototype.$perms = CurrentPermissionsModule

declare module 'vue/types/vue' {
  interface Vue {
    $eventHub: Vue,
    $messagingMng: PushNotificationsClass
  }
}

Vue.prototype.$eventHub = new Vue() // Global event bus

Vue.prototype.$messagingMng = new PushNotificationsClass()

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
