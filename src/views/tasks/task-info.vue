<template>
  <el-card shadow="never">
    <template v-slot:header>
      <div class="clearfix">{{ $t('detali-zadachi') }}</div>
    </template>
    <p>{{ $t('opisanie-store-state-task-descr', [$store.state.task.descr]) }}</p>
    <p>{{ $t('avtor-zadachi-store-state-task-author_full_name', [$store.state.task.author_full_name]) }}</p>
    <div>{{ $t('ispolniteli-0') }}
      <ul>
        <li v-for="rec in taskRecipients" :key="rec.id">{{ rec.full_name || rec.username }}</li>
      </ul>
    </div><b>{{ $t('prioritet-0') }}</b><span>{{ $store.state.task.priority_name }}</span><br><b>{{ $t('zadacha-deistvitelna-do') }}</b><span>{{ $store.state.task.task_out_date }}</span><br><b>{{ $t('data-sozdaniya-1') }}</b><span>{{ $store.state.task.time_of_create }}</span><br><b>{{ $t('vremeni-ostalos') }}</b><span>{{ $store.state.task.task_time_diff }}</span><br><b>{{ $t('kharakter-polomki-0') }}</b><span>{{ $store.state.task.mode_str }}</span><br><b>{{ $t('sostoyanie-1') }}</b><span>{{ $store.state.task.state_str }}</span><br><b>{{ $t('abonent-0') }}</b>
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
