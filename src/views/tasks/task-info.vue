<template lang="pug">
  el-card(shadow="never")
    template(#header)
      .clearfix {{ $t('tasks.targets') }}
    p
      b {{ $t('tasks.description') }}
      | {{ $store.state.task.descr }}
    p
      b {{ $t('tasks.author') }}
      | {{ $store.state.task.author_full_name }}
    p
      b {{ $t('tasks.implementers') }}
      ul
        li(v-for="rec in taskRecipients" :key='rec.id') {{ rec.full_name || rec.username }}
    b {{ $t('tasks.priority') }}
    span {{ $store.state.task.priority_name }}
    br
    b {{ $t('tasks.targetValidUntil') }}
    span {{ $store.state.task.out_date }}
    br
    b {{ $t('dateOfEstablishment') }}
    span {{ $store.state.task.time_of_create }}
    br
    b {{ $t('timeLeft') }}
    span {{ $store.state.task.time_diff }}
    br
    b {{ $t('tasks.natureOfFracture') }}
    span {{ $store.state.task.mode_str }}
    br
    b {{ $t('tasks.taskStatus') }}:&nbsp;
    span {{ $store.state.task.state_str }}
    br
    b {{ $t('customer') }}:&nbsp;
    router-link(:to="taskCustomerLink")
      el-link(type="primary") {{ $store.state.task.customer_full_name }}
    el-divider
    task-docs(:taskId="taskId")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
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
        uid: this.$store.state.task.customer_id
      }
    }
  }

  get taskRecipients() {
    const recipIds = this.$store.state.task.recipients
    return this.recipients.filter(r => recipIds.includes(r.id))
  }
}
</script>
