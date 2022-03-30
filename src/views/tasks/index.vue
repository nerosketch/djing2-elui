<template lang="pug">
  .tab-container
    el-tabs(v-model="activeTabName" type="border-card")
      el-tab-pane(
        :label="$t('tasks.newChallenges')"
        name="tnew"
        lazy)
        keep-alive
          slot(name="tasklistnew")
            task-list(tabUrl="get_new")
      el-tab-pane(
        :label="$t('tasks.challengesAchieved')"
        name="tfin"
        lazy)
        keep-alive
          slot(name="tasklistfin")
            task-list(tabUrl="get_finished")
      el-tab-pane(
        :label="$t('tasks.failedChallenges')"
        name="tf"
        lazy)
        keep-alive
          slot(name="tasklistfailed")
            task-list(tabUrl="get_failed")
      el-tab-pane(
        :label="$t('tasks.allTasks')"
        name="tall"
        lazy)
        keep-alive
          slot(name="tasklistall")
            task-list(tabUrl="get_all")
      el-tab-pane(
        :label="$t('tasks.allUncompleted')"
        name="tallnew"
        lazy)
        keep-alive
          slot(name="tasklistallnew")
            task-list(tabUrl="get_all_new")
      el-tab-pane(
        :label="$t('tasks.modes.titlePlural')"
        name="tmodes"
        lazy)
        keep-alive
          task-mode-list
      slot(name='othertabs')

</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import TaskList from './task-list.vue'
import TabMixin from '@/utils/tab-mixin'
import TaskModeList from './modes/list.vue'

@Component({
  name: 'TasksIndex',
  components: {
    TaskList,
    TaskModeList
  }
})
export default class extends mixins(TabMixin) {
  protected activeTabName = 'tnew'
}
</script>
