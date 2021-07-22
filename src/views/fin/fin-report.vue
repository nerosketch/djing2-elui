<template lang="pug">
  .app-container
    el-date-picker(
      v-model="reportParams.from_date"
      type='date'
      placeholder="Дата отсчёта"
      size='mini'
      value-format="yyyy-MM-dd"
    )
    el-select(
      v-model="reportParams.pay_gw"
      placeholder="Платёжный шлюз"
      v-loading="gatewaysLoading"
      size='mini'
      :style="{width: '10%'}"
    )
      el-option(
        v-for="gw in payGateways"
        :key="gw.id"
        :label="gw.title"
        :value="gw.id"
      )

    el-checkbox(
      v-model="reportParams.group_by_day"
    ) Группировать по дню

    el-checkbox(
      v-model="reportParams.group_by_week"
    ) Группировать по неделе

    el-checkbox(
      v-model="reportParams.group_by_mon"
    ) Группировать по месяцу

    el-table(
      v-loading="loading"
      :data="tableData"
      border fit size='small'
    )
      el-table-column(
        label="Дата"
        min-width='110'
        prop='pay_date'
      )
      el-table-column(
        label="Сумма"
        min-width='110'
        prop='summ'
      )
      el-table-column(
        label="Колич. платежей"
        min-width='110'
        prop='pay_count'
      )

</template>

<script lang="ts">
import { IPayAllTimeGateway, IPayReport, IPayReportParams } from '@/api/fin/types'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getPayGateways, getPayReport } from '@/api/fin/req'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

@Component({
  name: 'FinReport'
})
export default class extends Vue {
  private loading = false
  private gatewaysLoading = false

  private tableData: IPayReport[] = []

  private payGateways: IPayAllTimeGateway[] = []

  private async loadReport() {
    this.loading = true
    try {
    const { data } = await getPayReport(this.reportParams)
    this.tableData = data
    } finally {
      this.loading = false
    }
  }

  private reportParams: IPayReportParams = {
    from_date: '2021-05-22',
    pay_gw: 0,
    group_by_day: false,
    group_by_mon: true,
    group_by_week: false
  }

  @Watch('reportParams', { deep: true })
  private onChangeParams() {
    if (this.isAllowRequest) {
      this.loadReport()
    }
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
          title: 'Финансы'
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: 'Отчёт о поступлениях'
        }
      }
    ] as any[])
  }
  // End Breadcrumb

  private get isAllowRequest() {
    const rp = this.reportParams
    const y = [rp.group_by_day, rp.group_by_mon, rp.group_by_week].filter(g => g)
    return y.length === 1 && Boolean(rp.from_date)
  }

  private async loadPayGateways() {
    this.gatewaysLoading = true
    try {
      const { data } = await getPayGateways() as any
      data.unshift({
        title: 'Не выбран',
        id: 0
      })
      this.payGateways = data
    } finally {
      this.gatewaysLoading = false
    }
  }
}
</script>
