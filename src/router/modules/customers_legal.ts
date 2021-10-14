import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const customerLegalRoutes: RouteConfig = {
  path: '/legal',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "legal" */ '@/views/customers_legal/list.vue'),
      meta: {
        title: 'Организации',
        icon: 'el-icon-user'
      }
    },
  ]
}

export default customerLegalRoutes
