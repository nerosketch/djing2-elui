import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index.vue'
import { TaskModule } from '@/store/modules/tasks/tasks'

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
      redirect: '/customers',
      meta: {
        hidden: true
      }
    },
    {
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
    },
    {
      path: '/customers',
      component: Layout,
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
          path: 'g:groupId/',
          name: 'customersList',
          component: () => import(/* webpackChunkName: "customers" */ '@/views/customers/customers-list.vue'),
          props: ({ params }) => ({ groupId: Number(params.groupId || 0) }),
          meta: { hidden: true }
        },
        {
          path: 'c:uid/',
          name: 'customerDetails',
          component: () => import(/* webpackChunkName: "customerdetails" */ '@/views/customers/customer-details.vue'),
          props: ({ params }) => ({ uid: Number(params.uid || 0) }),
          meta: { hidden: true }
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
      path: '/tasks',
      component: Layout,
      children: [
        {
          path: '',
          name: 'taskList',
          component: () => import(/* webpackChunkName: "tasks" */ '@/views/tasks/index.vue'),
          meta: {
            title: 'Задачи',
            icon: 'dashboard',
            calc: () => TaskModule.activeTaskCount
          }
        },
        {
          path: 't:taskId/',
          name: 'taskDetails',
          component: () => import(/* webpackChunkName: "taskdetails" */ '@/views/tasks/task-details.vue'),
          props: ({ params }) => ({ taskId: Number(params.taskId || 0) }),
          meta: {
            hidden: true
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
    },
    {
      path: '/services',
      component: Layout,
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "servicesindex" */ '@/views/services/index.vue'),
          meta: {
            title: 'Тарифы',
            icon: 'dashboard'
          }
        }
      ]
    },
    /* {
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
          component: () => import(/ * webpackChunkName: "tree" * / '@/views/tree/index.vue'),
          meta: {
            title: 'Tree',
            icon: 'tree'
          }
        },
        {
          path: 'table',
          component: () => import(/ * webpackChunkName: "table" * / '@/views/table/index.vue'),
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
          component: () => import(/ * webpackChunkName: "form" * / '@/views/form/index.vue'),
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
          component: () => import(/ * webpackChunkName: "menu1" * / '@/views/nested/menu1/index.vue'),
          redirect: '/nested/menu1/menu1-1',
          meta: { title: 'Menu1' },
          children: [
            {
              path: 'menu1-1',
              component: () => import(/ * webpackChunkName: "menu1-1" * / '@/views/nested/menu1/menu1-1/index.vue'),
              meta: { title: 'Menu1-1' }
            },
            {
              path: 'menu1-2',
              component: () => import(/ * webpackChunkName: "menu1-2" * / '@/views/nested/menu1/menu1-2/index.vue'),
              redirect: '/nested/menu1/menu1-2/menu1-2-1',
              meta: { title: 'Menu1-2' },
              children: [
                {
                  path: 'menu1-2-1',
                  component: () => import(/ * webpackChunkName: "menu1-2-1" * / '@/views/nested/menu1/menu1-2/menu1-2-1/index.vue'),
                  meta: { title: 'Menu1-2-1' }
                },
                {
                  path: 'menu1-2-2',
                  component: () => import(/ * webpackChunkName: "menu1-2-2" * / '@/views/nested/menu1/menu1-2/menu1-2-2/index.vue'),
                  meta: { title: 'Menu1-2-2' }
                }
              ]
            },
            {
              path: 'menu1-3',
              component: () => import(/ * webpackChunkName: "menu1-3" * / '@/views/nested/menu1/menu1-3/index.vue'),
              meta: { title: 'Menu1-3' }
            }
          ]
        },
        {
          path: 'menu2',
          component: () => import(/ * webpackChunkName: "menu2" * / '@/views/nested/menu2/index.vue'),
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
    }, */
    {
      path: '*',
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
})
