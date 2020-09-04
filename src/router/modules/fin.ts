import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const finRoutes: RouteConfig = {
  path: '/fin',
  component: Layout,
  children: [
    {
      path: '',
      name: 'finGwList',
      component: () => import(/* webpackChunkName: "fin" */ '@/views/fin/gw-list.vue'),
      meta: {
        title: 'Финансы',
        icon: 'hamburger'
      }
    }
  ]
}

export default finRoutes
