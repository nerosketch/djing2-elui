<template lang="pug">
  .app-container
    el-date-picker(
      v-model="reportParams.time_range"
      type="daterange"
      :start-placeholder="$t('beginTime')"
      :end-placeholder="$t('endDate')"
      align="right"
      unlink-panels
      value-format="yyyy-MM-dd"
      :picker-options="pickerOptions")

    el-select(
      v-model="reportParams.pay_gw"
      :placeholder="$t('fin.paymentGateway')"
      v-loading="gatewaysLoading"
      :style="{width: '10%'}")
      el-option(
        v-for="gw in payGateways"
        :key="gw.id"
        :label="gw.title"
        :value="gw.id")

    el-select(
      v-model="reportParams.limit"
      placeholder="Limit"
      :style="{width: '10%'}"
    )
      el-option(
        v-for="(l, i) in limitItems"
        :key="i"
        :label="l.toString()"
        :value="l"
      )

    el-radio(
      v-model="reportParams.group_by"
      :label="1"
    ) {{ $t('fin.groupByDay') }}
    el-radio(
      v-model="reportParams.group_by"
      :label="2"
    ) {{ $t('fin.groupByWeek') }}
    el-radio(
      v-model="reportParams.group_by"
      :label="3"
    ) {{ $t('fin.groupByMonth') }}
    el-radio(
      v-model="reportParams.group_by"
      :label="4"
    ) {{ $t('fin.groupByCustomer') }}

    el-button(@click="downloadCsv")
      | {{ $t('fin.downloadCsv') }}

    el-table(
      v-loading="loading"
      :data="tableData"
      border
      fit)
      el-table-column(
        label="DATA"
        min-width="110"
      )
        template(#default="{row}")
          | {{ otherValues(row) }}

      el-table-column(
        :label="$t('amount')"
        min-width="110"
        prop="summ")

      el-table-column(
        :label="$t('paycount')"
        min-width="110"
        prop="pay_count")
</template>

<script lang="ts">
import { IPayBaseGateway, IPayReport } from '@/api/fin/types'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getPayGateways, getPayReport } from '@/api/fin/req'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import save2file from '@/utils/save2file'
import { formatDate } from '@/utils/date-format'

@Component({
  name: 'FinReport'
})
export default class extends Vue {
  private loading = false
  private gatewaysLoading = false

  private limitItems = [20, 50, 100, 150, 200, 250, 400, 600, 999999]

  private tableData: IPayReport[] = []

  private payGateways: IPayBaseGateway[] = []

  private async loadReport() {
    this.loading = true
    try {
      const { data } = await getPayReport(this.getReportParams())
      this.tableData = data
    } finally {
      this.loading = false
    }
  }

  private getReportParams() {
    const rp = this.reportParams
    return {
      from_time: rp.time_range[0],
      to_time: rp.time_range[1],
      pay_gw: rp.pay_gw,
      group_by: rp.group_by,
      limit: rp.limit
    }
  }

  private reportParams = {
    time_range: ['2021-05-22', formatDate(new Date())],
    pay_gw: 0,
    group_by: 3,
    limit: this.limitItems[0]
  }

  @Watch('reportParams', { deep: true })
  private onChangeParams() {
    if (this.isAllowRequest) {
      this.loadReport()
    }
  }

  private pickerOptions = {
    shortcuts: [{
      text: this.$tc('lastWeek'),
      onClick(picker: Vue) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: this.$tc('lastMonth'),
      onClick(picker: Vue) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: this.$tc('last3Months'),
      onClick(picker: Vue) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }]
  }

  // Breadcrumbs
  created() {
    this.loadReport()
    this.loadPayGateways()

    BreadcrumbsModule.SetCrumbs([
      {
        path: '/fin',
        meta: {
          hidden: true,
          title: this.$tc('finance')
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: this.$tc('fin.incomeReport')
        }
      }
    ] as any)
  }
  // End Breadcrumb

  private get isAllowRequest() {
    const rp = this.reportParams
    return rp.group_by > 0 && rp.time_range.length > 0
  }

  private async loadPayGateways() {
    this.gatewaysLoading = true
    try {
      const { data } = await getPayGateways() as any
      data.unshift({
        title: this.$tc('notSelected'),
        id: 0
      })
      this.payGateways = data
    } finally {
      this.gatewaysLoading = false
    }
  }

  private async downloadCsv() {
    this.loading = true
    try {
      const { data } = await getPayReport(this.getReportParams(), 'text/csv')
      save2file(data, 'text/csv', `fin_report_${this.reportParams.time_range[0]}.csv`)
    } finally {
      this.loading = false
    }
  }

  private otherValues(row: IPayReport) {
    const { summ, pay_count, ...o } = row
    return Object.entries(o).map(([k, val]) => val).join(', ')
  }
}
</script>
