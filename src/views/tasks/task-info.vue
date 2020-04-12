<template lang="pug">
  el-card(shadow="never")
    .clearfix(slot='header')
      span Детали задачи
    p Описание: {{ taskDescr }}
    p Автор задачи: {{ authorName }}
    div Исполнители:
      ul
        li(v-for="rec in taskRecipients" :key='rec.pk') {{ rec.full_name }}
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TaskModule } from '@/store/modules/tasks/tasks'
import { IProfile } from '@/api/users-types'

@Component({
  name: 'TaskInfo'
})
export default class extends Vue {
  @Prop({ default: [] })
  private recipients!: IProfile[]

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
    let res = []
    const recipIds = TaskModule.recipients
    for(const r of this.recipients) {
      if(recipIds.includes(r.pk)) {
        res.push(r)
      }
    }
    return res
  }
}
</script>
