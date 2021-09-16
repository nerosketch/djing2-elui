<template lang="pug">
  .app-container
    el-row(:gutter="10")
      el-col(:col='24')
        customer-list-filters(
          :localityId="localityId"
          :street.sync="filterForm.street"
          :group.sync="filterForm.group"
        )
      el-col(:lg='24' :md='20')
        datatable(
          :columns="tableColumns"
          :getData="getAllCustomers"
          :tableRowClassName="rowColor"
          :heightDiff="165"
          :editFieldsVisible.sync="editFieldsVisible"
          widthStorageNamePrefix='customers'
          ref='tbl'
          :selectable="$perms.is_superuser"
          @selection-change="handleSelectionChange"
        )
          template(v-slot:id="{row}")
            el-button(
              v-if="$perms.is_superuser"
              icon='el-icon-lock'
              @click="openPermsDialog(row)"
            )
            span(v-else) {{ row.id }}

          template(v-slot:username="{row}")
            router-link(:to="{name: 'customerDetails', params:{uid: row.id }}")
              el-link(type="primary") {{ row.username }}

          template(v-slot:telephone="{row}")
            el-link(type="primary" :href="`tel:${row.telephone}`") {{ row.telephone }}

          template(v-slot:marker_icons="{row}")
            template(v-if="row.marker_icons.length > 0")
              span.m-icon(
                v-for="(ic, i) in row.marker_icons"
                :class="`m-${ic}`"
                :key="i"
              )
            span(v-else)

          template(v-slot:ping="{row}")
            ping-profile(:customer="row")

          el-button-group
            el-button(
              icon='el-icon-plus'
              type='success'
              @click="addCustomerDialog=true"
              :disabled="!$perms.customers.add_customer"
            ) Добавить абонента
            el-button(
              icon='el-icon-set-up'
              @click="sitesDlg=true"
              v-if="isSomeoneSelected"
            ) Сайты
            el-button(
              icon='el-icon-s-operation'
              @click="editFieldsVisible=true"
            ) Поля

    el-dialog(
      title='Добавить абонента'
      :visible.sync='addCustomerDialog'
      top="5vh"
      :close-on-click-modal="false"
    )
      new-customer-form(
        :selectedLocality='localityId'
        v-on:done="addFrmDone"
      )
    el-dialog(
      title="Кто имеет права на абонента"
      :visible.sync="permsDialog"
      top="5vh"
      :close-on-click-modal="false"
    )
      object-perms(
        v-on:save="changeCustomerObjectPerms"
        :getGroupObjectPermsFunc="getCustomerObjectPermsFunc4Grp"
        :getSelectedObjectPerms="customerGetSelectedObjectPerms"
        :objId="customerIdGetter"
      )
    el-dialog(
      v-if="$perms.is_superuser"
      title="Принадлежность выбранных абонентов сайтам"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false"
    )
      sites-attach(
        v-on:save="selectedCustomerSitesSave"
      )
      el-dialog(
        width="40%"
        :visible.sync="sitesDlgProgress"
        append-to-body
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      )
        el-progress.progress_disable_animations(
          :percentage="sitesProgress"
        )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import {
  IDRFRequestListParameters,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsResultStruct
} from '@/api/types'
import {
  ICustomer,
  IDRFRequestListParametersCustomer,
} from '@/api/customers/types'
import {
  getCustomers,
  setCustomerObjectsPerms,
  getCustomerObjectsPerms,
  getCustomerSelectedObjectPerms
} from '@/api/customers/req'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import NewCustomerForm from './new-customer-form.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import PingProfile from './ping-profile.vue'
import { CustomerModule } from '@/store/modules/customers/customer'
import { LocalityModule } from '@/store/modules/addresses/locality'
import CustomerListFilters from './customer-list-filters.vue'

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
    PingProfile,
    CustomerListFilters,
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private localityId!: number
  private addCustomerDialog = false
  private permsDialog = false
  public readonly $refs!: {
    tbl: DataTableComp
  }
  private selectedCustomers: number[] = []
  private sitesDlg = false
  private sitesDlgProgress = false
  private sitesProgress = 0
  private editFieldsVisible = false
  private filterForm = {
    group: Number(this.$route.query.group) || null,
    street: Number(this.$route.query.street) || null
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'id',
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
      prop: 'group_title',
      label: 'Группа',
    },
    {
      prop: 'marker_icons',
      label: 'Маркер'
    },
    {
      prop: 'ping',
      label: 'Ping',
      'min-width': 150
    }
  ]

  private async getAllCustomers(params?: IDRFRequestListParameters) {
    const street = this.$route.query.street
    const group = this.$route.query.group
    let r
    if (params) {
      let newParams: IDRFRequestListParametersCustomer = Object.assign(params, {
        locality: this.localityId,
        fields: 'id,username,fio,street_name,house,telephone,current_service__service__title,balance,group_title,is_active,lease_count,marker_icons'
      })
      if (street) {
        newParams.street = Number(street)
      }
      if (group) {
        newParams.group = Number(group)
      }
      r = await getCustomers(newParams)
    } else {
      r = await getCustomers()
    }
    return r
  }

  private addFrmDone(newCustomer: ICustomer) {
    this.addCustomerDialog = false
    this.$message.success('Абонент добавлен')
    this.$router.push({ name: 'customerDetails', params: { uid: newCustomer.id.toString() } })
  }

  @Watch('filterForm.street')
  private onStreetChange(streetId: number) {
    let qr = Object.assign({}, this.$route.query) as Record<string, any>
    const qstreet = qr.street
    delete qr.street

    if (streetId != qstreet) {
      qr['street'] = streetId
    }
    this.$router.push({ path: this.$route.path, query: qr })
  }

  @Watch('filterForm.group')
  private onGroupChange(groupId: number) {
    let qr = Object.assign({}, this.$route.query) as Record<string, any>
    const qgroup = qr.group
    delete qr.group

    if (groupId != qgroup) {
      qr['group'] = groupId
    }
    this.$router.push({ path: this.$route.path, query: qr })
  }

  @Watch('$route.query.street')
  private onChStreet() {
    this.$refs.tbl.GetTableData()
  }

  @Watch('$route.query.group')
  private onChGroup() {
    this.$refs.tbl.GetTableData()
  }

  created() {
    document.title = 'Список абонентов'
    this.setCrumbs()
  }

  // Breadcrumbs
  private async setCrumbs() {
    if (this.$store.state.locality.id !== this.localityId) {
      await LocalityModule.GetLocality(this.localityId)
    }
    BreadcrumbsModule.SetCrumbs([
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
          title: this.$store.state.locality.title
        }
      }
    ] as any[])
  }
  // End Breadcrumbs

  private rowColor({ row }: ITableRowClassName) {
    return row.is_active ? '' : 'error-row'
  }

  get customerIdGetter() {
    return CustomerModule.id
  }

  private async changeCustomerObjectPerms(info: IObjectGroupPermsResultStruct) {
    await setCustomerObjectsPerms(this.customerIdGetter, info)
    this.permsDialog = false
  }
  private getCustomerObjectPermsFunc4Grp(): IObjectGroupPermsInitialAxiosResponsePromise {
    return getCustomerObjectsPerms(this.customerIdGetter)
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
    this.$message.success('Готово')
    this.sitesDlgProgress = false
  }
}
</script>
