<template lang="pug">
tabs(
  :tabs="tabItems"
  activeTabName="tnew"
)
  template(#tnew)
    task-list(tabUrl="get_new")
  template(#tfin)
    task-list(tabUrl="get_finished")
  template(#tf)
    task-list(tabUrl="get_failed")
  template(#tall)
    task-list(tabUrl="get_all")
  template(#tallnew)
    task-list(tabUrl="get_all_new")
  template(#tmodes)
    task-mode-list

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Tabs, { ICustomTabItem } from '@/components/tabs/tabs.vue'
import TaskList from './task-list.vue'
import TaskModeList from './modes/list.vue'

@Component({
  name: 'TasksIndex',
  components: {
    TaskList,
    Tabs,
    TaskModeList
  }
})
export default class extends Vue {
  private tabItems: ICustomTabItem[] = [
    { title: this.$t('tasks.newChallenges'), name: 'tnew' },
    { title: this.$t('tasks.challengesAchieved'), name: 'tfin' },
    { title: this.$t('tasks.failedChallenges'), name: 'tf' },
    { title: this.$t('tasks.allTasks'), name: 'tall' },
    { title: this.$t('tasks.allUncompleted'), name: 'tallnew' },
    { title: this.$t('tasks.modes.titlePlural'), name: 'tmodes' }
  ]
}
</script>
