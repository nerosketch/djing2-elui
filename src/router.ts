import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index.vue'

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

const gidProp: any = (p: any) => ({ groupId: p.params.groupId })

export default new Router({
  mode: 'history', // Enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: [
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
      // redirect: '/customers',
      meta: {
        title: 'Int dat',
        icon: 'example'
      }
    },
    {
      path: '/customers',
      component: Layout,
      meta: {
        title: 'Customers',
        icon: 'dashboard'
      },
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "customers" */ '@/views/customers/customers-groups.vue'),
          name: 'customersGroupList',
          meta: {
            title: 'Группы абонентов',
            icon: 'tree'
          }
        },
        {
          path: ':groupId/',
          name: 'customersList',
          component: () => import(/* webpackChunkName: "customers" */ '@/views/customers/customers-list.vue'),
          props: ({ params }) => ({ groupId: Number(params.groupId || 0) }),
          meta: {
            title: 'Абоненты',
            icon: 'tree',
            hidden: true
          }
        }
      ]
    },
    {
      path: '/groups',
      component: Layout,
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "groups" */ '@/views/groups/group-list.vue'),
          meta: {
            title: 'Группы',
            icon: 'dashboard'
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
            title: 'Сеть',
            icon: 'dashboard'
          }
        }
      ]
    },
    {
      path: '/devices',
      component: Layout,
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "device-groups" */ '@/views/devices/dev-group-list.vue'),
          meta: {
            title: 'Устройства',
            icon: 'dashboard'
          }
        },
        {
          path: ':groupId',
          component: () => import(/* webpackChunkName: "devices" */ '@/views/devices/dev-list.vue'),
          name: 'devicesList',
          props: true,
          meta: {
            title: 'Устройства',
            hidden: true
          }
        }
      ]
    },
    {
      path: '/example',
      component: Layout,
      redirect: '/example/tree',
      meta: {
        title: 'Example',
        icon: 'example'
      },
      children: [
        {
          path: 'tree',
          component: () => import(/* webpackChunkName: "tree" */ '@/views/tree/index.vue'),
          meta: {
            title: 'Tree',
            icon: 'tree'
          }
        },
        {
          path: 'table',
          component: () => import(/* webpackChunkName: "table" */ '@/views/table/index.vue'),
          meta: {
            title: 'Table',
            icon: 'table'
          }
        }
      ]
    },
    {
      path: '/form',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import(/* webpackChunkName: "form" */ '@/views/form/index.vue'),
          meta: {
            title: 'Form',
            icon: 'form'
          }
        }
      ]
    },
    {
      path: '/nested',
      component: Layout,
      redirect: '/nested/menu1',
      meta: {
        title: 'Nested',
        icon: 'nested'
      },
      children: [
        {
          path: 'menu1',
          component: () => import(/* webpackChunkName: "menu1" */ '@/views/nested/menu1/index.vue'),
          redirect: '/nested/menu1/menu1-1',
          meta: { title: 'Menu1' },
          children: [
            {
              path: 'menu1-1',
              component: () => import(/* webpackChunkName: "menu1-1" */ '@/views/nested/menu1/menu1-1/index.vue'),
              meta: { title: 'Menu1-1' }
            },
            {
              path: 'menu1-2',
              component: () => import(/* webpackChunkName: "menu1-2" */ '@/views/nested/menu1/menu1-2/index.vue'),
              redirect: '/nested/menu1/menu1-2/menu1-2-1',
              meta: { title: 'Menu1-2' },
              children: [
                {
                  path: 'menu1-2-1',
                  component: () => import(/* webpackChunkName: "menu1-2-1" */ '@/views/nested/menu1/menu1-2/menu1-2-1/index.vue'),
                  meta: { title: 'Menu1-2-1' }
                },
                {
                  path: 'menu1-2-2',
                  component: () => import(/* webpackChunkName: "menu1-2-2" */ '@/views/nested/menu1/menu1-2/menu1-2-2/index.vue'),
                  meta: { title: 'Menu1-2-2' }
                }
              ]
            },
            {
              path: 'menu1-3',
              component: () => import(/* webpackChunkName: "menu1-3" */ '@/views/nested/menu1/menu1-3/index.vue'),
              meta: { title: 'Menu1-3' }
            }
          ]
        },
        {
          path: 'menu2',
          component: () => import(/* webpackChunkName: "menu2" */ '@/views/nested/menu2/index.vue'),
          meta: { title: 'Menu2' }
        }
      ]
    },
    {
      path: '/external-link',
      component: Layout,
      children: [
        {
          path: 'https://github.com/Armour/vue-typescript-admin-template',
          meta: {
            title: 'External Link',
            icon: 'link'
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
})
