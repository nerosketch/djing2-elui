<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadShots"
    :heightDiff='165'
    widthStorageNamePrefix='shots'
    ref='table'
  )
    template(v-slot:oper="{row}")
      el-button-group
        el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
        el-button(
          type="danger" icon="el-icon-delete" size="mini"
          @click="delShot(row)"
          :disabled="!$perms.services.delete_oneshotpay"
        )

    el-button(
      size='mini'
      icon='el-icon-plus'
      type='success'
      @click="openNew"
    ) Добавить

  el-dialog(
    :title="(isNew ? 'Создание' : 'Изменение') + ' одноразового платежа'"
    :visible.sync="dialogVisible"
  )
    shot-form(
      v-on:done="frmDone"
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
  components: { 'datatable': DataTableComp, ShotForm }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      'min-width': 70
    },
    {
      prop: 'name',
      label: 'Название платежа',
      'min-width': 200
    },
    {
      prop: 'cost',
      label: 'Стоимость',
      'min-width': 150,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'oper',
      label: 'Oper',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]
  private shots: IOneShotPay[] = []
  private dialogVisible = false

  private async openEdit(shot: IOneShotPay) {
    await OneShotPayModule.SET_ALL_OSPAY(shot)
    this.dialogVisible = true
  }

  private openNew() {
    OneShotPayModule.RESET_ALL_OSPAY()
    this.dialogVisible = true
  }

  private async delShot(shot: IOneShotPay) {
    if (confirm(`Действительно удалить платёж "${shot.name}"?`)) {
      await OneShotPayModule.DelOneShotPay(shot.pk)
      this.$refs.table.GetTableData()
    }
  }

  private loadShots(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'pk,name,cost'
    }
    return getOneShotPays(params)
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.GetTableData()
  }

  get isNew(): boolean {
    return OneShotPayModule.pk === 0
  }
}
</script>
