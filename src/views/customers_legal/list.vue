<template>
  <div class="app-container">
    <datatable :columns="tableColumns" :getData="loadCustomersLegal" :heightDiff="118" widthStorageNamePrefix="legalcustomers" ref="table">
      <template v-slot:btn="{row}">
        <el-button icon="el-icon-edit" @click="openEdit(row)" :disabled="!$perms.customers_legal.change_customerlegalmodel"></el-button>
      </template>
      <template v-slot:username="{row}">
        <router-link class="el-link el-link--primary is-underline" :to="{ name: 'customerLegalDetail', params: { uid: row.id } }">{{ row.username }}</router-link>
      </template>
      <el-button icon="el-icon-plus" @click="openNew" :disabled="!$perms.customers_legal.add_customerlegalmodel">{{ $t('dobavit-uchyotnuyu-zapis') }}</el-button>
    </datatable>
    <el-dialog title="$t('organizaciya')" :visible.sync="dialogVisible" :close-on-click-modal="false" top="1%">
      <legal-form v-if="dialogVisible" v-on:added="frmAddDone" v-on:update="frmUpdateDone"></legal-form>
    </el-dialog>
    <el-dialog title="$t('kto-imeet-prava-na-uchyotnuyu-zapis')" :visible.sync="permsDialog" top="5vh" :close-on-click-modal="false">
      <object-perms v-on:save="changeLegalObjectPerms" :getGroupObjectPermsFunc="getCustomerLegalObjectPermsFunc4Grp" :getSelectedObjectPerms="CustLegalGetSelectedObjectPerms" :objId="$store.state.customerlegal.title"></object-perms>
    </el-dialog>
  </div>
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
      label: this.$t('login')
    },
    {
      prop: 'title',
      label: this.$t('nazvanie'),
      'min-width': 150
    },
    {
      prop: 'balance',
      label: this.$t('balans')
    },
    {
      prop: 'tax_number',
      label: this.$t('inn-0')
    },
    {
      prop: 'post_index',
      label: this.$t('pochtovyi-indeks')
    },
    {
      prop: 'btn',
      label: this.$t('key'),
      'min-width': 90,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadCustomersLegal(params?: IDRFRequestListParameters) {
    return getCustomersLegal(params)
  }

  private openEdit(account: ICustomerLegal) {
    this.dialogVisible = true
    CustomerLegalModule.SET_ALL_CUSTOMER_LEGAL(account)
  }

  private openNew() {
    this.dialogVisible = true
    CustomerLegalModule.GetInitial()
  }

  private frmAddDone(acc: ICustomerLegal) {
    this.dialogVisible = false
    this.$refs.table.LoadTableData()
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
  private async setCrumbs() {
    await BreadcrumbsModule.SetCrumbs([
      {
        path: '/legal/',
        meta: {
          hidden: true,
          title: this.$t('organizacii')
        }
      },
    ] as any)
  }
  // End Breadcrumbs

  created() {
    this.setCrumbs()
  }
}
</script>
