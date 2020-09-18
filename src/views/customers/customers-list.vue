<template lang="pug">
  .app-container
    el-row(:gutter="10")
      el-col(:lg='20' :md='18')
        datatable(
          :columns="tableColumns"
          :getData="getAllCustomers"
          :loading="customersLoading"
          :tableRowClassName="rowColor"
          :heightDiff="100"
          widthStorageNamePrefix='customers'
          ref='tbl'
        )
          template(v-slot:pk="{row}")
            el-button(size='mini' icon='el-icon-lock' @click="openPermsDialog(row)" v-if="$perms.is_superuser")
            span(v-else) {{ row.pk }}

          template(v-slot:username="{row}")
            el-link(type="primary")
              router-link(:to="{name: 'customerDetails', params:{uid: row.pk }}") {{ row.username }}

          template(v-slot:telephone="{row}")
            el-link(type="primary" :href="`tel:${row.telephone}`") {{ row.telephone }}

          template(v-slot:current_service__service__title="{row}") {{ row.service_title }}

          template(v-slot:ping="{row}")
            ping-profile(:customer="row")

          el-button(
            size='mini'
            icon='el-icon-plus'
            type='success'
            @click="addCustomerDialog=true"
            :disabled="!$perms.customers.add_customer"
          ) Добавить абонента

      el-col(:lg='4' :md='6')
        list(
          title="Улицы"
          :items="streets"
          :loading='streetsLoading'
          itemText="name"
          v-on:itemClick="onStreetClick"
          :isClickable='true'
          :initialSelectedNum="routerQueryStreetIndexGetter"
        )
          template(v-slot:footer)
            el-button-group
              el-button(
                type='success' icon='el-icon-plus' size='mini'
                @click="addStreetDialog=true"
                :disabled="!$perms.customers.add_customerstreet"
              ) Доб.
              el-button(
                type='primary' icon='el-icon-edit' size='mini'
                @click="editStreetsDialog=true"
                :disabled="!$perms.customers.change_customerstreet"
              ) Изм.

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
    el-dialog(
      title="Кто имеет права на абонента"
      :visible.sync="permsDialog"
      top="5vh"
    )
      object-perms(
        v-on:save="changeGroupObjectPerms"
        :getGroupObjectPermsFunc="getGroupObjectPermsFunc4Grp"
        :getSelectedObjectPerms="customerGetSelectedObjectPerms"
        :objId="customerIdGetter"
      )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { scrollTo } from '@/utils/scroll-to'
import {
  IDRFRequestListParameters,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsResultStruct
} from '@/api/types'
import {
  ICustomer,
  IDRFRequestListParametersCustomer,
  ICustomerStreet
} from '@/api/customers/types'
import {
  getCustomers,
  getStreets,
  setCustomerObjectsPerms,
  getCustomerObjectsPerms,
  getCustomerSelectedObjectPerms
} from '@/api/customers/req'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import NewCustomerForm from './new-customer-form.vue'
import List from '@/components/List/index.vue'
import NewStreetForm from './street/new-street-form.vue'
import EditStreets from './street/edit-streets.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'
import { GroupModule } from '@/store/modules/groups'
import PingProfile from './ping-profile.vue'
import { CustomerModule } from '@/store/modules/customers/customer'

class DataTableComp extends DataTable<ICustomer> {}

interface ITableRowClassName {
  row: ICustomer
  rowIndex: number
}

