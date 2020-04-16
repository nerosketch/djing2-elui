<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getAllCustomers"
      :loading="customersLoading"
      ref='tbl'
    )
      span(slot="pk" slot-scope="{row}") {{ row.pk }}

      el-link(slot="username" slot-scope="{row}" type="primary")
        router-link(:to="{name: 'customerDetails', params:{uid: row.pk }}") {{ row.username }}

      span(slot="fio" slot-scope="{row}") {{ row.fio }}

      span(slot="street_name" slot-scope="{row}") {{ row.street_name }}

      span(slot="house" slot-scope="{row}") {{ row.house }}

      el-link(slot="telephone" slot-scope="{row}" type="primary" :href="`tel:${row.telephone}`") {{ row.telephone }}

      span(slot="service_title" slot-scope="{row}") {{ row.service_title }}

      span(slot="balance" slot-scope="{row}") {{ row.balance }}

      span(slot="gateway_title" slot-scope="{row}") {{ row.gateway_title }}

      el-button(
        slot="btn" slot-scope="{row}"
        type="primary" size="mini"
        icon='el-icon-check' circle
      )
    el-button(
      type='primary'
      size='small'
      icom='el-icon-plus'
      @click="addCustomerDialog=true"
    ) Добавить абонента

    el-dialog(
      title='Добавить абонента'
      :visible.sync='addCustomerDialog'
    )
      new-customer-form(:selectedGroup='groupId' v-on:done="addFrmDone")

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { ICustomer, IDRFRequestListParametersCustomer } from '@/api/customers/types'
import { getCustomers } from '@/api/customers/req'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import NewCustomerForm from './new-customer-form.vue'

class DataTableComp extends DataTable<ICustomer> {}

@Component({
  name: 'CustomersList',
  components: { 'datatable': DataTableComp, NewCustomerForm }
})
export default class extends Vue {
  @Prop({ default: 0 }) private groupId!: number
  private addCustomerDialog = false
  public readonly $refs!: {
    tbl: DataTableComp
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      width: 60
    },
    {
      prop: 'username',
      label: 'Логин'
    },
    {
      prop: 'fio',
      label: 'ФИО'
    },
    {
      prop: 'street_name',
      label: 'Улица'
    },
    {
      prop: 'house',
      label: 'Квартира'
    },
    {
      prop: 'telephone',
      label: 'Телефон'
    },
    {
      prop: 'service_title',
      label: 'Услуга'
    },
    {
      prop: 'balance',
      label: 'Баланс'
    },
    {
      prop: 'gateway_title',
      label: 'Шлюз'
    },
    {
      prop: 'btn',
      label: 'Ping',
      width: 90,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private customersLoading: boolean = true

  created() {
    this.getAllCustomers()
  }

  private async getAllCustomers(params?: IDRFRequestListParameters) {
    this.customersLoading = true
    let r
    if(params) {
      const newParams: IDRFRequestListParametersCustomer = Object.assign({ group: this.groupId }, params)
      r = await getCustomers(newParams)
    } else {
      r = await getCustomers()
    }
    this.customersLoading = false
    return r
  }

  private addFrmDone(newCustomer: ICustomer) {
    this.addCustomerDialog = false
    this.$message.success('Абонент добавлен')
    this.$refs['tbl'].GetTableData()
  }
}
</script>
