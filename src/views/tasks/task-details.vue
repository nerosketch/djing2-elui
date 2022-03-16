<template lang="pug">
  el-row.app-container(:gutter="5")
    el-col.mt5(:lg="12" :sm='24')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix {{ $t('tasks.edit', [taskId]) }}
        task-form(v-if='taskReady' :recipients="potentialRecipients")
    el-col.mt5(:lg='12' :sm='24')
      task-info(v-if='taskReady' :recipients="potentialRecipients" :taskId="taskId")
    el-col.mt5(:lg='12' :sm='24')
      comments(v-if='taskReady')
    el-col.mt5(:lg='12' :sm='24')
      finish-doc-index
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { TaskModule } from '@/store/modules/tasks/tasks'
import TaskForm from './task-form.vue'
import TaskInfo from './task-info.vue'
import Comments from './comments.vue'
import {
  IWsMessage,
  IWsMessageEventTypeEnum
} from '@/layout/mixin/ws'
import TabMixin from '@/utils/tab-mixin'
import FinishDocIndex from './finish_doc/index.vue'
import { getActiveProfiles } from '@/api/profiles/req'
import { IUserProfile } from '@/api/profiles/types'

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
export default class extends mixins(TabMixin) {
  @Prop({ default: 0 })
  private taskId!: number

  private taskReady = false
  protected activeTabName = 'details'

  private potentialRecipients: IUserProfile[] = []

  private async loadTask() {
    if (this.taskId === 0) {
      this.$message.error(this.$tc('notTransferred'))
      return
    }
    await TaskModule.GetTask(this.taskId)
    document.title = this.$t('tasks.taskCustomerDocTitle', [TaskModule.customer_full_name]) as string
  }

  async created() {
    this.taskReady = false
    await this.loadTask()
    await this.loadPotentialRecipients()
    this.taskReady = true

    // Subscribe for task update event from server
    this.$eventHub.$on(IWsMessageEventTypeEnum.UPDATETASK, this.onUpdateTask)
  }

  protected async loadPotentialRecipients() {
    const { data } = await getActiveProfiles({
      page: 1,
      page_size: 0,
      fields: 'id,full_name,username'
    })
    this.potentialRecipients = data
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
