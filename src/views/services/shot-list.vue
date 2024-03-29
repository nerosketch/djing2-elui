<template lang="pug">
  div
    datatable(
      :columns="tableColumns"
      :getData="loadShots"
      :heightDiff="189"
      widthStorageNamePrefix="shots"
      ref="table")
      template(#oper="{row}")
        el-button-group
          el-button(v-if="$perms.is_superuser" @click="openSitesDlg(row)")
            | C

          el-button(icon="el-icon-edit" @click="openEdit(row)")

          el-button(
            type="danger"
            icon="el-icon-delete"
            @click="delShot(row)"
            :disabled="!$perms.services.delete_oneshotpay")

      el-button(
        icon="el-icon-plus"
        type="success"
        @click="openNew")
        | {{ $t('add') }}

    el-dialog(
      :title="$t('services.doPP', [(isNew ? 'Создание' : 'Изменение')])"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false")
      shot-form(v-on:done="frmDone")

    el-dialog(
      :title="$t('facilities')"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false")
      sites-attach(
        :selectedSiteIds="$store.state.oneshotpay.sites"
        v-on:save="serviceSitesSave"
      )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { IOneShotPay } from '@/api/services/types'
import { getOneShotPays } from '@/api/services/req'
import { OneShotPayModule } from '@/store/modules/services/one-shot-pay'
import ShotForm from './shot-form.vue'

class DataTableComp extends DataTable<IOneShotPay> {}

@Component({
  name: 'ShotList',
  components: { datatable: DataTableComp, ShotForm }
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
      prop: 'cost',
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

  private shots: IOneShotPay[] = []
  private dialogVisible = false
  private sitesDlg = false

  private async openEdit(shot: IOneShotPay) {
    await OneShotPayModule.SET_ALL_OSPAY(shot)
    this.dialogVisible = true
  }

  private openNew() {
    OneShotPayModule.RESET_ALL_OSPAY()
    this.dialogVisible = true
  }

  private async delShot(shot: IOneShotPay) {
    if (confirm(this.$tc('tasks.austRemoveShotPay', 1, [shot.name]))) {
      await OneShotPayModule.DelOneShotPay(shot.id)
      this.$refs.table.LoadTableData()
    }
  }

  private loadShots(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,name,cost,sites'
    }
    return getOneShotPays(params)
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.LoadTableData()
  }

  get isNew(): boolean {
    return OneShotPayModule.id === 0
  }

  private serviceSitesSave(selectedSiteIds: number[]) {
    OneShotPayModule.PatchOneShotPay({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.table.LoadTableData()
      this.$message.success(this.$tc('theOwnershipOfTheTypeOfPaymentsToWebsitesIsMaintained'))
    })
    this.sitesDlg = false
  }

  private openSitesDlg(srv: IOneShotPay) {
    OneShotPayModule.SET_ALL_OSPAY(srv)
    this.sitesDlg = true
  }
}
</script>
