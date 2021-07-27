import { RouteConfig } from 'vue-router'
import Layout from '@/layout/regular.vue'

const sitesRoutes: RouteConfig = {
  path: '/sites',
  component: Layout,
  meta: { hidden: true },
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "sites" */ '@/views/sites/index.vue'),
      meta: { hidden: true }
    }
  ]
}

export default sitesRoutes
