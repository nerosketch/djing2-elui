<template lang="pug">
.app-container
  el-row(:gutter="32")
    el-col(
      :xs="24"
      :sm="24"
      :lg="8"
    )
      el-card
        template(v-slot:header)
          .clearfix Частота использования характеров задач
        task-mode-report-pie-chart
    el-col(
      :xs="24"
      :sm="24"
      :lg="8"
    )
      el-card
        template(v-slot:header)
          .clearfix Распределение использования услуг абонентами
        customer-service-type-report(
          v-if="$perms.customers.can_view_service_type_report"
        )
        h4(v-else) Не достаточно прав
    el-col(
      :xs="24"
      :sm="24"
      :lg="8"
    )
      el-card
        template(v-slot:header)
          .clearfix Активность абонентов
        customer-activity-report(
          v-if="$perms.customers.can_view_activity_report"
        )
        h4(v-else) Не достаточно прав
</template>

<script lang="ts">
import 'echarts/theme/macarons.js' // Theme used in BarChart, LineChart, PieChart and RadarChart
import { Component, Vue } from 'vue-property-decorator'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import TaskModeReportPieChart from './task-mode-report-pie-chart.vue'
import CustomerServiceTypeReport from './customer-service-type-report.vue'
// import RadarChart from './radar-chart.vue'
import CustomerActivityReport from './customer-activity-report.vue'

@Component({
  name: 'ReportsIndex',
  components: {
    TaskModeReportPieChart,
    CustomerServiceTypeReport,
    CustomerActivityReport
  }
})
export default class extends Vue {
  // Breadcrumbs
  private async buildBreadcrumb() {
    await BreadcrumbsModule.SetCrumbs([
      {
        path: '',
        meta: {
          hidden: true,
          title: 'Отчёты всякие'
        }
      }
    ] as any[])
  }
  // End Breadcrumbs

  created() {
    document.title = 'Отчёты всякие'
    this.buildBreadcrumb()
  }
}
</script>
