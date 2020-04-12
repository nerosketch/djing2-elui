<template lang="pug">
  el-row.app-container(:gutter="5")
    el-col(:span="12")
      el-card(shadow="never")
        .clearfix(slot='header')
          span Редактировать задачу
        task-form(v-if='taskReady' :recipients="recipients")
    el-col(:span='12')
      task-info(v-if='taskReady' :recipients="recipients")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TaskModule } from '../../store/modules/tasks/tasks'
import { getProfiles } from '@/api/users'
import { IProfile } from '@/api/users-types'
import TaskForm from './task-form.vue'
import TaskInfo from './task-info.vue'

@Component({
  name: 'TaskDetails',
  components: { TaskForm, TaskInfo }
})
export default class extends Vue {
  @Prop({ default: 0 })
  private taskId!: number
  private taskReady = false
  private recipients: IProfile[] = []

  private async loadTask() {
    if(this.taskId === 0) {
      this.$message.error('Не передан ID задачи')
      return
    }
    await TaskModule.GetTask(this.taskId)
  }

  private async loadRecipients() {
    const r = await getProfiles()
    this.recipients = r.data.results
  }

  async created() {
    this.taskReady = false
    await this.loadTask()
    await this.loadRecipients()
    this.taskReady = true
  }
}
</script>
