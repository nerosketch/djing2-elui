<template lang="pug">
  bar-chart(
    :labels="barLabels"
    :values="barValues"
    :loading="cloading"
  )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BarChart from './bar-chart.vue'
import { customersActivityReportRequest } from '@/api/customers/req'

@Component({
  name: 'CustomerActivityReport',
  components: { BarChart }
})
export default class extends Vue {
  private barLabels = ['Всего', 'Включённые', 'С услугой', 'Активные', 'Оплатившие']
  private barValues = [0, 0, 0, 0, 0]
  private cloading = false

  private async loadCustomersActivityReport() {
    this.cloading = true
    try {
      const { data } = await customersActivityReportRequest()
      this.barValues = [
        data.all_count,
        data.enabled_count,
        data.with_services_count,
        data.active_count,
        data.commercial_customers
      ]
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.cloading = false
    }
  }

  created() {
    this.loadCustomersActivityReport()
  }
}
</script>
