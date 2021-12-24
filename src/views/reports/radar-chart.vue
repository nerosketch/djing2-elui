<template lang="pug">
  div(:class="className", :style="{height: height, width: width}")
</template>

<script lang="ts">
import * as echarts from 'echarts'
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

const animationDuration = 3000

@Component({
  name: 'RadarChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '300px' }) private height!: string

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
      radar: {
        radius: '66%',
        center: ['50%', '42%'],
        splitNumber: 8,
        splitArea: {
          areaStyle: {
            color: 'rgba(127,95,132,.3)',
            opacity: 1,
            shadowBlur: 45,
            shadowColor: 'rgba(0,0,0,.5)',
            shadowOffsetX: 0,
            shadowOffsetY: 15
          }
        },
        indicator: [
          { name: this.$t('sales'), max: 10000 },
          { name: this.$t('administration'), max: 20000 },
          { name: this.$t('information-technology'), max: 20000 },
          { name: this.$t('customer-support'), max: 20000 },
          { name: this.$t('development'), max: 20000 },
          { name: this.$t('marketing'), max: 20000 }
        ]
      },
      legend: {
        left: 'center',
        bottom: '10',
        data: [this.$t('allocated-budget'), this.$t('expected-spending'), this.$t('actual-spending')]
      },
      series: [{
        type: 'radar',
        symbolSize: 0,
        areaStyle: {
          shadowBlur: 13,
          shadowColor: 'rgba(0,0,0,.2)',
          shadowOffsetX: 0,
          shadowOffsetY: 10,
          opacity: 1
        },
        data: [
          {
            value: [5000, 7000, 12000, 11000, 15000, 14000],
            name: this.$t('allocated-budget')
          },
          {
            value: [4000, 9000, 15000, 15000, 13000, 11000],
            name: this.$t('expected-spending')
          },
          {
            value: [5500, 11000, 12000, 15000, 12000, 12000],
            name: this.$t('actual-spending')
          }
        ],
        animationDuration: animationDuration
      }]
    })
  }
}
</script>
