import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const customerContractRoutes: RouteConfig = {
  path: '/customers',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "contract-customer-locations" */ '@/views/customers_contract/index.vue'),
      meta: {
        title: 'Абоненты',
        icon: 'el-icon-user-solid'
      }
    },
    {
      path: 'a:addrId/',
      name: 'customerList',
      component: () => import(/* webpackChunkName: "customers" */ '@/views/customers/customer-list.vue'),
      props: ({ params }) => ({ addrId: Number(params.addrId || 0) }),
      meta: { hidden: true }
    },
    {
      path: ':uid/',
      name: 'customerDetails',
      component: () => import(/* webpackChunkName: "contract-customer-details" */ '@/views/customers_contract/customer-details.vue'),
      props: ({ params }) => ({ uid: Number(params.uid || 0) }),
      meta: { hidden: true }
    }
  ]
}

export default customerContractRoutes
