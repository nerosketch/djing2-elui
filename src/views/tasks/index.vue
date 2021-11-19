<template lang="pug">
  .tab-container
    el-tabs(
      v-model="activeTabName"
      type="border-card"
    )
      el-tab-pane(
        label='Новые задачи'
        name='tnew'
        lazy
      )
        keep-alive
          slot(name="tasklistnew")
            task-list(tabUrl="get_new")
      el-tab-pane(
        label='Выполненные задачи'
        name='tfin'
        lazy
      )
        keep-alive
          slot(name="tasklistfin")
            task-list(tabUrl="get_finished")
      el-tab-pane(
        label='Проваленные задачи'
        name='tf'
        lazy
      )
        keep-alive
          slot(name="tasklistfailed")
            task-list(tabUrl="get_failed")
      el-tab-pane(
        label='Все задачи'
        name='tall'
        lazy
      )
        keep-alive
          slot(name="tasklistall")
            task-list(tabUrl="get_all")
      el-tab-pane(
        label='Все незавершённые'
        name='tallnew'
        lazy
      )
        keep-alive
          slot(name="tasklistallnew")
            task-list(tabUrl="get_all_new")

</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import TaskList from './task-list.vue'
import TabMixin from '@/utils/tab-mixin'

@Component({
  name: 'TasksIndex',
  components: { TaskList }
})
export default class extends mixins(TabMixin) {
  protected activeTabName = 'tnew'
}
</script>
