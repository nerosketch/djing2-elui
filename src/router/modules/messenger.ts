import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const messengerRoutes: RouteConfig = {
  path: '/messenger',
  component: Layout,
  children: [
    {
      path: '',
      name: 'messengerList',
      component: () => import(/* webpackChunkName: "messenger" */ '@/views/messenger/messenger-list.vue'),
      meta: {
        title: 'Мессенджеры',
        icon: 'hamburger'
      }
    },
    {
      path: 'm:mId',
      component: () => import(/* webpackChunkName: "messengerdetails" */ '@/views/messenger/messenger-details.vue'),
      name: 'messengerDetails',
      props: ({ params }) => ({ mId: Number(params.mId) }),
      meta: {
        hidden: true
      }
    }
  ]
}

export default messengerRoutes
