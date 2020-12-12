<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadDevs"
      :heightDiff='100'
      :editFieldsVisible.sync="editFieldsVisible"
      widthStorageNamePrefix='devs'
      ref='table'
    )
      template(v-slot:pk="{row}")
        template(v-if="$perms.devices.view_device")
          router-link(:to="{name: 'device-view', params: { devId: row.pk }}")
            el-link(type="primary") {{ row.pk }}
        span(v-else) {{ row.pk }}

      template(v-slot:ip_address="{row}") {{ row.ip_address || '-' }}

      template(v-slot:status="{row}") {{ row.status ? 'Ok' : 'Не ok' }}

      template(v-slot:is_noticeable="{row}") {{ row.is_noticeable ? 'Да' : 'Не' }}

      template(v-slot:oper="{row}")
        el-button-group
          el-button(
            v-if="$perms.is_superuser"
            @click="openSitesDlg(row)"
            size="mini"
          ) C
          el-button(
            size='mini' icon='el-icon-lock'
            @click="openPermsDialog(row)"
            v-if="$perms.is_superuser"
          )
          el-button(
            icon="el-icon-edit" size="mini"
            @click="openEdit(row)"
            :disabled="!$perms.devices.change_device"
          )
          el-button(
            type="danger" icon="el-icon-delete" size="mini"
            @click="delDevice(row)"
            :disabled="!$perms.devices.delete_device"
          )

      el-button-group
        el-button(
          size='mini'
          icon='el-icon-plus'
          @click="openNew"
          :disabled="!$perms.devices.add_device"
        ) Добавить устройство
        el-button(
          icon='el-icon-s-operation'
          size='mini'
          @click="editFieldsVisible=true"
        ) Поля

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
    el-dialog(
      title="Кто имеет права на устройство"
      :visible.sync="permsDialog"
      top="5vh"
    )
      object-perms(
        v-on:save="changeDeviceObjectPerms"
        :getGroupObjectPermsFunc="getDeviceObjectPermsFunc4Grp"
        :getSelectedObjectPerms="deviceGetSelectedObjectPerms"
        :objId="deviceIdGetter"
      )

    el-dialog(
      title="Принадлежность устройства сайтам"
      :visible.sync="sitesDlg"
    )
      sites-attach(
        :selectedSiteIds="$store.state.devicemodule.sites"
        v-on:save="devSitesSave"
      )

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DeviceModule } from '@/store/modules/devices/device'
import { IDRFRequestListParametersDevGroup, IDevice } from '@/api/devices/types'
import { getDevices, setDevObjectsPerms, getDevObjectsPerms, getDeviceSelectedObjectPerms } from '@/api/devices/req'
import DevForm from './dev-form.vue'
import NewDevForm from './new-dev-form.vue'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'
import { GroupModule } from '@/store/modules/groups'
import { IObjectGroupPermsResultStruct, IObjectGroupPermsInitialAxiosResponsePromise } from '@/api/types'

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
  private permsDialog = false
  private sitesDlg = false
  private editFieldsVisible = false
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
      prop: 'dev_type_str',
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
      label: 'Кнопки',
      'min-width': 195,
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

  private loadDevs(params: IDRFRequestListParametersDevGroup) {
    return getDevices({
      page: params.page,
      page_size: params.page_size,
      group: this.groupId,
      ordering: params.ordering,
      fields: 'pk,ip_address,comment,dev_type,dev_type_str,mac_addr,status,is_noticeable,group,man_passw,snmp_extra,sites'
    })
  }

  private async delDevice(dev: IDevice) {
    this.$confirm(`Действительно удалить устройство "${dev.comment}"?`).then(async() => {
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
    document.title = `Устройства - ${this.grpName}`
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
          title: 'Устройства'
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

  get deviceIdGetter() {
    return DeviceModule.pk
  }

  private async changeDeviceObjectPerms(info: IObjectGroupPermsResultStruct) {
    await setDevObjectsPerms(this.deviceIdGetter, info)
    this.permsDialog = false
  }
  private getDeviceObjectPermsFunc4Grp(): IObjectGroupPermsInitialAxiosResponsePromise {
    return getDevObjectsPerms(this.deviceIdGetter)
  }
  private openPermsDialog(d: IDevice) {
    DeviceModule.SET_ALL_DEV(d)
    this.permsDialog = true
  }

  private deviceGetSelectedObjectPerms(devId: number, profileGroupId: number) {
    return getDeviceSelectedObjectPerms(devId, profileGroupId)
  }

  private devSitesSave(selectedSiteIds: number[]) {
    DeviceModule.PatchDevice({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.table.GetTableData()
      this.$message.success('Принадлежность устройства сайтам сохранена')
    })
    this.sitesDlg = false
  }
  private openSitesDlg(dev: IDevice) {
    DeviceModule.SET_ALL_DEV(dev)
    this.sitesDlg = true
  }
}
</script>
