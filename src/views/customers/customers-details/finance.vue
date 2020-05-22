<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadLog"
    :loading="loading"
    :heightDiff='269'
    ref='fintbl'
  )
    template(v-slot:cost="{row}") {{ row.cost }}

    template(v-slot:date="{row}") {{ row.date }}

    template(v-slot:author_name="{row}") {{ row.author_name || 'Система' }}

    template(v-slot:comment="{row}") {{ row.comment }}

    el-button(@click="addCashDialog=true") Пополнить счёт

  el-dialog(
    title="Пополнить счёт"
    :visible.sync="addCashDialog"
  )
    add-cash(v-on:done="addCashDone")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { ICustomerLog } from '@/api/customers/types'
import { getCustomerPayLog } from '@/api/customers/req'
import { CustomerModule } from '@/store/modules/customers/customer'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import AddCash from './add-cash.vue'

class DataTableComp extends DataTable<ICustomerLog> {}

@Component({
  name: 'Finance',
  components: { AddCash, 'datatable': DataTableComp }
})
export default class extends Vue {
  public readonly $refs!: {
    fintbl: DataTableComp
  }
  private loading = false
  private addCashDialog = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'cost',
      label: 'Сумма',
      width: 80
    },
    {
      prop: 'date',
      label: 'Дата оплаты',
      width: 160
    },
    {
      prop: 'author_name',
      label: 'Назначил',
      width: 180
    },
    {
      prop: 'comment',
      label: 'Комментарий'
    }
  ]

  private async loadLog(params?: IDRFRequestListParameters) {
    let r
    this.loading = true
    if (params) {
      const newParams = Object.assign({
        customer: CustomerModule.pk,
        fields: 'cost,date,author_name,comment'
      }, params)
      r = await getCustomerPayLog(newParams)
    } else {
      r = await getCustomerPayLog()
    }
    this.loading = false
    return r
  }

  private addCashDone(cost: number) {
    this.addCashDialog = false
    this.$refs['fintbl'].GetTableData()
    this.$message.success(`Счёт пополнен на ${cost}`)
  }
}
</script>
