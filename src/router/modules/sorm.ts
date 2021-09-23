import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const sormRoutes: RouteConfig = {
  path: '',
  component: Layout,
  meta: {
    title: 'Адреса',
    icon: 'el-icon-map-location'
  },
  children: [
    {
      path: '/sorm',
      component: () => import(/* webpackChunkName: "sorm" */ '@/views/sorm/addr-list.vue'),
      meta: {
        title: 'Адреса СОРМ',
        icon: 'el-icon-location'
      }
    },
    {
      path: '/addrs',
      component: () => import(/* webpackChunkName: "localities" */ '@/views/addresses/addresses.vue'),
      meta: {
        title: 'Адресные объекты',
        icon: 'el-icon-s-home'
      }
    }
  ]
}

export default sormRoutes
