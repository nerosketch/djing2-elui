<template lang="pug">
.app-container
  datatable(
    :columns="tableColumns"
    :getData="loadCustomersLegal"
    :heightDiff='118'
    widthStorageNamePrefix='legalcustomers'
    ref='table'
  )
    template(v-slot:btn="{row}")
      //- el-button(
      //-   v-if="$perms.is_superuser"
      //-   @click="openSitesDlg(row)"
      //- ) C
      el-button(
        icon="el-icon-edit"
        @click="openEdit(row)"
        :disabled="!$perms.customers_legal.change_customerlegalmodel"
      )

    el-button(
      icon='el-icon-plus'
      @click="openNew"
      :disabled="!$perms.customers_legal.add_customerlegalmodel"
    ) Добавить учётную запись

  el-dialog(
    title="Организация"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    top="1%"
  )
    legal-form(
      v-if="dialogVisible"
      v-on:added="frmAddDone"
      v-on:update="frmUpdateDone"
    )
  el-dialog(
    title="Кто имеет права на учётную запись"
    :visible.sync="permsDialog"
    top="5vh"
    :close-on-click-modal="false"
  )
    object-perms(
      v-on:save="changeLegalObjectPerms"
      :getGroupObjectPermsFunc="getCustomerLegalObjectPermsFunc4Grp"
      :getSelectedObjectPerms="CustLegalGetSelectedObjectPerms"
      :objId="$store.state.customerlegal.title"
    )

  //- el-dialog(
  //-   title="Принадлежность учётных записей сайтам"
  //-   :visible.sync="sitesDlg"
  //-   :close-on-click-modal="false"
  //- )
  //-   sites-attach(
  //-     :selectedSiteIds="$store.state.devicemodule.sites"
  //-     v-on:save="devSitesSave"
  //-   )

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
      label: 'Логин'
    },
    {
      prop: 'title',
      label: 'Название',
      'min-width': 150
    },
    {
      prop: 'balance',
      label: 'Баланс'
    },
    {
      prop: 'tax_number',
      label: 'ИНН'
    },
    {
      prop: 'post_index',
      label: 'Почтовый индекс'
    },
    {
      prop: 'btn',
      label: '—',
      'min-width': 90,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadCustomersLegal(params?: IDRFRequestListParameters) {
    return getCustomersLegal(params)
  }

  private async openEdit(account: ICustomerLegal) {
    this.dialogVisible = true
    await CustomerLegalModule.SET_ALL_CUSTOMER_LEGAL(account)
  }

  private async openNew() {
    this.dialogVisible = true
    await CustomerLegalModule.RESET_CUSTOMER_LEGAL()
  }

  private frmAddDone(acc: ICustomerLegal) {
    this.dialogVisible = false
    this.$message.success(`Учётная запись "${acc.title}" успешно создана`)
    this.$refs.table.LoadTableData()
  }

  private frmUpdateDone(acc: ICustomerLegal) {
    this.dialogVisible = false
    this.$message.success(`Учётная запись "${acc.title}" успешно обновлена`)
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
}
</script>
