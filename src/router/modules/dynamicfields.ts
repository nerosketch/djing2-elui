import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const dfRoutes: RouteConfig = {
  path: '/df',
  component: Layout,
  children: [
    {
      path: '',
      name: 'dfFieldList',
      component: () => import(/* webpackChunkName: "dynamicfields" */ '@/views/dynamic-fields/field-list.vue'),
      meta: {
        title: 'Динамические поля',
        icon: 'el-icon-s-fold'
      }
    }
  ]
}

export default dfRoutes
