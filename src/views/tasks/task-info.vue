<template>  
  <el-card shadow="never">
    <template v-slot:header>
      <div class="clearfix">Детали задачи</div>
    </template>
    <p>Описание: {{ $store.state.task.descr }}</p>
    <p>Автор задачи: {{ $store.state.task.author_full_name }}</p>
    <div>Исполнители:
      <ul>
        <li v-for="rec in taskRecipients" :key="rec.id">{{ rec.full_name || rec.username }}</li>
      </ul>
    </div><b>Приоритет:</b><span>{{ $store.state.task.priority_name }}</span><br><b>Задача действительна до</b><span>{{ $store.state.task.task_out_date }}</span><br><b>Дата создания:</b><span>{{ $store.state.task.time_of_create }}</span><br><b>Времени осталось:</b><span>{{ $store.state.task.task_time_diff }}</span><br><b>Характер поломки:</b><span>{{ $store.state.task.mode_str }}</span><br><b>Состояние:</b><span>{{ $store.state.task.state_str }}</span><br><b>Абонент:</b>
    <router-link class="el-link el-link--primary is-underline" :to="taskCustomerLink">{{ $store.state.task.customer_full_name }}</router-link>
    <el-divider></el-divider>
    <task-docs :taskId="taskId"></task-docs>
  </el-card>
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
