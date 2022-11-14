<template lang="pug">
  el-row.app-container(:gutter="5")
    el-col.mt5(:lg="12" :sm='24')
      el-card(shadow="never")
        template(#header)
          .clearfix {{ $t('tasks.edit', [taskId]) }}
        task-form(
          v-if='taskReady'
          :recipients="potentialRecipients"
          @updated="onUpdatedTask"
        )
    el-col.mt5(:lg='12' :sm='24')
      task-info(
        v-if='taskReady'
        :recipients="potentialRecipients"
        :taskId="taskId"
      )
    el-col.mt5(:lg='12' :sm='24')
      comments(
        ref="commentsref"
        v-if='taskReady'
      )
    el-col.mt5(:lg='12' :sm='24')
      finish-doc-index(
        :recipients="potentialRecipients"
      )
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TaskModule } from '@/store/modules/tasks/tasks'
import TaskForm from './task-form.vue'
import TaskInfo from './task-info.vue'
import Comments from './comments.vue'
import {
  IWsMessage,
  IWsMessageEventTypeEnum
} from '@/layout/mixin/ws'
import FinishDocIndex from './finish_doc/index.vue'
import { IUserProfile } from '@/api/profiles/types'
import { loadPotentialRecipients } from './recipients-field-choice.vue'

interface ITaskEventData {
  task_id: number
}

@Component({
  name: 'TaskDetails',
  components: {
    TaskForm,
    TaskInfo,
    Comments,
    FinishDocIndex
  }
})
export default class extends Vue {
  public readonly $refs!:{
    commentsref: Comments
  }

  @Prop({ default: 0 })
  private taskId!: number

  private taskReady = false

  private potentialRecipients: IUserProfile[] = []

  private async loadTask() {
    if (this.taskId === 0) {
      this.$message.error(this.$tc('notTransferred'))
      return
    }
    await TaskModule.GetTask(this.taskId)
    document.title = this.$tc('tasks.taskCustomerDocTitle', 1, [TaskModule.customer_full_name])
  }

  async created() {
    this.taskReady = false
    await this.loadPotentialRecipients()
    await this.loadTask()
    this.taskReady = true

    // Subscribe for task update event from server
    this.$eventHub.$on(IWsMessageEventTypeEnum.UPDATETASK, this.onUpdateTask)
  }

  protected async loadPotentialRecipients() {
    this.potentialRecipients = await loadPotentialRecipients()
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

  private onUpdatedTask() {
    this.$refs.commentsref.loadComments()
  }
}
</script>
