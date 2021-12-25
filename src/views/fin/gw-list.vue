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
          el-button(v-if="$perms.is_superuser", @click="openSitesDlg(row)")
            | C
        
          el-button(icon="el-icon-edit", @click="openEdit(row)")
        
          el-button(
            type="danger"
            icon="el-icon-delete"
            @click="delPayGw(row)"
            :disabled="!$perms.fin_app.delete_payalltimegateway")
    
      el-button(icon="el-icon-plus", @click="openNew")
        | {{ $t('addALock') }}
  
    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false")
      pay-gw-form(v-on:done="frmDone")
  
    el-dialog(
      :title="$t('facilities')"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false")
      sites-attach(:selectedSiteIds="$store.state.payalltimegateway.sites", v-on:save="payGwSitesSave")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { getPayGateways } from '@/api/fin/req'
import { IPayAllTimeGateway } from '@/api/fin/types'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { PayAllTimeGatewayModule } from '@/store/modules/fin'
import PayGwForm from './gw-form.vue'

class DataTableComp extends DataTable<IPayAllTimeGateway> {}

@Component({
  name: 'GwList',
  components: {
    PayGwForm,
    datatable: DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }

  private dialogTitle = this.$t('payableLock')
  private dialogVisible = false
  private sitesDlg = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: this.$t('title'),
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'service_id',
      label: this.$t('id'),
      sortable: true,
      'min-width': 100
    },
    {
      prop: 'servants',
      label: this.$t('the')
    },
    {
      prop: 'secret',
      label: 'secret'
    },
    {
      prop: 'pay_count',
      label: this.$t('numberOfPayments')
    },
    {
      prop: 'op.',
      label: this.$t('buttons'),
      'min-width': 180,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadPayGws(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,title,service_id,slug,secret,pay_count,sites'
    }
    return getPayGateways(params)
  }

  private openEdit(gw: IPayAllTimeGateway) {
    PayAllTimeGatewayModule.SET_ALL_PAYGW(gw)
    this.dialogTitle = this.$t('modifyThePlausibleLock')
    this.dialogVisible = true
  }

  private delPayGw(gw: IPayAllTimeGateway) {
    this.$confirm(this.$t('removeThePayLock?')).then(async() => {
      await PayAllTimeGatewayModule.DelPayGroup(gw.id)
      this.$refs.table.LoadTableData()
    })
  }

  private openNew() {
    PayAllTimeGatewayModule.RESET_ALL_PAYGW()
    this.dialogTitle = this.$t('createAPayLock')
    this.dialogVisible = true
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.LoadTableData()
    this.$message.success(this.$t('payableLockAdded'))
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: this.$t('finance')
        }
      }
    ] as any)
  }
  // End Breadcrumbs

  private payGwSitesSave(selectedSiteIds: number[]) {
    PayAllTimeGatewayModule.PatchPayGw({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.table.LoadTableData()
      this.$message.success(this.$t('theContentOfThePayloadableSiteIsMaintained'))
    })
    this.sitesDlg = false
  }

  private openSitesDlg(grp: IPayAllTimeGateway) {
    PayAllTimeGatewayModule.SET_ALL_PAYGW(grp)
    this.sitesDlg = true
  }
}
</script>
