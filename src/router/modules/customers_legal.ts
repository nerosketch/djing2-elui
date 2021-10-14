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
    {
      path: 'l:uid/',
      name: 'customerLegalDetail',
      component: () => import(/* webpackChunkName: "customerlegaldetail" */ '@/views/customers_legal/details/legal-details.vue'),
      props: ({ params }) => ({ uid: Number(params.uid || 0) }),
      meta: { hidden: true }
    }
  ]
}

export default customerLegalRoutes
