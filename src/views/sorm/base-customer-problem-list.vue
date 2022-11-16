<template lang="pug">
  datatable(
    :columns="tableColumns"
    :getData="getAllCustomers"
    :heightDiff="160"
    widthStorageNamePrefix="custWithoutContracts"
  )
    template(#username="{row}")
      slot(name="username" :row="row")
        el-link(type='primary')
          router-link(:to="{name: 'customerDetails', params:{uid: row.id }}")
            | {{ row.username }}
</template>

<script lang="ts">
import { ICustomer } from '@/api/customers/types'
import { IDRFAxiosResponsePromise, IDRFListResponse, IDRFRequestListParameters } from '@/api/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

class DataTableComp extends DataTable<ICustomer> {}

@Component({
  name: 'BaseCustomerProblemList',
  components: {
    datatable: DataTableComp
  }
})
export default class extends Vue {
  @Prop({ required: true })
  private fetchFunc!: (params: IDRFRequestListParameters) => IDRFAxiosResponsePromise<IDRFListResponse<ICustomer>>

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'username',
      label: this.$tc('customers.username'),
      sortable: true,
      'min-width': 100
    },
    {
      prop: 'fio',
      label: this.$tc('customers.fio'),
      'min-width': 300,
      sortable: true
    },
    {
      prop: 'address_title',
      label: this.$tc('addrs.full'),
      sortable: false,
      'min-width': 110,
      cutLeft: true
    },
    {
      prop: 'telephone',
      label: this.$tc('customers.phone'),
      'min-width': 140
    },
    {
      prop: 'balance',
      label: this.$tc('customers.balance'),
      sortable: true,
      'min-width': 100
    },
    {
      prop: 'group_title',
      label: this.$tc('groups.group')
    }
  ]

  private getAllCustomers(params: IDRFRequestListParameters) {
    const newParams = Object.assign(params, {
      fields: 'id,username,fio,address_title,telephone,balance,group_title,create_date,full_name'
    })
    return this.fetchFunc(newParams)
  }
}
</script>
