<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadPeriodics"
    :heightDiff='165'
    widthStorageNamePrefix='perpay'
    ref='table'
  )
    template(v-slot:oper="{row}")
      el-button-group
        el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
        el-button(
          type="danger" icon="el-icon-delete" size="mini"
          @click="delPerPay(row)"
          :disabled="!$perms.services.delete_periodicpay"
        )

    el-button(
      icon='el-icon-plus'
      size='mini'
      type='success'
      @click="openNew"
      :disabled="!$perms.services.add_periodicpay"
    ) Добавить

  el-dialog(
    :title="(isNew ? 'Создание' : 'Изменение') + ' периодического платежа'"
    :visible.sync="dialogVisible"
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
      'min-width': 70
    },
    {
      prop: 'name',
      label: 'Название платежа',
      'min-width': 200
    },
    {
      prop: 'when_add',
      label: 'Дата создания',
      'min-width': 150
    },
    {
      prop: 'amount',
      label: 'стоимость',
      'min-width': 150,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: 'Oper',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private pays: IPeriodicPay[] = []
  private dialogVisible = false

  private async openEdit(pay: IPeriodicPay) {
    await PeriodicPayModule.SET_ALL_PPAY(pay)
    this.dialogVisible = true
  }

  private openNew() {
    PeriodicPayModule.RESET_ALL_PPAY()
    this.dialogVisible = true
  }

  private async delPerPay(pay: IPeriodicPay) {
    if (confirm(`Действительно удалить квитанцию "${pay.name}"?`)) {
      await PeriodicPayModule.DelPeriodicPay(pay.pk)
      this.$refs.table.GetTableData()
    }
  }

  get isNew() {
    return PeriodicPayModule.pk === 0
  }

  private loadPeriodics(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'pk,name,when_add,amount'
    }
    return getPeriodicPays(params)
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.GetTableData()
  }
}
</script>
