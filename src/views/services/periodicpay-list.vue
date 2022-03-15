<template lang="pug">
  div
    datatable(
      :columns="tableColumns"
      :getData="loadPeriodics"
      :heightDiff="189"
      widthStorageNamePrefix="perpay"
      ref="table")
      template(v-slot:oper="{row}")
        el-button-group
          el-button(v-if="$perms.is_superuser" @click="openSitesDlg(row)")
            | C

          el-button(icon="el-icon-edit" @click="openEdit(row)")

          el-button(
            type="danger"
            icon="el-icon-delete"
            @click="delPerPay(row)"
            :disabled="!$perms.services.delete_periodicpay")

      el-button(
        icon="el-icon-plus"
        type="success"
        @click="openNew"
        :disabled="!$perms.services.add_periodicpay")
        | {{ $t('add') }}

    el-dialog(
      :title="isNew ? 'Создание' : 'Изменение'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false")
      periodicpay-form(v-on:done="frmDone")

    el-dialog(
      :title="$t('facilities')"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false")
      sites-attach(
        :selectedSiteIds="$store.state.periodicpay.sites"
        v-on:save="serviceSitesSave"
      )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { IPeriodicPay } from '@/api/services/types'
import { getPeriodicPays } from '@/api/services/req'
import { PeriodicPayModule } from '@/store/modules/services/periodic-pay'
import PeriodicpayForm from './periodicpay-form.vue'

class DataTableComp extends DataTable<IPeriodicPay> {}

@Component({
  name: 'PeriodicPayList',
  components: { datatable: DataTableComp, PeriodicpayForm }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'name',
      label: this.$tc('nameOfPayment'),
      'min-width': 200
    },
    {
      prop: 'when_add',
      label: this.$tc('dateOfEstablishment'),
      'min-width': 150
    },
    {
      prop: 'amount',
      label: this.$tc('value'),
      'min-width': 150,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: this.$tc('buttons'),
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private pays: IPeriodicPay[] = []
  private dialogVisible = false
  private sitesDlg = false

  private async openEdit(pay: IPeriodicPay) {
    await PeriodicPayModule.SET_ALL_PPAY(pay)
    this.dialogVisible = true
  }

  private openNew() {
    PeriodicPayModule.RESET_ALL_PPAY()
    this.dialogVisible = true
  }

  private async delPerPay(pay: IPeriodicPay) {
    if (confirm(this.$t('austRemovePP', [pay.name]) as string)) {
      await PeriodicPayModule.DelPeriodicPay(pay.id)
      this.$refs.table.LoadTableData()
    }
  }

  get isNew() {
    return PeriodicPayModule.id === 0
  }

  private loadPeriodics(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,name,when_add,amount,sites'
    }
    return getPeriodicPays(params)
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.LoadTableData()
  }

  private serviceSitesSave(selectedSiteIds: number[]) {
    PeriodicPayModule.PatchPeriodicPay({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.table.LoadTableData()
      this.$message.success(this.$tc('facilitiesMaintained'))
    })
    this.sitesDlg = false
  }

  private openSitesDlg(srv: IPeriodicPay) {
    PeriodicPayModule.SET_ALL_PPAY(srv)
    this.sitesDlg = true
  }
}
</script>
