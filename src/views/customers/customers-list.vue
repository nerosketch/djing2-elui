<template lang="pug">
  .app-container
    el-row(:gutter="10")
      el-col(:lg='20' :md='18')
        datatable(
          :columns="tableColumns"
          :getData="getAllCustomers"
          :loading="customersLoading"
          :heightDiff="100"
          ref='tbl'
        )
          template(v-slot:pk="{row}") {{ row.pk }}

          template(v-slot:username="{row}")
            el-link(type="primary")
              router-link(:to="{name: 'customerDetails', params:{uid: row.pk }}") {{ row.username }}

          template(v-slot:fio="{row}") {{ row.fio }}

          template(v-slot:street_name="{row}") {{ row.street_name }}

          template(v-slot:house="{row}") {{ row.house }}

          template(v-slot:telephone="{row}")
            el-link(type="primary" :href="`tel:${row.telephone}`") {{ row.telephone }}

          template(v-slot:current_service__service__title="{row}") {{ row.service_title }}

          template(v-slot:balance="{row}") {{ row.balance }}

          template(v-slot:gateway_title="{row}") {{ row.gateway_title }}

          el-button(
            size='mini'
            icom='el-icon-plus'
            @click="addCustomerDialog=true"
          ) Добавить абонента

      el-col(:lg='4' :md='6')
        list(
          title="Улицы"
          :items="streets"
          :loading='streetsLoading'
          itemText="name"
          v-on:itemClick="onStreetClick"
          :isClickable='true'
        )
          template(v-slot:footer)
            el-button-group
              el-button(type='success' icon='el-icon-plus' size='mini' @click="addStreetDialog=true") Доб.
              el-button(type='primary' icon='el-icon-edit' size='mini' @click="editStreetsDialog=true") Изм.

    el-dialog(
      title='Добавить абонента'
      :visible.sync='addCustomerDialog'
      top="5vh"
    )
      new-customer-form(
        :selectedGroup='groupId'
        :customerStreets='streets'
        v-on:done="addFrmDone"
      )
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
      label: 'Логин',
      sortable: true,
      width: 100
    },
    {
      prop: 'fio',
      label: 'ФИО',
      width: 300,
      sortable: true
    },
    {
      prop: 'street_name',
      label: 'Улица',
      width: 110
    },
    {
      prop: 'house',
      label: 'Квартира',
      sortable: true,
      width: 110
    },
    {
      prop: 'telephone',
      label: 'Телефон',
      width: 140
    },
    {
      prop: 'current_service__service__title',
      label: 'Услуга',
      width: 240,
      sortable: true
    },
    {
      prop: 'balance',
      label: 'Баланс',
      sortable: true,
      width: 100
    },
    {
      prop: 'gateway_title',
      label: 'Шлюз',
      width: 170
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
        street: this.lastStreetId,
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
    this.$router.push({ name: 'customerDetails', params: { uid: newCustomer.pk.toString() } })
  }

  private lastStreetId?: number | undefined = undefined

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
