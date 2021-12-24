<template>  
  <div class="app-container">
    <el-date-picker v-model="reportParams.time_range" type="daterange" start-placeholder="Дата начала" end-placeholder="Конечная дата" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
    <el-select v-model="reportParams.pay_gw" placeholder="Платёжный шлюз" v-loading="gatewaysLoading" :style="{width: '10%'}">
      <el-option v-for="gw in payGateways" :key="gw.id" :label="gw.title" :value="gw.id"></el-option>
    </el-select>
    <el-radio v-model="reportParams.group_by" :label="1">Группировать по дню</el-radio>
    <el-radio v-model="reportParams.group_by" :label="2">Группировать по неделе</el-radio>
    <el-radio v-model="reportParams.group_by" :label="3">Группировать по месяцу</el-radio>
    <el-button @click="downloadCsv">Скачать csv</el-button>
    <el-table v-loading="loading" :data="tableData" border fit>
      <el-table-column label="Дата" min-width="110" prop="pay_date"></el-table-column>
      <el-table-column label="Сумма" min-width="110" prop="summ"></el-table-column>
      <el-table-column label="Колич. платежей" min-width="110" prop="pay_count"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { IPayAllTimeGateway, IPayReport } from '@/api/fin/types'
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

  private tableData: IPayReport[] = []

  private payGateways: IPayAllTimeGateway[] = []

  private async loadReport() {
    this.loading = true
    try {
      const rp = this.reportParams
      const { data } = await getPayReport({
        from_time: rp.time_range[0],
        to_time: rp.time_range[1],
        pay_gw: rp.pay_gw,
        group_by: rp.group_by
      })
      this.tableData = data
    } finally {
      this.loading = false
    }
  }

  private reportParams = {
    time_range: ['2021-05-22', formatDate(new Date())],
    pay_gw: 0,
    group_by: 3
  }

  @Watch('reportParams', { deep: true })
  private onChangeParams() {
    if (this.isAllowRequest) {
      this.loadReport()
    }
  }

  private pickerOptions = {
    shortcuts: [{
      text: 'Последняя неделя',
      onClick(picker: Vue) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: 'Последний месяц',
      onClick(picker: Vue) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: 'Последние 3 месяца',
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
    save2file(sdat, 'text/csv', `fin_report_${this.reportParams.time_range[0]}.csv`)
  }
}
</script>
