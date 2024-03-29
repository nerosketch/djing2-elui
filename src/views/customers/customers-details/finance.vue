<template lang="pug">
  div
    datatable(
      :columns="tableColumns"
      :getData="loadLog"
      :heightDiff="209"
      widthStorageNamePrefix="customerFin"
      ref="fintbl")
      template(#author_name="{row}")
        | {{ row.author_name || $t('customers.defaultAuthorName') }}

      el-button(@click="addCashDialog=true")
        | {{ $t('customers.addCash2Account') }}

    el-dialog(
      :title="$t('customers.addCash2Account')"
      :visible.sync="addCashDialog"
      :close-on-click-modal="false")
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
  components: { AddCash, datatable: DataTableComp }
})
export default class extends Vue {
  public readonly $refs!: {
    fintbl: DataTableComp
  }

  private addCashDialog = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'from_balance',
      label: this.$tc('customers.was'),
      'min-width': 80
    },
    {
      prop: 'cost',
      label: this.$tc('customers.amount'),
      'min-width': 80
    },
    {
      prop: 'to_balance',
      label: this.$tc('customers.become'),
      'min-width': 80
    },
    {
      prop: 'date',
      label: this.$tc('customers.payDate'),
      'min-width': 160
    },
    {
      prop: 'author_name',
      label: this.$tc('customers.payWho'),
      'min-width': 180
    },
    {
      prop: 'comment',
      label: this.$tc('comment'),
      'min-width': 300
    }
  ]

  private async loadLog(params?: IDRFRequestListParameters) {
    let r
    if (params) {
      const newParams = Object.assign({
        customer: CustomerModule.id,
        fields: 'cost,date,author_name,from_balance,to_balance,comment'
      }, params)
      r = await getCustomerPayLog(newParams)
    } else {
      r = await getCustomerPayLog()
    }
    return r
  }

  private addCashDone(cost: number) {
    this.addCashDialog = false
    this.$refs.fintbl.LoadTableData()
    this.$message.success(`${this.$tc('customers.accountHasAmounted')} ${cost}`)
  }
}
</script>
