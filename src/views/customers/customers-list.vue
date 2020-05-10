<template lang="pug">
  .app-container
    el-row(:gutter="10")
      el-col(:lg='20' :md='18')
        datatable(
          :columns="tableColumns"
          :getData="getAllCustomers"
          :loading="customersLoading"
          ref='tbl'
        )
          template(v-slot:pk="{row}")
            span {{ row.pk }}

          template(v-slot:username="{row}")
            el-link(type="primary")
              router-link(:to="{name: 'customerDetails', params:{uid: row.pk }}") {{ row.username }}

          template(v-slot:fio="{row}")
            span {{ row.fio }}

          template(v-slot:street_name="{row}")
            span {{ row.street_name }}

          template(v-slot:house="{row}")
            span {{ row.house }}

          template(v-slot:telephone="{row}")
            el-link(type="primary" :href="`tel:${row.telephone}`") {{ row.telephone }}

          template(v-slot:service_title="{row}")
            span {{ row.service_title }}

          template(v-slot:balance="{row}")
            span {{ row.balance }}

          template(v-slot:gateway_title="{row}")
            span {{ row.gateway_title }}

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
          new-customer-form(
            :selectedGroup='groupId'
            :customerStreets='streets'
            v-on:done="addFrmDone"
          )
      el-col(:lg='4' :md='6')
        list(
          title="Улицы"
          :items="streets"
          :loading='streetsLoading'
          itemText="name"
          v-on:itemClick="onStreetClick"
        )
          template(v-slot:footer)
            el-button-group
              el-button(type='success' icon='el-icon-plus' size='mini' @click="addStreetDialog=true") Доб.
              el-button(type='primary' icon='el-icon-edit' size='mini' @click="editStreetsDialog=true") Изм.

    el-dialog(
      :visible.sync="addStreetDialog"
      title="Добавить улицу"
    )
      new-street-form(
        v-on:done="addStreetDone"
        :groupId="groupId"
      )
    el-dialog(
      :visible.sync="editStreetsDialog"
      title="Редактировать улицы"
    )
      edit-streets(
        :groupId="groupId"
        :extStreets="streets"
        v-on:done="editStreetDone"
      )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { ICustomer, IDRFRequestListParametersCustomer, ICustomerStreet } from '@/api/customers/types'
import { getCustomers, getStreets } from '@/api/customers/req'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import NewCustomerForm from './new-customer-form.vue'
import List from '@/components/List/index.vue'
import NewStreetForm from './street/new-street-form.vue'
import EditStreets from './street/edit-streets.vue'

class DataTableComp extends DataTable<ICustomer> {}

@Component({
  name: 'CustomersList',
  components: { 'datatable': DataTableComp, NewCustomerForm, List, NewStreetForm, EditStreets }
})
export default class extends Vue {
  @Prop({ default: 0 }) private groupId!: number
  private addCustomerDialog = false
  private addStreetDialog = false
  private editStreetsDialog = false
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
    }
  ]

  private streets: ICustomerStreet[] = []

  private customersLoading = true
  private streetsLoading = false

  private async loadStreets() {
    this.streetsLoading = true
    const { data } = await getStreets({
      page: 1,
      page_size: 9000,
      group: this.groupId
    })
    this.streets = data.results
    this.streetsLoading = false
  }

  private async getAllCustomers(params?: IDRFRequestListParameters) {
    this.customersLoading = true
    const fields = 'pk,username,fio,street_name,house,telephone,service_title,balance,gateway_title'
    let r
    if (params) {
      const newParams: IDRFRequestListParametersCustomer = Object.assign(params, {
        group: this.groupId,
        fields
      })
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
    this.$refs.tbl.GetTableData()
  }

  private lastStreetId?: number = 0

  private onStreetClick(item: ICustomerStreet, num: number) {
    if (item.pk === this.lastStreetId) {
      this.lastStreetId = undefined
    } else {
      this.lastStreetId = item.pk
    }
    this.$refs.tbl.GetTableData(undefined, {
      street: this.lastStreetId
    })
  }

  private addStreetDone(newStreet: ICustomerStreet) {
    this.$message.success(`Улица ${newStreet.name} добавлена.`)
    this.addStreetDialog = false
    this.loadStreets()
  }

  private editStreetDone() {
    this.editStreetsDialog = false
    this.loadStreets()
  }

  created() {
    this.loadStreets()
  }
}
</script>
