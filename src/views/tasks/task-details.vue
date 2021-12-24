<template>  
  <el-row class="app-container" :gutter="5">
    <el-col class="mt5" :lg="12" :sm="24">
      <el-card shadow="never">
        <template v-slot:header>
          <div class="clearfix">Редактировать задачу № {{ taskId }}</div>
        </template>
        <task-form v-if="taskReady" :recipients="potentialRecipients"></task-form>
      </el-card>
    </el-col>
    <el-col class="mt5" :lg="12" :sm="24">
      <task-info v-if="taskReady" :recipients="potentialRecipients" :taskId="taskId"></task-info>
    </el-col>
    <el-col class="mt5" :lg="12" :sm="24">
      <comments v-if="taskReady"></comments>
    </el-col>
  </el-row>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { TaskModule } from '@/store/modules/tasks/tasks'
import TaskForm from './task-form.vue'
import TaskInfo from './task-info.vue'
import Comments from './comments.vue'
import taskMixin from './task-mixin'
import { IWsMessage, IWsMessageEventTypeEnum } from '@/layout/mixin/ws'

interface ITaskEventData {
  task_id: number
}

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
    document.title = `Задача по ${TaskModule.customer_full_name}`
  }

  async created() {
    this.taskReady = false
    await this.loadTask()
    await this.loadPotentialRecipients()
    this.taskReady = true

    // Subscribe for task update event from server
    this.$eventHub.$on(IWsMessageEventTypeEnum.UPDATETASK, this.onUpdateTask)
  }

  beforeDestroy() {
    this.$eventHub.$off(IWsMessageEventTypeEnum.UPDATETASK, this.onUpdateTask)
  }

  private onUpdateTask(msg: IWsMessage) {
    const dat = msg.data as ITaskEventData
    if (dat.task_id === this.taskId) {
      this.loadTask()
    }
  }
}
</script>
