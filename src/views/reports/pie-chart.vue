<template lang="pug">
  div(
    :class="className"
    :style="{height: height, width: width}"
    v-loading="repLoading"
  )
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'
import { PieChartReport } from '@/api/types'

@Component({
  name: 'PieChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '300px' }) private height!: string
  @Prop({ default: false }) private repLoading!: boolean
  @Prop({ default: null }) private chartInputData!: PieChartReport | null
  @Prop({ default: null }) private seriesName!: string | null

  mounted() {
    this.$nextTick(() => {
      if (this.chartInputData) {
        this.initChart(this.chartInputData)
      }
    })
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  @Watch('chartInputData')
  private initChart({labels, data}: PieChartReport) {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        left: 'center',
        bottom: '0',
        data: labels
      },
      series: [
        {
          name: this.seriesName,
          type: 'pie',
          roseType: 'radius',
          radius: [15, 95],
          center: ['50%', '38%'],
          data: data,
          animationEasing: 'cubicInOut',
          animationDuration: 2600
        }
      ]
    } as EChartOption<EChartOption.SeriesPie>)
  }
}
</script>
