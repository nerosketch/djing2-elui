<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadDevs"
      :heightDiff='187'
      ref='table'
    )
      span(slot="pk" slot-scope="{row}")
        el-link(type="primary")
          router-link(:to="{name: 'device-view', params:{ devId: row.pk, devType: row.dev_type }}") {{ row.pk }}
      span(slot="ip_address" slot-scope="{row}") {{ row.ip_address || '-' }}
      span(slot="comment" slot-scope="{row}") {{ row.comment }}
      span(slot="mac_addr" slot-scope="{row}") {{ row.mac_addr }}
      span(slot="dev_type" slot-scope="{row}") {{ row.dev_type_str }}
      span(slot="status" slot-scope="{row}") {{ row.status ? 'Ok' : 'Не ok' }}
      span(slot="is_noticeable" slot-scope="{row}") {{ row.is_noticeable ? 'Да' : 'Не' }}
      el-button-group(slot="oper" slot-scope="{row}")
        el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
        el-button(type="danger" icon="el-icon-delete" size="mini" @click="delGroup(row)")

    el-dialog(
      title="Железка"
      :visible.sync="dialogVisible"
    )
      dev-form(
        v-if="dialogVisible"
        v-on:done="frmDone"
      )

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DeviceModule } from '@/store/modules/devices/device'
import { IDRFRequestListParameters } from '@/api/types'
import { IDRFRequestListParametersDevGroup, IDevice } from '@/api/devices/types'
import { getDevices } from '@/api/devices/req'
import DevForm from './dev-form.vue'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'

class DataTableComp extends DataTable<IDevice> {}

@Component({
  name: 'DevList',
  components: {
    DevForm,
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }
  @Prop({ default: 0 }) private groupId!: number
  private devs: IDevice[] = []
  private dialogVisible = false
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      width: 70
    },
    {
      prop: 'ip_address',
      label: 'IP Адрес'
    },
    {
      prop: 'comment',
      label: 'Коммент'
    },
    {
      prop: 'dev_type',
      label: 'Тип'
    },
    {
      prop: 'mac_addr',
      label: 'MAC Адрес'
    },
    {
      prop: 'status',
      label: 'Состояние'
    },
    {
      prop: 'is_noticeable',
      label: 'Оповещения'
    },
    {
      prop: 'oper',
      label: 'Oper',
      width: 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private async openEdit(dev: IDevice) {
    await DeviceModule.SET_ALL_DEV(dev)
    this.dialogVisible = true
  }

  private async loadDevs(params: IDRFRequestListParametersDevGroup) {
    const r = await getDevices({
      page: params.page,
      page_size: params.page_size,
      group: this.groupId,
      ordering: params.ordering,
      fields: 'pk,ip_address,comment,dev_type_str,mac_addr,status,is_noticeable,group'
    })
    this.devs = r.data.results
    return r
  }

  private async delDevice(dev: IDevice) {
    if (confirm(`Ты действительно хочешь удалить устройство "${dev.comment}"?`)) {
      await DeviceModule.DelDevice(dev.pk)
      this.$refs.table.GetTableData()
    }
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.GetTableData()
  }
}
</script>
