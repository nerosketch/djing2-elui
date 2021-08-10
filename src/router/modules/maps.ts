import { RouteConfig } from 'vue-router'
import Layout from '@/layout/flat.vue'

const messengerRoutes: RouteConfig = {
  path: '',
  component: Layout,
  meta: {
    title: 'Карты',
    icon: 'el-icon-map-location'
  },
  children: [
    {
      path: '/maps',
      component: () => import(/* webpackChunkName: "mapsIndex" */ '@/views/maps/geo/index.vue'),
      meta: {
        title: 'Карта',
        icon: 'el-icon-location'
      }
    },
    {
      path: '/scheme',
      component: () => import(/* webpackChunkName: "mapsSchemeIndex" */ '@/views/maps/scheme/index.vue'),
      meta: {
        title: 'Схема',
        icon: 'el-icon-share'
      }
    },
  ]
}

export default messengerRoutes
