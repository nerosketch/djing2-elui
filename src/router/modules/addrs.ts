import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const addrRoutes: RouteConfig = {
  path: '',
  component: Layout,
  children: [
    {
      path: '/addrs',
      component: () => import(/* webpackChunkName: "localities" */ '@/views/addresses/addrs-tree.vue'),
      meta: {
        title: 'Адреса',
        icon: 'el-icon-s-home'
      }
    }
  ]
}

export default addrRoutes
