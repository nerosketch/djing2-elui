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
        customer-service-type-report
    //- el-col(
    //-   :xs="24"
    //-   :sm="24"
    //-   :lg="8"
    //- )
    //-   el-card
    //-     template(v-slot:header)
    //-       .clearfix График игрульный
    //-     radar-chart
</template>

<script lang="ts">
import 'echarts/theme/macarons.js' // Theme used in BarChart, LineChart, PieChart and RadarChart
import { Component, Vue } from 'vue-property-decorator'
import { RouteRecord } from 'vue-router'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import TaskModeReportPieChart from './task-mode-report-pie-chart.vue'
import CustomerServiceTypeReport from './customer-service-type-report.vue'
// import RadarChart from './radar-chart.vue'

@Component({
  name: 'ReportsIndex',
  components: {
    TaskModeReportPieChart,
    CustomerServiceTypeReport
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
    ] as RouteRecord[])
  }
  // End Breadcrumbs

  created() {
    this.buildBreadcrumb()
  }
}
</script>
