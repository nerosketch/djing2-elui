<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadPayGws"
      widthStorageNamePrefix='gws'
      ref='table'
    )
      template(v-slot:id="{row}") {{ row.id }}

      template(v-slot:title="{row}") {{ row.title }}

      template(v-slot:service_id="{row}") {{ row.service_id }}

      template(v-slot:slug="{row}") {{ row.slug }}

      template(v-slot:secret="{row}") {{ row.secret }}

      template(v-slot:secret="{row}") {{ row.pay_count }}

      template(v-slot:oper="{row}")
        el-button-group
          el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
          el-button(type="danger" icon="el-icon-delete" size="mini" @click="delPayGw(row)")

      el-button(
        size='mini'
        icon='el-icon-plus'
        @click='openNew'
      ) Добавить шлюз

    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
    )
      pay-gw-form(
        v-on:done="frmDone"
      )

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { getPayGateways } from '@/api/fin/req'
import { IPayAllTimeGateway } from '@/api/fin/types'
import { PayAllTimeGatewayModule } from '@/store/modules/fin'
import PayGwForm from './gw-form.vue'

class DataTableComp extends DataTable<IPayAllTimeGateway> {}

@Component({
  name: 'GwList',
  components: {
    PayGwForm,
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }
  private dialogTitle = 'Платёжный шлюз'
  private dialogVisible = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'id',
      label: 'ID',
      'min-width': 70
    },
    {
      prop: 'title',
      label: 'Название',
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'service_id',
      label: 'Service ID',
      sortable: true,
      'min-width': 100
    },
    {
      prop: 'slug',
      label: 'путь'
    },
    {
      prop: 'secret',
      label: 'secret'
    },
    {
      prop: 'pay_count',
      label: 'Количество платежей'
    },
    {
      prop: 'oper',
      label: 'Oper',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private async loadPayGws(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'id,title,service_id,slug,secret,pay_count'
    }
    const r = await getPayGateways(params)
    return r
  }

  private openEdit(gw: IPayAllTimeGateway) {
    PayAllTimeGatewayModule.SET_ALL_PAYGW(gw)
    this.dialogTitle = 'Изменить платёжный шлюз'
    this.dialogVisible = true
  }
  private delPayGw(gw: IPayAllTimeGateway) {
    this.$confirm('Удалить платёжный шлюз?').then(async() => {
      await PayAllTimeGatewayModule.DelPayGroup(gw.id)
      this.$refs.table.GetTableData()
    })
  }
  private openNew() {
    PayAllTimeGatewayModule.RESET_ALL_PAYGW()
    this.dialogTitle = 'Создать платёжный шлюз'
    this.dialogVisible = true
  }
  private frmDone(gw: IPayAllTimeGateway) {
    this.dialogVisible = false
    this.$refs.table.GetTableData()
    this.$message.success('Платёжный шлюз добавлен')
  }
}
</script>