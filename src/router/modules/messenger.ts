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
      component: () => import(/* webpackChunkName: "messengerviber" */ '@/views/messenger/viber-messenger-details.vue'),
      name: 'viberMessengerDetails',
      props: ({ params }) => ({ mId: Number(params.mId) }),
      meta: {
        hidden: true
      }
    },
    {
      path: 'm:mId',
      component: () => import(/* webpackChunkName: "messengertelegram" */ '@/views/messenger/telegram-messenger-details.vue'),
      name: 'telegramMessengerDetails',
      props: ({ params }) => ({ mId: Number(params.mId) }),
      meta: {
        hidden: true
      }
    }
  ]
}

export default messengerRoutes
