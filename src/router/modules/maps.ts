import { RouteConfig } from 'vue-router'
import Layout from '@/layout/flat.vue'
// import LeftMenuOnly from '@/layout/left-menu-only.vue'

const messengerRoutes: RouteConfig = {
  path: '/maps',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "mapsIndex" */ '@/views/maps/index.vue'),
      meta: {
        title: 'Карта',
        icon: 'el-icon-map-location'
      }
    },
  ]
}

export default messengerRoutes
