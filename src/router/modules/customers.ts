import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const customerRoutes: RouteConfig = {
  path: '/customers',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "customer-locations" */ '@/views/customers/customer-locations.vue'),
      meta: {
        title: 'Абоненты',
        icon: 'el-icon-user-solid'
      }
    },
    {
      path: 'a:addrId/',
      name: 'customersList',
      component: () => import(/* webpackChunkName: "customers" */ '@/views/customers/customers-list.vue'),
      props: ({ params }) => ({ addrId: Number(params.addrId || 0) }),
      meta: { hidden: true }
    },
    {
      path: ':uid/',
      name: 'customerDetails',
      component: () => import(/* webpackChunkName: "customerdetails" */ '@/views/customers/customer-details.vue'),
      props: ({ params }) => ({ uid: Number(params.uid || 0) }),
      meta: { hidden: true }
    }
  ]
}

export default customerRoutes
