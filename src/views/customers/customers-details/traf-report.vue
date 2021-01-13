<template lang="pug">
  line-chart(
    :chartData="chartDat"
  )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import LineChart, { ILineChartData } from '@/views/reports/line-chart.vue'
import { getTrafArchive } from '@/api/traf_stat/req'

@Component({
  name: 'TrafReport',
  components: {
    LineChart
  }
})
export default class extends Vue {
  @Prop({ required: true })
  private customerId!: number

  private load = false

  private chartDat: ILineChartData = {
    octets: [],
    packets: [],
    dates: []
  }

  private async fetchTrafArchive() {
    this.load = true
    try {
      const { data } = await getTrafArchive(this.customerId, 1610093467.085588, 1610525853.746703)
      this.chartDat.octets = data.flatMap(ta => ta.octsum)
      this.chartDat.packets = data.flatMap(ta => ta.pctsum)
      this.chartDat.dates = data.flatMap(ta => new Date(ta.time))
    } finally {
      this.load = false
    }
  }

  created() {
    this.fetchTrafArchive()
  }
}
</script>
