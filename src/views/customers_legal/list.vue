<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadCustomersLegal"
      :heightDiff="118"
      widthStorageNamePrefix="legalcustomers"
      ref="table")
      template(#btn="{row}")
        el-button(
          icon="el-icon-edit"
          @click="openEdit(row)"
          :disabled="!$perms.customers_legal.change_customerlegalmodel")

      template(#username="{row}")
        router-link.el-link.el-link--primary.is-underline(
          :to="{ name: 'customerLegalDetail', params: { uid: row.id } }"
        ) {{ row.username }}

      el-button(
        icon="el-icon-plus"
        @click="openNew"
        :disabled="!$perms.customers_legal.add_customerlegalmodel")
        | {{ $t('addAnAccountingRecord') }}

    el-dialog(
      :title="$t('organization')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      top="1%")
      legal-form(
        v-if="dialogVisible"
        v-on:added="frmAddDone"
        v-on:update="frmUpdateDone")

    el-dialog(
      :title="$t('whoHasTheRightToAnAccount')"
      :visible.sync="permsDialog"
      top="5vh"
      :close-on-click-modal="false")
      object-perms(
        v-on:save="changeLegalObjectPerms"
        :getGroupObjectPermsFunc="getCustomerLegalObjectPermsFunc4Grp"
        :getSelectedObjectPerms="CustLegalGetSelectedObjectPerms"
        :objId="$store.state.customerlegal.title")
</template>

<script lang="ts">
import { ICustomerLegal } from '@/api/customers_legal/types'
import {
  IDRFRequestListParameters,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IObjectGroupPermsResultStruct
} from '@/api/types'
import DataTable, { DataTableColumnAlign, IDataTableColumn } from '@/components/Datatable/index.vue'
import { Component, Vue } from 'vue-property-decorator'
import { getCustomerLegalObjectsPerms, getCustomersLegal } from '@/api/customers_legal/req'
import LegalForm from './legal-form.vue'
import { CustomerLegalModule } from '@/store/modules/customers_legal/customer-legal'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

class DataTableComp extends DataTable<ICustomerLegal> {}

@Component({
  name: 'CustomerLegalList',
  components: {
    datatable: DataTableComp,
    LegalForm
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }

  private loading = false
  private dialogVisible = false
  private permsDialog = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'username',
      label: this.$tc('login')
    },
    {
      prop: 'title',
      label: this.$tc('title'),
      'min-width': 150
    },
    {
      prop: 'balance',
      label: this.$tc('balance')
    },
    {
      prop: 'tax_number',
      label: this.$tc('inn')
    },
    {
      prop: 'post_index',
      label: this.$tc('postalIndex')
    },
    {
      prop: 'btn',
      label: '#',
      'min-width': 90,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadCustomersLegal(params?: IDRFRequestListParameters) {
    const additional = {
      fields: 'id,username,title,balance,tax_number,post_index,'
    }
    if (params) {
      params = Object.assign(params, additional)
    } else {
      params = additional as any
    }
    return getCustomersLegal(params)
  }

  private openEdit(account: ICustomerLegal) {
    CustomerLegalModule.SET_ALL_CUSTOMER_LEGAL(account)
    this.dialogVisible = true
  }

  private openNew() {
    CustomerLegalModule.GetInitial()
    this.dialogVisible = true
  }

  private frmAddDone(acc: ICustomerLegal) {
    this.$refs.table.LoadTableData()
    this.dialogVisible = false
  }

  private frmUpdateDone(acc: ICustomerLegal) {
    this.dialogVisible = false
  }

  private async changeLegalObjectPerms(info: IObjectGroupPermsResultStruct) {
    // await setCustomerObjectsPerms(this.customerIdGetter, info)
    this.permsDialog = false
  }

  private getCustomerLegalObjectPermsFunc4Grp(): IObjectGroupPermsInitialAxiosResponsePromise {
    return getCustomerLegalObjectsPerms(this.$store.state.customerlegal.id)
  }

  private CustLegalGetSelectedObjectPerms(customerId: number, profileGroupId: number) {
    // return getCustomerSelectedObjectPerms(customerId, profileGroupId)
  }

  // Breadcrumbs
  private setCrumbs() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/legal/',
        meta: {
          hidden: true,
          title: this.$tc('organizations')
        }
      }
    ] as any)
  }
  // End Breadcrumbs

  created() {
    this.setCrumbs()
  }
}
</script>
