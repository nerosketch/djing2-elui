<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadDevs"
      :heightDiff='118'
      :editFieldsVisible.sync="editFieldsVisible"
      widthStorageNamePrefix='devs'
      ref='table'
    )
      template(v-slot:comment="{row}")
        router-link(
          v-if="$perms.devices.view_device"
          :to="{name: 'device-view', params: { devId: row.id }}"
        )
          el-link(type="primary") {{ row.comment }}
        span(v-else) {{ row.comment }}

      template(v-slot:ip_address="{row}") {{ row.ip_address || '-' }}

      template(v-slot:status="{row}") {{ row.status ? 'Ok' : 'Не ok' }}

      template(v-slot:is_noticeable="{row}") {{ row.is_noticeable ? 'Да' : 'Не' }}

      template(v-slot:oper="{row}")
        el-button-group
          el-button(
            v-if="$perms.is_superuser"
            @click="openSitesDlg(row)"
          ) C
          el-button(
            icon='el-icon-lock'
            @click="openPermsDialog(row)"
            v-if="$perms.is_superuser"
          )
          el-button(
            icon="el-icon-edit"
            @click="openEdit(row)"
            :disabled="!$perms.devices.change_device"
          )
          el-button(
            type="danger" icon="el-icon-delete"
            @click="delDevice(row)"
            :disabled="!$perms.devices.delete_device"
          )

      el-button-group
        el-button(
          icon='el-icon-plus'
          @click="openNew"
          :disabled="!$perms.devices.add_device"
        ) Добавить устройство
        el-button(
          icon='el-icon-s-operation'
          @click="editFieldsVisible=true"
        ) Поля

    el-dialog(
      title="Железка"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    )
      dev-form(
        v-if="dialogVisible"
        v-on:done="frmDone"
        :localityId="localityId"
      )
    el-dialog(
      title="Добавить устройство"
      :visible.sync="dialogNewDev"
      :close-on-click-modal="false"
    )
      new-dev-form(
        v-if="dialogNewDev"
        v-on:done="frmNewDevDone"
        v-on:err="dialogNewDev=false"
        :initialAddress="localityId"
      )
    el-dialog(
      title="Кто имеет права на устройство"
      :visible.sync="permsDialog"
      top="5vh"
      :close-on-click-modal="false"
    )
      object-perms(
        v-on:save="changeDeviceObjectPerms"
        :getGroupObjectPermsFunc="getDeviceObjectPermsFunc4Grp"
        :getSelectedObjectPerms="deviceGetSelectedObjectPerms"
        :objId="$store.state.address.title"
      )

    el-dialog(
      title="Принадлежность оборудования сайтам"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false"
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
import { IObjectGroupPermsResultStruct, IObjectGroupPermsInitialAxiosResponsePromise } from '@/api/types'
import { AddressModule } from '@/store/modules/addresses/locality'

class DataTableComp extends DataTable<IDevice> {}

@Component({
  name: 'DevList',
  components: {
    DevForm,
    NewDevForm,
    datatable: DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }

  @Prop({ default: 0 }) private localityId!: number
  private dialogVisible = false
  private dialogNewDev = false
  private permsDialog = false
  private sitesDlg = false
  private editFieldsVisible = false
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'comment',
      label: 'Коммент',
      'min-width': 300
    },
    {
      prop: 'ip_address',
      label: 'IP Адрес',
      'min-width': 120
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
      prop: 'place',
      label: '№ дома'
    },
    {
      prop: 'create_time',
      label: 'Дата введения в эксплуатацию'
    },
    {
      prop: 'oper',
      label: 'Кнопки',
      'min-width': 195,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private openEdit(dev: IDevice) {
    DeviceModule.GetDevice(dev.id)
    this.dialogVisible = true
  }

  private async openNew() {
    await DeviceModule.RESET_ALL_DEV()
    this.dialogNewDev = true
  }

  private loadDevs(params: IDRFRequestListParametersDevGroup) {
    const newPrms = Object.assign(params, {
      address: this.localityId,
      fields: 'id,ip_address,comment,dev_type_str,mac_addr,status,is_noticeable,group,create_time,place'
    })
    return getDevices(newPrms)
  }

  private async delDevice(dev: IDevice) {
    this.$confirm(`Действительно удалить устройство "${dev.comment}"?`).then(async() => {
      await DeviceModule.DelDevice(dev.id)
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
    this.$router.push({
      name: 'device-view',
      params: {
        devId: newDev.id.toString()
      }
    })
  }

  // Breadcrumbs
  created() {
    document.title = `Оборудование - ${this.$store.state.address.title}`
    this.onGrpLoc(this.localityId)
  }

  @Watch('localityId')
  private async onGrpLoc(locId: number) {
    if (locId > 0) {
      await AddressModule.GetAddress(locId)
      await BreadcrumbsModule.SetCrumbs([
        {
          path: '/devices',
          meta: {
            hidden: true,
            title: 'Оборудование'
          }
        },
        {
          path: '',
          meta: {
            hidden: true,
            title: this.$store.state.address.title
          }
        }
      ] as any[])
    }
  }

  // End Breadcrumbs

  private async changeDeviceObjectPerms(info: IObjectGroupPermsResultStruct) {
    await setDevObjectsPerms(this.$store.state.address.title, info)
    this.permsDialog = false
  }

  private getDeviceObjectPermsFunc4Grp(): IObjectGroupPermsInitialAxiosResponsePromise {
    return getDevObjectsPerms(this.$store.state.address.title)
  }

  private openPermsDialog(d: IDevice) {
    DeviceModule.GetDevice(d.id)
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
      this.$message.success('Принадлежность оборудования сайтам сохранена')
    })
    this.sitesDlg = false
  }

  private openSitesDlg(dev: IDevice) {
    DeviceModule.GetDevice(dev.id)
    this.sitesDlg = true
  }
}
</script>
