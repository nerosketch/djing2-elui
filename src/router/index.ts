import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

// import customerRoutes from './modules/customers'
import customerContractRoutes from './modules/customers_contract'
import deviceRoutes from './modules/devices'
import taskRoutes from './modules/tasks'
import profileRoutes from './modules/profiles'
import finRoutes from './modules/fin'
// import messengerRoutes from './modules/messenger'
import sitesRoutes from './modules/sites'
import addrRoutes from './modules/addrs'
import dfRoutes from './modules/dynamicfields'
import customerLegalRoutes from './modules/customers_legal'
import sormRoutes from './modules/sorm'

Vue.use(Router)

/*
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    hidden: true                 if true, this route will not show in the sidebar (default is false)
  }
*/

export const constantRoutes: RouteConfig [] = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/customers',
    meta: {
      hidden: true
    }
  },
  profileRoutes,
  // customerRoutes,
  customerContractRoutes,
  customerLegalRoutes,
  taskRoutes,
  {
    path: '/groups',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "groups" */ '@/views/groups/group-list.vue'),
        meta: {
          title: 'groups',
          icon: 'el-icon-s-management'
        }
      }
    ]
  },
  {
    path: '/services',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "servicesindex" */ '@/views/services/index.vue'),
        meta: {
          title: 'services',
          icon: 'el-icon-s-order'
        }
      }
    ]
  },
  {
    path: '/network',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "network" */ '@/views/networks/index.vue'),
        meta: {
          title: 'network',
          icon: 'el-icon-upload'
        }
      }
    ]
  },
  deviceRoutes,
  {
    path: '/gateways',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "gatewaysList" */ '@/views/gateways/gw-list.vue'),
        meta: {
          title: 'gateways',
          icon: 'el-icon-receiving'
        }
      }
    ]
  },
  {
    path: '/search',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '',
        name: 'searchPlace',
        component: () => import(/* webpackChunkName: "search" */ '@/views/search-place.vue'),
        meta: { hidden: true }
      }
    ]
  },
  {
    path: '/reports',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '',
        name: 'reportsIndex',
        component: () => import(/* webpackChunkName: "reports" */ '@/views/reports/index.vue'),
        meta: { hidden: true }
      }
    ]
  },
  finRoutes,
  // messengerRoutes,
  sitesRoutes,
  addrRoutes,
  dfRoutes,
  sormRoutes,
  {
    path: '/afk',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "afklist" */ '@/views/customers/afk-list.vue'),
        meta: { hidden: true }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const createRouter = () => new Router({
  mode: 'history', // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter() {
//   const newRouter = createRouter();
//   (router as any).matcher = (newRouter as any).matcher // reset router
// }

export default router
