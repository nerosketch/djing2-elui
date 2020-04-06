<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadPeriodics"
    :loading="loading"
    ref='table'
  )
    span(slot="pk" slot-scope="{row}") {{ row.pk }}
    span(slot="name" slot-scope="{row}") {{ row.name }}
    span(slot="when_add" slot-scope="{row}") {{ row.when_add }}
    span(slot="amount" slot-scope="{row}") {{ row.amount }}
    el-button-group(slot="oper" slot-scope="{row}")
      el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
      el-button(type="danger" icon="el-icon-delete" size="mini" @click="delPerPay(row)")

  el-dialog(
    title="Изменение Квитанции"
    :visible.sync="dialogVisible"
    width="30%"
  )
    periodicpay-form(
      v-on:done="frmDone"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { IPeriodicPay } from '@/api/services/types'
import { getPeriodicPays } from '@/api/services/req'
import { PeriodicPayModule } from '@/store/modules/services/periodic-pay'
import PeriodicpayForm from './periodicpay-form.vue'

class DataTableComp extends DataTable<IPeriodicPay> {}

@Component({
  name: 'PeriodicPayList',
  components: { 'datatable': DataTableComp, PeriodicpayForm }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      width: 70
    },
    {
      prop: 'name',
      label: 'Название платежа'
    },
    {
      prop: 'when_add',
      label: 'Дата создания'
    },
    {
      prop: 'amount',
      label: 'стоимость',
      width: 150,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: 'Oper',
      width: 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private pays: IPeriodicPay[] = []
  private dialogVisible = false
  private loading = false

  created() {
    this.loadPeriodics()
  }

  private async openEdit(pay: IPeriodicPay) {
    await PeriodicPayModule.SET_ALL(pay)
    this.dialogVisible = true
  }

  private async delPerPay(pay: IPeriodicPay) {
    if (confirm(`Ты действительно хочешь удалить квитанцию "${pay.name}"?`)) {
      await PeriodicPayModule.DelPeriodicPay(pay.pk)
      this.$refs['table'].GetTableData()
    }
  }

  private async loadPeriodics(params?: IDRFRequestListParameters) {
    this.loading = true
    const r = await getPeriodicPays(params)
    this.loading = false
    return r
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs['table'].GetTableData()
    this.loadPeriodics()
  }
}
</script>
