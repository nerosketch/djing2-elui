import { RouteConfig } from 'vue-router'
import Layout from '@/layout/regular.vue'
import { TaskModule } from '@/store/modules/tasks/tasks'

const taskRoutes: RouteConfig = {
  path: '/tasks',
  component: Layout,
  children: [
    {
      path: '',
      name: 'taskList',
      component: () => import(/* webpackChunkName: "tasks" */ '@/views/tasks/index.vue'),
      meta: {
        title: 'Задачи',
        icon: 'el-icon-s-order',
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
}

export default taskRoutes
