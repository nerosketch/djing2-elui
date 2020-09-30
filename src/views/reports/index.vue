<template lang="pug">
.app-container
  el-row(:gutter="32")
    el-col(
      :xs="24"
      :sm="24"
      :lg="8"
    )
      el-card
        template(v-slot:header)
          .clearfix График пироговый
        pie-chart
    el-col(
      :xs="24"
      :sm="24"
      :lg="8"
    )
      el-card
        template(v-slot:header)
          .clearfix График игрульный
        radar-chart
</template>

<script lang="ts">
import 'echarts/theme/macarons.js' // Theme used in BarChart, LineChart, PieChart and RadarChart
import { Component, Vue } from 'vue-property-decorator'
import PieChart from './pie-chart.vue'
import RadarChart from './radar-chart.vue'

@Component({
  name: 'ReportsIndex',
  components: {
    PieChart,
    RadarChart
  }
})
export default class extends Vue {
  // dsfsdf
}
</script>
