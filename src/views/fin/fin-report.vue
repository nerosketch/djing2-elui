<template lang="pug">
  .app-container
    el-date-picker(
      v-model="reportParams.from_date"
      type='date'
      placeholder="Дата отсчёта"
      value-format="yyyy-MM-dd"
    )
    el-select(
      v-model="reportParams.pay_gw"
      placeholder="Платёжный шлюз"
      v-loading="gatewaysLoading"
      :style="{width: '10%'}"
    )
      el-option(
        v-for="gw in payGateways"
        :key="gw.id"
        :label="gw.title"
        :value="gw.id"
      )

    el-radio(
      v-model="reportParams.group_by"
      :label="1"
    ) Группировать по дню
    el-radio(
      v-model="reportParams.group_by"
      :label="2"
    ) Группировать по неделе
    el-radio(
      v-model="reportParams.group_by"
      :label="3"
    ) Группировать по месяцу

    el-button(
      @click='downloadCsv'
    ) Скачать csv

    el-table(
      v-loading="loading"
      :data="tableData"
      border fit
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
import save2file from '@/utils/save2file'

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
    group_by: 3,
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
    return rp.group_by > 0 && Boolean(rp.from_date)
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

  private downloadCsv() {
    const dat = this.tableData.map(td => ([td.pay_date, td.summ, td.pay_count]))
    dat.unshift(['Дата', 'Сумма', 'Колич. платежей'])
    const sdat = dat.join('\n')
    save2file(sdat, 'text/csv', `fin_report_${this.reportParams.from_date}.csv`)
  }
}
</script>
