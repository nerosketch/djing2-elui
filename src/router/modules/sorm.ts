import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const sormRoutes: RouteConfig = {
  path: '/sorm',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "sorm" */ '@/views/sorm/index.vue'),
      meta: {
        title: 'sorm',
        icon: 'el-icon-no-smoking'
      }
    }
  ]
}

export default sormRoutes
