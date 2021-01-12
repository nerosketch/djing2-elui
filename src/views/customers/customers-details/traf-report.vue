<template lang="pug">
  line-chart(
    :chartData="cd"
  )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LineChart, { ILineChartData } from '@/views/reports/line-chart.vue'

const lineChartData: { [type: string]: ILineChartData } = {
  newVisitis: {
    octets: [100, 120, 161, 134, 105, 160, 165],
    packets: [120, 82, 91, 154, 162, 140, 145]
  },
}

@Component({
  name: 'TrafReport',
  components: {
    LineChart
  }
})
export default class extends Vue {
  get cd() {
    return lineChartData.newVisitis
  }
}
</script>
