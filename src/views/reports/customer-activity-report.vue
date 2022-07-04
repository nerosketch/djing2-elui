<template lang="pug">
  bar-chart(
    :labels="barLabels"
    :values="barValues"
    :loading="cloading")
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
  private barLabels = [this.$tc('total'), this.$tc('including'), this.$tc('withServices'), this.$tc('active'), this.$tc('payments')]
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
    } finally {
      this.cloading = false
    }
  }

  created() {
    this.loadCustomersActivityReport()
  }
}
</script>
