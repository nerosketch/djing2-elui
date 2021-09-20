<template lang="pug">
  el-card(shadow="never")
    template(v-slot:header)
      .clearfix Детали задачи
    p Описание: {{ $store.state.task.descr }}
    p Автор задачи: {{ $store.state.task.author_full_name }}
    div Исполнители:
      ul
        li(v-for="rec in taskRecipients" :key='rec.id') {{ rec.full_name || rec.username }}
    b Приоритет:
    span {{ $store.state.task.priority_name }}
    br
    b Задача действительна до
    span {{ $store.state.task.task_out_date }}
    br
    b Дата создания:
    span {{ $store.state.task.time_of_create }}
    br
    b Времени осталось:
    span {{ $store.state.task.task_time_diff }}
    br
    b Характер поломки:
    span {{ $store.state.task.mode_str }}
    br
    b Состояние:
    span {{ $store.state.task.state_str }}
    br
    b Абонент:
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
