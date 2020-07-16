<template lang="pug">
  .tab-container
    el-tabs(
      v-model="activeName"
      style="margin-top:15px"
      type="border-card"
    )
      el-tab-pane(
        label='Новые задачи'
        name='tnew'
        lazy
      )
        keep-alive
          task-list(tabUrl="get_new")
      el-tab-pane(
        label='Выполненные задачи'
        name='tfin'
        lazy
      )
        keep-alive
          task-list(tabUrl="get_finished")
      el-tab-pane(
        label='Назначенные мной задачи'
        name='town'
        lazy
      )
        keep-alive
          task-list(tabUrl="get_own")
      el-tab-pane(
        label='Проваленные задачи'
        name='tf'
        lazy
      )
        keep-alive
          task-list(tabUrl="get_failed")
      el-tab-pane(
        label='Все мои задачи'
        name='tmy'
        lazy
      )
        keep-alive
          task-list(tabUrl="get_my")
      el-tab-pane(
        label='Все задачи'
        name='tall'
        lazy
      )
        keep-alive
          task-list(tabUrl="get_all")

</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import TaskList from './task-list.vue'

@Component({
  name: 'TasksIndex',
  components: { TaskList }
})
export default class extends Vue {
  private activeName = 'tnew'

  @Watch('activeName')
  private onActiveNameChange(value: string) {
    const newPath = `${this.$route.path}?tab=${value}`
    if (newPath !== this.$route.fullPath) {
      this.$router.push(newPath)
    }
  }

  created() {
    const tab = this.$route.query.tab as string
    if (tab) {
      this.activeName = tab
    }
  }
}
</script>
