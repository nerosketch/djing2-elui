import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const deviceRoutes: RouteConfig = {
  path: '/devices',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "device-groups" */ '@/views/devices/dev-group-list.vue'),
      meta: {
        title: 'Оборудование',
        icon: 'el-icon-coin'
      }
    },
    {
      path: 'group:groupId',
      component: () => import(/* webpackChunkName: "devices" */ '@/views/devices/dev-list.vue'),
      name: 'devicesList',
      props: ({ params }) => ({ groupId: Number(params.groupId || 0) }),
      meta: {
        hidden: true
      }
    },
    {
      path: 'device:devId',
      component: () => import(/* webpackChunkName: "dev-view" */ '@/views/devices/specefic-devs/device-view.vue'),
      name: 'device-view',
      props: ({ params }) => ({ devId: Number(params.devId || 0) }),
      meta: {
        hidden: true
      }
    }
  ]
}

export default deviceRoutes
