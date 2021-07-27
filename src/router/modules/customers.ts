import { RouteConfig } from 'vue-router'
import Layout from '@/layout/regular.vue'

const customerRoutes: RouteConfig = {
  path: '/customers',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "customer-groups" */ '@/views/customers/customers-groups.vue'),
      name: 'customersGroupList',
      meta: {
        title: 'Абоненты',
        icon: 'el-icon-user-solid'
      }
    },
    {
      path: 'g:groupId/',
      name: 'customersList',
      component: () => import(/* webpackChunkName: "customers" */ '@/views/customers/customers-list.vue'),
      props: ({ params }) => ({ groupId: Number(params.groupId || 0) }),
      meta: { hidden: true }
    },
    {
      path: 'c:uid/',
      name: 'customerDetails',
      component: () => import(/* webpackChunkName: "customerdetails" */ '@/views/customers/customer-details.vue'),
      props: ({ params }) => ({ uid: Number(params.uid || 0) }),
      meta: { hidden: true }
    }
  ]
}

export default customerRoutes
