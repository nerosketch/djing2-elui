import { RouteConfig } from 'vue-router'
import Layout from '@/layout/regular.vue'

const finRoutes: RouteConfig = {
  path: '/fin',
  component: Layout,
  children: [
    {
      path: '',
      name: 'finGwList',
      component: () => import(/* webpackChunkName: "fin" */ '@/views/fin/gw-list.vue'),
      meta: {
        title: 'finance',
        icon: 'el-icon-shopping-cart-full'
      }
    },
    {
      path: 'report',
      name: 'finReport',
      component: () => import(/* webpackChunkName: "finreport" */ '@/views/fin/fin-report.vue'),
      meta: { hidden: true }
    }
  ]
}

export default finRoutes
