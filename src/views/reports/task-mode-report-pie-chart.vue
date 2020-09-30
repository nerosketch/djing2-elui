<template lang="pug">
  pie-chart(
    :repLoading="repLoading"
    :taskModeReport="taskModeReport"
  )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PieChart from './pie-chart.vue'
import { TaskModeReport } from '@/api/tasks/types'
import { taskModeReportRequest } from '@/api/tasks/req'

@Component({
  name: 'TaskModeReportPieChart',
  components: { PieChart }
})
export default class extends Vue {
  private repLoading = false
  private taskModeReport: TaskModeReport | null = null

  private async loadTaskModeReport() {
    this.repLoading = true
    try {
      const { data } = await taskModeReportRequest()
      this.taskModeReport = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.repLoading = false
    }
  }

  created() {
    this.loadTaskModeReport()
  }
}
</script>
