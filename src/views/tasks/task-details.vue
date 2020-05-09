<template lang="pug">
  el-row.app-container(:gutter="5")
    el-col(:lg="12" :sm='24')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix
            span Редактировать задачу
        task-form(v-if='taskReady' :recipients="recipients")
    el-col(:lg='12' :sm='24')
      task-info(v-if='taskReady' :recipients="recipients")
    el-col(:lg='12' :sm='24')
      comments(v-if='taskReady')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TaskModule } from '../../store/modules/tasks/tasks'
import { getProfiles } from '@/api/profiles/req'
import { IUserProfile } from '@/api/profiles/types'
import TaskForm from './task-form.vue'
import TaskInfo from './task-info.vue'
import Comments from './comments.vue'

@Component({
  name: 'TaskDetails',
  components: { TaskForm, TaskInfo, Comments }
})
export default class extends Vue {
  @Prop({ default: 0 })
  private taskId!: number
  private taskReady = false
  private recipients: IUserProfile[] = []

  private async loadTask() {
    if (this.taskId === 0) {
      this.$message.error('Не передан ID задачи')
      return
    }
    await TaskModule.GetTask(this.taskId)
  }

  private async loadRecipients() {
    const r = await getProfiles({
      page: 1,
      page_size: 9000,
      fields: 'pk,full_name,username'
    })
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
