import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const profileRoutes: RouteConfig = {
  path: '/profiles',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "profiles" */ '@/views/profiles/index.vue'),
      meta: {
        title: 'Сотрудники',
        icon: 'el-icon-s-custom'
      }
    },
    {
      path: 'p:profileUname/',
      name: 'profileDetail',
      component: () => import(/* webpackChunkName: "profileDetails" */ '@/views/profiles/profile-details.vue'),
      props: true,
      meta: { hidden: true }
    }
  ]
}

export default profileRoutes
