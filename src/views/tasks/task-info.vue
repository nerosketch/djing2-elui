<template lang="pug">
  el-card(shadow="never")
    template(v-slot:header)
      .clearfix {{ $t('detali-zadachi') }}
    p {{ $t('opisanie-store-state-task-descr', [$store.state.task.descr]) }}
    p {{ $t('avtor-zadachi-store-state-task-author_full_name', [$store.state.task.author_full_name]) }}
    div {{ $t('ispolniteli-0') }}
      ul
        li(v-for="rec in taskRecipients" :key='rec.id') {{ rec.full_name || rec.username }}
    b {{ $t('prioritet-0') }}
    span {{ $store.state.task.priority_name }}
    br
    b {{ $t('zadacha-deistvitelna-do') }}
    span {{ $store.state.task.task_out_date }}
    br
    b {{ $t('data-sozdaniya-1') }}
    span {{ $store.state.task.time_of_create }}
    br
    b {{ $t('vremeni-ostalos') }}
    span {{ $store.state.task.task_time_diff }}
    br
    b {{ $t('kharakter-polomki-0') }}
    span {{ $store.state.task.mode_str }}
    br
    b {{ $t('sostoyanie-1') }}
    span {{ $store.state.task.state_str }}
    br
    b {{ $t('abonent-0') }}
    router-link(:to="taskCustomerLink")
      el-link(type="primary") {{ $store.state.task.customer_full_name }}
    el-divider
    task-docs(:taskId="taskId")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TaskModule } from '@/store/modules/tasks/tasks'
import { IUserProfile } from '@/api/profiles/types'
import TaskDocs from './task-docs.vue'

@Component({
  name: 'TaskInfo',
  components: { TaskDocs }
})
export default class extends Vue {
  @Prop({ default: [] })
  private recipients!: IUserProfile[]
  @Prop({ default: 0 })
  private taskId!: number

  get taskCustomerLink() {
    return {
      name: 'customerDetails',
      params: {
        uid: TaskModule.customer
      }
    }
  }

  get taskRecipients() {
    const recipIds = TaskModule.recipients
    return this.recipients.filter(r => recipIds.includes(r.id))
  }
}
</script>