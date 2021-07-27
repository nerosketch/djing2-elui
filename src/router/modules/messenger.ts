import { RouteConfig } from 'vue-router'
import Layout from '@/layout/regular.vue'

const messengerRoutes: RouteConfig = {
  path: '/messenger',
  component: Layout,
  meta: { hidden: true },
  children: [
    {
      path: '',
      name: 'messengerTypeList',
      component: () => import(/* webpackChunkName: "messengertypelist" */ '@/views/messenger/type-list.vue'),
      meta: { hidden: true }
    },
    {
      path: ':messengerTypeName',
      name: 'messengerList',
      component: () => import(/* webpackChunkName: "messengers" */ '@/views/messenger/messenger-list.vue'),
      props: true,
      meta: { hidden: true }
    },
    {
      path: ':messengerTypeName/:mId',
      component: () => import(/* webpackChunkName: "messengerdetails" */ '@/views/messenger/messenger-details.vue'),
      name: 'messengerDetails',
      props: ({ params }) => ({ mId: Number(params.mId), messengerTypeName: params.messengerTypeName }),
      meta: { hidden: true }
    }
  ]
}

export default messengerRoutes
