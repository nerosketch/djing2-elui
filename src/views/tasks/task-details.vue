<template lang="pug">
  el-row.app-container(:gutter="5")
    el-col(:lg="12" :sm='24')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix Редактировать задачу № {{ taskId }}
        task-form(v-if='taskReady' :recipients="potentialRecipients")
    el-col(:lg='12' :sm='24')
      task-info(v-if='taskReady' :recipients="potentialRecipients" :taskId="taskId")
    el-col(:lg='12' :sm='24')
      comments(v-if='taskReady')
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { TaskModule } from '@/store/modules/tasks/tasks'
import { IUserProfile } from '@/api/profiles/types'
import TaskForm from './task-form.vue'
import TaskInfo from './task-info.vue'
import Comments from './comments.vue'
import taskMixin from './task-mixin'

@Component({
  name: 'TaskDetails',
  components: { TaskForm, TaskInfo, Comments }
})
export default class extends mixins(taskMixin) {
  @Prop({ default: 0 })
  private taskId!: number
  private taskReady = false

  private async loadTask() {
    if (this.taskId === 0) {
      this.$message.error('Не передан ID задачи')
      return
    }
    await TaskModule.GetTask(this.taskId)
  }

  async created() {
    this.taskReady = false
    await this.loadTask()
    await this.loadPotentialRecipients()
    this.taskReady = true
  }
}
</script>
