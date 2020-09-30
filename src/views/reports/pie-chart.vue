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
import { TaskModeReport } from '@/api/tasks/types'

interface ChartData {
  value: number
  name: string
}

@Component({
  name: 'PieChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '300px' }) private height!: string
  @Prop({ default: false }) private repLoading!: boolean
  @Prop({ default: null }) private taskModeReport: TaskModeReport | null = null

  mounted() {
    this.$nextTick(() => {
      if (this.taskModeReport) {
        this.initChart(this.taskModeReport)
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

  @Watch('taskModeReport')
  private initChart(reportData: TaskModeReport) {
    let an = reportData.annotation
    let labels = an.map(i => i.mode)
    let chartData = an.map(i => ({ value: i.task_count, name: i.mode }))
  
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
          name: 'WEEKLY WRITE ARTICLES',
          type: 'pie',
          roseType: 'radius',
          radius: [15, 95],
          center: ['50%', '38%'],
          data: chartData,
          animationEasing: 'cubicInOut',
          animationDuration: 2600
        }
      ]
    } as EChartOption<EChartOption.SeriesPie>)
  }
}
</script>
