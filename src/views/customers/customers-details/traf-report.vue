<template>  
  <div v-loading="loading">
    <line-chart :chartData="chartDat"></line-chart><span>Временной срез:</span>
    <el-date-picker v-model="timerange" type="datetimerange" range-separator="-" start-placeholder="Начало среза" end-placeholder="Конец среза"></el-date-picker>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
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

  private loading = false

  private timerange = [
    new Date(new Date().setHours(0, 0, 0, 0)),
    new Date(new Date().setHours(23, 59, 59, 999))
  ]

  private chartDat: ILineChartData = {
    octets: [],
    packets: [],
    dates: []
  }

  private async fetchTrafArchive() {
    const todayStartTime = this.timerange[0]
    const todayEndTime = this.timerange[1]
    this.loading = true
    try {
      const { data } = await getTrafArchive(this.customerId, todayStartTime, todayEndTime)
      this.chartDat.octets = data.flatMap(ta => ta.octsum / 1000)
      this.chartDat.packets = data.flatMap(ta => ta.pctsum)
      this.chartDat.dates = data.flatMap(ta => new Date(ta.time))
    } finally {
      this.loading = false
    }
  }

  @Watch('timerange')
  private onTimeRangeChanged() {
    this.fetchTrafArchive()
  }

  created() {
    this.fetchTrafArchive()
  }
}
</script>
