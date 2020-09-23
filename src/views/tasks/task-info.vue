<template lang="pug">
  el-card(shadow="never")
    template(v-slot:header)
      .clearfix Детали задачи
    p Описание: {{ taskDescr }}
    p Автор задачи: {{ authorName }}
    div Исполнители:
      ul
        li(v-for="rec in taskRecipients" :key='rec.pk') {{ rec.full_name || rec.username }}
    b Приоритет: 
    span {{ taskPrior }}
    br
    b Задача действительна до 
    span {{ taskOutDate }}
    br
    b Дата создания: 
    span {{ taskCreateTime }}
    br
    b Времени осталось: 
    span {{ taskTimeDiff }}
    br
    b Характер поломки: 
    span {{ taskMode }}
    br
    b Состояние: 
    span {{ taskState }}
    br
    b Абонент: 
    el-link(type="primary")
      router-link(:to="taskCustomerLink") {{ taskCustomerName }}
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

  get taskDescr() {
    return TaskModule.descr
  }

  get authorName() {
    return TaskModule.author_full_name
  }

  get taskPrior() {
    return TaskModule.priority_name
  }

  get taskOutDate() {
    return TaskModule.out_date
  }

  get taskCreateTime() {
    return TaskModule.time_of_create
  }

  get taskTimeDiff() {
    return TaskModule.time_diff
  }

  get taskMode() {
    return TaskModule.mode_str
  }

  get taskState() {
    return TaskModule.state_str
  }

  get taskCustomerName() {
    return TaskModule.customer_full_name
  }

  get taskRecipients() {
    const recipIds = TaskModule.recipients
    return this.recipients.filter(r => recipIds.includes(r.pk))
  }
}
</script>
