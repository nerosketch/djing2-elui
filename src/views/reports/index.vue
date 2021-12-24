<template lang="pug">
  .app-container
    el-row(:gutter="32")
      el-col(
        :xs="24"
        :sm="24"
        :lg="8")
        el-card
          template(v-slot:header)
            .clearfix
              | {{ $t('chastota-ispolzovaniya-kharakterov-zadach') }}
        
          task-mode-report-pie-chart(v-if="$perms.tasks.can_view_task_mode_report")
        
          h4(v-else)
            | {{ $t('nedostatochno-prav') }}
    
      el-col(
        :xs="24"
        :sm="24"
        :lg="8")
        el-card
          template(v-slot:header)
            .clearfix
              | {{ $t('raspredelenie-ispolzovaniya-uslug-abonentami') }}
        
          customer-service-type-report(v-if="$perms.customers.can_view_service_type_report")
        
          h4(v-else)
            | {{ $t('nedostatochno-prav-0') }}
    
      el-col(
        :xs="24"
        :sm="24"
        :lg="8")
        el-card
          template(v-slot:header)
            .clearfix
              | {{ $t('aktivnost-abonentov') }}
        
          customer-activity-report(v-if="$perms.customers.can_view_activity_report")
        
          h4(v-else)
            | {{ $t('nedostatochno-prav-1') }}
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
          title: this.$t('otchyoty-vsyakie')
        }
      }
    ] as any)
  }
  // End Breadcrumbs

  created() {
    document.title = this.$t('otchyoty-vsyakie-0')
    this.buildBreadcrumb()
  }
}
</script>
