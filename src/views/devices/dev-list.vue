<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadDevs"
      :heightDiff='100'
      widthStorageNamePrefix='devs'
      ref='table'
    )
      template(v-slot:pk="{row}")
        el-link(type="primary")
          router-link(:to="{name: 'device-view', params: { devId: row.pk }}") {{ row.pk }}

      template(v-slot:ip_address="{row}") {{ row.ip_address || '-' }}

      template(v-slot:status="{row}") {{ row.status ? 'Ok' : 'Не ok' }}

      template(v-slot:is_noticeable="{row}") {{ row.is_noticeable ? 'Да' : 'Не' }}

      template(v-slot:oper="{row}")
        el-button-group
          el-button(icon="el-icon-edit" size="mini" @click="openEdit(row)")
          el-button(type="danger" icon="el-icon-delete" size="mini" @click="delDevice(row)")

      el-button(
        size='mini'
        icon='el-icon-plus'
        @click="openNew"
      ) Добавить устройство

    el-dialog(
      title="Железка"
      :visible.sync="dialogVisible"
    )
      dev-form(
        v-if="dialogVisible"
        v-on:done="frmDone"
      )
    el-dialog(
      title="Добавить устройство"
      :visible.sync="dialogNewDev"
    )
      new-dev-form(
        v-if="dialogNewDev"
        v-on:done="frmNewDevDone"
        v-on:err="dialogNewDev=false"
        :initialGroup="groupId"
      )

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DeviceModule } from '@/store/modules/devices/device'
import { IDRFRequestListParametersDevGroup, IDevice } from '@/api/devices/types'
import { getDevices } from '@/api/devices/req'
import DevForm from './dev-form.vue'
import NewDevForm from './new-dev-form.vue'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'
import { GroupModule } from '@/store/modules/groups'

class DataTableComp extends DataTable<IDevice> {}

@Component({
  name: 'DevList',
  components: {
    DevForm,
    NewDevForm,
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }
  @Prop({ default: 0 }) private groupId!: number
  private dialogVisible = false
  private dialogNewDev = false
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      'min-width': 70
    },
    {
      prop: 'ip_address',
      label: 'IP Адрес',
      'min-width': 120
    },
    {
      prop: 'comment',
      label: 'Коммент',
      'min-width': 300
    },
    {
      prop: 'dev_type',
      label: 'Тип',
      'min-width': 150
    },
    {
      prop: 'mac_addr',
      label: 'MAC Адрес',
      'min-width': 150
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
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private async openEdit(dev: IDevice) {
    await DeviceModule.SET_ALL_DEV(dev)
    this.dialogVisible = true
  }

  private async openNew() {
    await DeviceModule.RESET_ALL_DEV()
    this.dialogNewDev = true
  }

  private async loadDevs(params: IDRFRequestListParametersDevGroup) {
    const r = await getDevices({
      page: params.page,
      page_size: params.page_size,
      group: this.groupId,
      ordering: params.ordering,
      fields: 'pk,ip_address,comment,dev_type,dev_type_str,mac_addr,status,is_noticeable,group,man_passw,snmp_extra'
    })
    return r
  }

  private async delDevice(dev: IDevice) {
    this.$confirm(`Ты действительно хочешь удалить устройство "${dev.comment}"?`).then(async() => {
      await DeviceModule.DelDevice(dev.pk)
      this.$message.success('Удалено')
      this.$refs.table.GetTableData()
    })
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.GetTableData()
  }

  private frmNewDevDone(newDev: IDevice) {
    this.dialogNewDev = false
    this.$message.success('Новое устройство сохранено')
    this.$router.push({ name: 'device-view',
      params: {
        devId: newDev.pk.toString()
      } })
  }

  // Breadcrumbs
  created() {
    this.onGrpCh(this.groupId)
  }
  @Watch('groupId')
  private async onGrpCh(grpId: number) {
    await GroupModule.GetGroup(grpId)
    await BreadcrumbsModule.SetCrumbs([
      {
        path: '/devices',
        meta: {
          hidden: true,
          title: 'Группы'
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: this.grpName
        }
      }
    ] as RouteRecord[])
  }
  get grpName() {
    return GroupModule.title
  }
  // End Breadcrumbs
}
</script>
