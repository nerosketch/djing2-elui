import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const sormRoutes: RouteConfig = {
  path: '/sorm',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "sorm" */ '@/views/sorm/addr-list.vue'),
      meta: {
        title: 'Адресные объекты',
        icon: 'el-icon-location'
      }
    }
  ]
}

export default sormRoutes
