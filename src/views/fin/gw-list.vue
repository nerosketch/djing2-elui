<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadPayGws"
      widthStorageNamePrefix="gws"
      ref="table")
      template(v-slot:title="{row}")
        router-link.el-link.el-link--primary.is-underline(:to="{ name: 'finReport' }")
          | {{ row.title }}

      template(v-slot:oper="{row}")
        el-button-group
          el-button(v-if="$perms.is_superuser" @click="openSitesDlg(row)")
            | C

          el-button(icon="el-icon-edit" @click="openEdit(row)")

          el-button(
            type="danger"
            icon="el-icon-delete"
            @click="delPayGw(row)"
            :disabled="!$perms.fin_app.delete_basepaymentmodel")

      el-button(icon="el-icon-plus" @click="openNew")
        | {{ $t('fin.addGateway') }}

    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false")
      template(v-if="frmComponent")
        component(
          :is="frmComponent"
          v-on:done="frmDone"
        )
      h2(v-else) formError: not selected type

    el-dialog(
      :title="$t('facilities')"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false")
      sites-attach(
        :selectedSiteIds="$store.state.basepaymentmodel.sites"
        v-on:save="payGwSitesSave"
      )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { getPayGateways } from '@/api/fin/req'
import { IPayBaseGateway } from '@/api/fin/types'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { PayBaseGatewayModule } from '@/store/modules/fin/basePaymentGateway'
import AlltimeGwForm from './forms/alltime-form.vue'
import RncbGwForm from './forms/rncb-form.vue'
import NewGwForm from './new-gw-form.vue'

class DataTableComp extends DataTable<IPayBaseGateway> {}

@Component({
  name: 'GwList',
  components: {
    datatable: DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }

  private dialogTitle = this.$tc('payableLock')
  private dialogVisible = false
  private sitesDlg = false
  private frmComponent: any = null

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: this.$tc('title'),
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'slug',
      label: this.$tc('path')
    },
    {
      prop: 'payment_type_text',
      label: 'type'
    },
    {
      prop: 'pay_count',
      label: this.$tc('numberOfPayments')
    },
    {
      prop: 'oper',
      label: this.$tc('buttons'),
      'min-width': 180,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadPayGws(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,title,slug,pay_count,payment_type_text,payment_type,sites'
    }
    return getPayGateways(params)
  }

  private openEdit(gw: IPayBaseGateway) {
    switch (gw.payment_type) {
      case 3:
        this.frmComponent = AlltimeGwForm
        break
      case 2:
        this.frmComponent = RncbGwForm
        break
    }
    PayBaseGatewayModule.SET_ALL_PAYGW(gw)
    this.dialogTitle = this.$tc('fin.modifyThePaymentGateway')
    this.dialogVisible = true
  }

  private delPayGw(gw: IPayBaseGateway) {
    this.$confirm(this.$tc('removePayGWQuestion')).then(async() => {
      await PayBaseGatewayModule.DelPayGroup(gw.id)
      this.$refs.table.LoadTableData()
    })
  }

  private openNew() {
    this.frmComponent = NewGwForm
    PayBaseGatewayModule.RESET_ALL_PAYGW()
    this.dialogTitle = this.$tc('createAPayLock')
    this.dialogVisible = true
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.LoadTableData()
    this.$message.success(this.$tc('payableLockAdded'))
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: this.$tc('finance')
        }
      }
    ] as any)
  }
  // End Breadcrumbs

  private payGwSitesSave(selectedSiteIds: number[]) {
    PayBaseGatewayModule.PatchPayGw({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.table.LoadTableData()
      this.$message.success(this.$tc('theContentOfThePayloadableSiteIsMaintained'))
    })
    this.sitesDlg = false
  }

  private openSitesDlg(grp: IPayBaseGateway) {
    PayBaseGatewayModule.SET_ALL_PAYGW(grp)
    this.sitesDlg = true
  }
}
</script>
