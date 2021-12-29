import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const deviceRoutes: RouteConfig = {
  path: '/devices',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "device-locations" */ '@/views/devices/dev-loc-list.vue'),
      meta: {
        title: 'devices',
        icon: 'el-icon-coin'
      }
    },
    {
      path: 'location:addrId',
      component: () => import(/* webpackChunkName: "devices" */ '@/views/devices/dev-list.vue'),
      name: 'devicesList',
      props: ({ params }) => ({ addrId: Number(params.addrId || 0) }),
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
