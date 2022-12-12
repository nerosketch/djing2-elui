<template lang="pug">
  pie-chart(
    :repLoading="repLoading"
    :chartInputData="taskModeReport"
    seriesName="Характеры задач")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { PieChartReport } from '@/api/types'
import PieChart from './pie-chart.vue'
import { taskModeReportRequest } from '@/api/tasks/req'

@Component({
  name: 'TaskModeReportPieChart',
  components: { PieChart }
})
export default class extends Vue {
  private repLoading = false
  private taskModeReport: PieChartReport | null = null

  private async loadTaskModeReport() {
    this.repLoading = true
    try {
      const { data } = await taskModeReportRequest()
      const an = data.annotation
      const labels = an.map(i => i.task_mode)
      const chartData = an.map(i => ({ value: i.task_count, name: i.task_mode }))

      this.taskModeReport = {
        labels: labels,
        data: chartData
      }
    } finally {
      this.repLoading = false
    }
  }

  created() {
    this.loadTaskModeReport()
  }
}
</script>
