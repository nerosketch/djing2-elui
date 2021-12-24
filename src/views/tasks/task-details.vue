<template lang="pug">
  el-row.app-container(:gutter="5")
    el-col.mt5(:lg="12" :sm='24')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix {{ $t('redaktirovat-zadachu-taskid', [taskId]) }}
        task-form(v-if='taskReady' :recipients="potentialRecipients")
    el-col.mt5(:lg='12' :sm='24')
      task-info(v-if='taskReady' :recipients="potentialRecipients" :taskId="taskId")
    el-col.mt5(:lg='12' :sm='24')
      comments(v-if='taskReady')

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
      this.$message.error(this.$t('ne-peredan-id-zadachi'))
      return
    }
    await TaskModule.GetTask(this.taskId)
    document.title = this.$t('zadacha-po-taskmodule-customer_full_name', [TaskModule.customer_full_name])
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