@Component({
  name: 'CustomersList',
  components: {
    'datatable': DataTableComp,
    NewCustomerForm,
    List,
    NewStreetForm,
    EditStreets,
    PingProfile
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private groupId!: number
  private addCustomerDialog = false
  private addStreetDialog = false
  private editStreetsDialog = false
  private permsDialog = false
  public readonly $refs!: {
    tbl: DataTableComp
  }



  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      'min-width': 67
    },
    {
      prop: 'username',
      label: 'Логин',
      sortable: true,
      'min-width': 100
    },
    {
      prop: 'fio',
      label: 'ФИО',
      'min-width': 300,
      sortable: true
    },
    {
      prop: 'street_name',
      label: 'Улица',
      'min-width': 110
    },
    {
      prop: 'house',
      label: 'Квартира',
      sortable: true,
      'min-width': 110
    },
    {
      prop: 'telephone',
      label: 'Телефон',
      'min-width': 140
    },
    {
      prop: 'current_service__service__title',
      label: 'Услуга',
      'min-width': 240,
      sortable: true
    },
    {
      prop: 'balance',
      label: 'Баланс',
      sortable: true,
      'min-width': 100
    },
    {
      prop: 'gateway_title',
      label: 'Шлюз',
      'min-width': 170
    },
    {
      prop: 'ping',
      label: 'Ping',
      'min-width': 150
    }
  ]

  private streets: ICustomerStreet[] = []

  private customersLoading = true
  private streetsLoading = false

  private async loadStreets() {
    this.streetsLoading = true
    try {
      const { data } = await getStreets({
        page: 1,
        page_size: 0,
        group: this.groupId
      }) as any
      this.streets = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.streetsLoading = false
    }
  }

  private async getAllCustomers(params?: IDRFRequestListParameters) {
    this.customersLoading = true
    let street = this.routerQueryStreetGetter
    let r
    try {
      if (params) {
        let newParams: IDRFRequestListParametersCustomer = Object.assign(params, {
          group: this.groupId,
          fields: 'pk,username,fio,street_name,house,telephone,service_title,balance,gateway_title,is_active,lease_count'
        })
        if (street) {
          newParams.street = Number(street)
        }
        r = await getCustomers(newParams)
      } else {
        r = await getCustomers()
      }
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.customersLoading = false
    }
    return r
  }

  private addFrmDone(newCustomer: ICustomer) {
    this.addCustomerDialog = false
    this.$message.success('Абонент добавлен')
    this.$router.push({ name: 'customerDetails', params: { uid: newCustomer.pk.toString() } })
  }

  private onStreetClick(item: ICustomerStreet, num: number) {
    let qr = Object.assign({}, this.$route.query) as Record<string, any>
    const qstreet = qr.street
    delete qr.street

    if (item.pk != qstreet) {
      qr.street = item.pk
    }
    this.$router.push({ path: this.$route.path, query: qr})
    scrollTo(0, 600)
  }

  get routerQueryStreetGetter(): string | undefined {
    return this.$route.query.street as string | undefined
  }
  @Watch('routerQueryStreetGetter')
  private onChRt() {
    this.$refs.tbl.GetTableData()
  }

  get routerQueryStreetIndexGetter(): number | undefined {
    let strId = this.routerQueryStreetGetter as any
    return this.streets.findIndex(str => str.pk == strId)
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
    this.onGrpCh(this.groupId)
  }

  // Breadcrumbs
  // @Watch('groupId')
  private async onGrpCh(grpId: number) {
    await GroupModule.GetGroup(grpId)
    await BreadcrumbsModule.SetCrumbs([
      {
        path: '/customers/',
        meta: {
          hidden: true,
          title: 'Группы абонентов'
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: this.grpName
        }
      }
    ] as RouteRecord[])
  }
  get grpName() {
    return GroupModule.title
  }
  // End Breadcrumbs

  private rowColor(r: ITableRowClassName) {
    return r.row.is_active ? '' : 'error-row'
  }

  get customerIdGetter() {
    return CustomerModule.pk
  }

  private async changeGroupObjectPerms(info: IObjectGroupPermsResultStruct) {
    await setCustomerObjectsPerms(this.customerIdGetter, info)
    this.permsDialog = false
  }
  private getGroupObjectPermsFunc4Grp(): IObjectGroupPermsInitialAxiosResponsePromise {
    return getCustomerObjectsPerms(this.customerIdGetter)
  }
  private openPermsDialog(c: ICustomer) {
    CustomerModule.SET_ALL_CUSTOMER(c)
    this.permsDialog = true
  }

  private customerGetSelectedObjectPerms(customerId: number, profileGroupId: number) {
    return getCustomerSelectedObjectPerms(customerId, profileGroupId)
  }
}
</script>
