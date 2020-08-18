import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const profileRoutes: RouteConfig = {
  path: '/profiles',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import(/* webpackChunkName: "profileslist" */ '@/views/profiles/profiles-list.vue'),
      meta: {
        title: 'Сотрудники',
        icon: 'dashboard'
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
