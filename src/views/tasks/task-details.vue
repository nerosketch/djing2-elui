<template lang="pug">
  el-row.app-container
    el-col(:span="12")
      el-card(shadow="never")
        .clearfix(slot='header')
          span Редактировать задачу
        task-form(v-if='taskReady')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { TaskModule } from '../../store/modules/tasks/tasks'
import TaskForm from './task-form.vue'

@Component({
  name: 'TaskDetails',
  components: { TaskForm }
})
export default class extends Vue {
  @Prop({ default: 0 })
  private taskId!: number
  private taskReady = false

  private async loadTask() {
    this.taskReady = false
    if(this.taskId === 0) {
      this.$message.error('Не передан ID задачи')
      return
    }
    await TaskModule.GetTask(this.taskId)
    this.taskReady = true
  }

  created() {
    this.loadTask()
  }
}
</script>
