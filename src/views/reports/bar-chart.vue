<template lang="pug">
  div(
    :class="className"
    :style="{height: height, width: width}"
    v-loading="loading")
</template>

<script lang="ts">
import * as echarts from 'echarts'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

const animationDuration = 6000

@Component({
  name: 'BarChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '300px' }) private height!: string
  @Prop({ required: true }) private labels!: string[]
  @Prop({ required: true }) private values!: number[]
  @Prop({ default: false }) private loading!: number[]

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  @Watch('values')
  private onValsCh() {
    this.initChart()
  }

  @Watch('labels')
  private onLabelsCh() {
    this.initChart()
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.chart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: 10,
        left: '2%',
        right: '2%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: this.labels,
        axisTick: {
          alignWithLabel: true
        }
      }],
      yAxis: [{
        type: 'value',
        axisTick: {
          show: false
        }
      }],
      series: [{
        name: this.$t('kolichestvo'),
        type: 'bar',
        stack: 'vistors',
        // barWidth: '60%',
        data: this.values,
        animationDuration
      }]
    })
  }
}
</script>
