<template lang="pug">
  pie-chart(
    :repLoading="repLoading"
    :chartInputData="customerServiceTypeReport"
    seriesName="типы задач")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { PieChartReport } from '@/api/types'
import PieChart from './pie-chart.vue'
import { customerServiceTypeReportRequest } from '@/api/customers/req'

@Component({
  name: 'CustomerServiceTypeReport',
  components: { PieChart }
})
export default class extends Vue {
  private repLoading = false
  private customerServiceTypeReport: PieChartReport | null = null

  private async loadCustomerServiceTypeReport() {
    this.repLoading = true
    try {
      const { data } = await customerServiceTypeReportRequest()
      const admName = this.$tc('withAdministrativeServices')
      const zeroName = this.$tc('freeServices')
      const chartData = [{
        value: data.admin_count,
        name: admName
      }, {
        value: data.zero_cost_count,
        name: zeroName
      }].concat(data.calc_type_counts.map(i => ({
        value: i.calc_type_count,
        name: i.service_descr
      })))

      const otherLabels = data.calc_type_counts.map(i => i.service_descr)
      this.customerServiceTypeReport = {
        labels: [
          admName,
          zeroName
        ].concat(otherLabels),
        data: chartData
      }
    } finally {
      this.repLoading = false
    }
  }

  created() {
    this.loadCustomerServiceTypeReport()
  }
}
</script>
