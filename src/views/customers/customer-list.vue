<template lang="pug">
  .app-container
    el-row(:gutter="10")
      el-col(:col="24")
        slot(name="filters")
          list-filters(
            :addrId="addrId"
            :group.sync="filterForm.group"
            :street.sync="filterForm.street"
            :house.sync="filterForm.house"
            :displayActive.sync="displayOnlyActive"
            :fetchGroups="fetchGroups")

      el-col(:lg="24" :md="20")
        datatable(
          :columns="tableColumns"
          :getData="getAllCustomers"
          :tableRowClassName="rowColor"
          :heightDiff="heightDiff"
          :editFieldsVisible.sync="editFieldsVisible"
          widthStorageNamePrefix="customers"
          ref="tbl"
          :selectable="$perms.is_superuser"
          @selection-change="handleSelectionChange")
          template(v-if="$perms.is_superuser" #id="{row}")
            slot(name="id" :row="row")
              el-button(
                v-if="$perms.is_superuser"
                icon="el-icon-lock"
                @click="openPermsDialog(row)")

          template(#username="{row}")
            slot(name="username" :row="row")
              router-link(:to="{name: 'customerDetails', params:{uid: row.id }}")
                | {{ row.username }}

          template(#telephone="{row}")
            slot(name="telephone" :row="row")
              el-link(type="primary" :href="`tel:${row.telephone}`")
                | {{ row.telephone }}

          template(#marker_icons="{row}")
            slot(name="marker_icons" :row="row")
              template(v-if="row.marker_icons.length > 0")
                span.m-icon(
                  v-for="(ic, i) in row.marker_icons"
                  :class="`m-${ic}`"
                  :key="i")

              span(v-else)

          template(#ping="{row}")
            slot(name="ping" :row="row")
              ping-profile(:customer="row")

          slot(name="buttons")
            el-button-group
              el-button(
                icon="el-icon-plus"
                type="success"
                @click="addCustomerDialog=true"
                :disabled="!$perms.customers.add_customer")
                | {{ $t('customers.customerAdd') }}

              el-button(
                icon="el-icon-set-up"
                @click="sitesDlg=true"
                v-if="isSomeoneSelected")
                | {{ $t('customers.sites') }}

              el-button(icon="el-icon-s-operation" @click="editFieldsVisible=true")
                | {{ $t('field') }}

              slot(name="additional_button")

    slot

    slot(name="dialogs")
      slot(name="dialog_customer_add")
        el-dialog(
          :title="$t('customers.customerAdd')"
          :visible.sync="addCustomerDialog"
          top="5vh"
          :close-on-click-modal="false")
          new-customer-form(:selectedAddress="addrId" v-on:done="addFrmDone")

      slot(name="dialog_rights")
        el-dialog(
          :title="$t('customers.whoHaveRightsOnCustomer')"
          :visible.sync="permsDialog"
          top="5vh"
          :close-on-click-modal="false")
          object-perms(
            v-on:save="changeCustomerObjectPerms"
            :getGroupObjectPermsFunc="getCustomerObjectPermsFunc4Grp"
            :getSelectedObjectPerms="customerGetSelectedObjectPerms"
            :objId="$store.state.customer.id")

      slot(name="dialog_sites")
        el-dialog(
          v-if="$perms.is_superuser"
          :title="$t('customers.customerSitesAccessory')"
          :visible.sync="sitesDlg"
          :close-on-click-modal="false")
          sites-attach(v-on:save="selectedCustomerSitesSave")

          el-dialog(
            width="40%"
            :visible.sync="sitesDlgProgress"
            append-to-body
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false")
            el-progress.progress_disable_animations(:percentage="sitesProgress")
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import {
  IDRFAxiosResponsePromise,
  IDRFListResponse,
  IDRFRequestListParameters,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsResultStruct
} from '@/api/types'
import {
  ICustomer, IDRFRequestListIsActiveFilterParameters
} from '@/api/customers/types'
import {
  getCustomers,
  setCustomerObjectsPerms,
  getCustomerObjectsPerms,
  getCustomerSelectedObjectPerms,
  getGroupsWithCustomers
} from '@/api/customers/req'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import NewCustomerForm from './new-customer-form.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import PingProfile from './ping-profile.vue'
import { CustomerModule } from '@/store/modules/customers/customer'
import { AddressModule } from '@/store/modules/addresses/address'
import ListFilters from '@/components/Address/list-filters.vue'
import TableWithAddrMixin from '@/components/Address/table-w-addr-mixin'

class DataTableComp extends DataTable<ICustomer> {}

interface ITableRowClassName {
  row: ICustomer
  rowIndex: number
}

const ONLY_ACTIVE_STOR_KEY = 'displayOnlyActive'

function getOnlyActive() {
  const d = localStorage.getItem(ONLY_ACTIVE_STOR_KEY)
  if (d === null) {
    return null
  } else {
    return d === '1'
  }
}
function setOnlyActive(v: boolean | null) {
  if (v === null) {
    localStorage.removeItem(ONLY_ACTIVE_STOR_KEY)
  } else {
    localStorage.setItem(ONLY_ACTIVE_STOR_KEY, v ? '1' : '0')
  }
}

@Component({
  name: 'CustomerList',
  components: {
    datatable: DataTableComp,
    NewCustomerForm,
    PingProfile,
    ListFilters
  }
})
export default class extends mixins(TableWithAddrMixin) {
  @Prop({ default: null }) private addrId!: number | null
  @Prop({ default: null }) private fetchFunc!: (params?: IDRFRequestListParameters) => IDRFAxiosResponsePromise<IDRFListResponse<ICustomer>> | null
  @Prop({ default: 165 }) private heightDiff!: number

  private addCustomerDialog = false
  private permsDialog = false
  private selectedCustomers: number[] = []
  private sitesDlg = false
  private sitesDlgProgress = false
  private sitesProgress = 0
  private editFieldsVisible = false
  private displayOnlyActive: boolean | null = getOnlyActive()

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'id',
      label: 'ID',
      'min-width': 67
    },
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
      prop: 'current_service__service__title',
      label: this.$tc('customers.service'),
      backendProp: 'current_service_title',
      sortable: true,
      'min-width': 240
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
    },
    {
      prop: 'marker_icons',
      label: this.$tc('customers.marker')
    },
    {
      prop: 'ping',
      label: this.$tc('ping'),
      'min-width': 150
    }
  ]

  @Watch('displayOnlyActive')
  private onChangeDisplayActive(v: boolean | null) {
    setOnlyActive(v)
    this.$refs.tbl.LoadTableData()
  }

  private async getAllCustomers(params?: IDRFRequestListParameters) {
    const group = this.$route.query.group
    let r
    const fetchFn = (this.fetchFunc === null ? getCustomers : this.fetchFunc)
    if (params) {
      let newParams: IDRFRequestListIsActiveFilterParameters = Object.assign(params, {
        address: this.addrId,
        is_active: this.displayOnlyActive,
        fields: 'id,username,fio,address_title,telephone,current_service_title,current_service,balance,group_title,is_active,lease_count,marker_icons'
      })
      if (group) {
        newParams.group = Number(group)
      }
      if (this.$route.query) {
        newParams = Object.assign(newParams, this.$route.query)
      }
      r = await fetchFn(newParams)
    } else {
      r = await fetchFn()
    }
    return r
  }

  private addFrmDone(newCustomer: ICustomer) {
    this.addCustomerDialog = false
    this.$message.success(
      this.$tc('customers.customerAddedOk')
    )
    this.$router.push({ name: 'customerDetails', params: { uid: newCustomer.id.toString() } })
  }

  created() {
    document.title = this.$tc('customers.customersList')
    this.setCrumbs()
  }

  // Breadcrumbs
  private async setCrumbs() {
    if (this.addrId && this.$store.state.address.id !== this.addrId) {
      await AddressModule.GetAddress(this.addrId)
    }
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/customers/',
        meta: {
          hidden: true,
          title: this.$tc('addrs.addresses')
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: this.$store.state.address.title
        }
      }
    ] as any)
  }
  // End Breadcrumbs

  private rowColor({ row }: ITableRowClassName) {
    return row.is_active ? '' : 'error-row'
  }

  private async changeCustomerObjectPerms(info: IObjectGroupPermsResultStruct) {
    await setCustomerObjectsPerms(this.$store.state.customer.id, info)
    this.permsDialog = false
  }

  private getCustomerObjectPermsFunc4Grp(): IObjectGroupPermsInitialAxiosResponsePromise {
    return getCustomerObjectsPerms(this.$store.state.customer.id)
  }

  private openPermsDialog(c: ICustomer) {
    CustomerModule.SET_ALL_CUSTOMER(c)
    this.permsDialog = true
  }

  private customerGetSelectedObjectPerms(customerId: number, profileGroupId: number) {
    return getCustomerSelectedObjectPerms(customerId, profileGroupId)
  }

  private handleSelectionChange(customers: ICustomer[]) {
    this.selectedCustomers = customers.map(c => c.id)
  }

  get isSomeoneSelected() {
    return this.selectedCustomers.length > 0
  }

  private async selectedCustomerSitesSave(selectedSiteIds: number[]) {
    this.sitesProgress = 0
    this.sitesDlgProgress = true

    const ln = this.selectedCustomers.length
    for (let i = 0; i < ln; i++) {
      const customerId = this.selectedCustomers[i]
      await CustomerModule.SET_ID_CUSTOMER(customerId)
      await CustomerModule.PatchCustomer({
        sites: selectedSiteIds
      })
      this.sitesProgress = Math.ceil(i * 100 / ln)
    }
    this.$message.success('Ok')
    this.sitesDlgProgress = false
  }

  private fetchGroups(params: IDRFRequestListParameters) {
    return getGroupsWithCustomers(Object.assign(params, {}))
  }
}
</script>
