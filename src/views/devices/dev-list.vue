<template lang="pug">
  .app-container
    el-row(:gutter="10")
      el-col(:col="24")
        slot(name="filters")
          list-filters(
            :addrId="addrId"
            :group.sync="filterForm.group"
            :street.sync="filterForm.street"
            :house.sync="filterForm.house"
            :fetchGroups="fetchGroups")

      el-col(:lg="24" :md="20")
        datatable(
          :columns="tableColumns"
          :getData="loadDevs"
          :heightDiff="165"
          :editFieldsVisible.sync="editFieldsVisible"
          widthStorageNamePrefix="devs"
          ref="tbl")
          template(v-slot:comment="{row}")
            router-link.el-link.el-link--primary.is-underline(
              v-if="$perms.devices.view_device"
              :to="{name: 'device-view', params: { devId: row.id }}"
            ) {{ row.comment }}

            span(v-else) {{ row.comment }}

          template(v-slot:ip_address="{row}") {{ row.ip_address || '-' }}

          template(v-slot:status="{row}")
            boolean-icon(v-model="row.status")

          template(v-slot:is_noticeable="{row}")
            boolean-icon(v-model="row.is_noticeable")

          template(v-slot:oper="{row}")
            el-button-group
              el-button(v-if="$perms.is_superuser" @click="openSitesDlg(row)")
                | C

              el-button(
                icon="el-icon-lock"
                @click="openPermsDialog(row)"
                v-if="$perms.is_superuser")

              el-button(
                icon="el-icon-edit"
                @click="openEdit(row)"
                :disabled="!$perms.devices.change_device")

              el-button(
                type="danger"
                icon="el-icon-delete"
                @click="delDevice(row)"
                :disabled="!$perms.devices.delete_device")

          el-button-group
            el-button(
              icon="el-icon-plus"
              @click="openNew"
              :disabled="!$perms.devices.add_device")
              | {{ $t('addTheDevice') }}

            el-button(icon="el-icon-s-operation" @click="editFieldsVisible=true")
              | {{ $t('field') }}

    el-dialog(
      :title="$t('device')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      top="1%")
      dev-form(
        v-if="dialogVisible"
        v-on:done="frmDone"
        :addrId="addrId")

    el-dialog(
      :title="$t('addTheDevice')"
      :visible.sync="dialogNewDev"
      :close-on-click-modal="false"
      top="1%")
      new-dev-form(
        v-if="dialogNewDev"
        v-on:done="frmNewDevDone"
        v-on:err="dialogNewDev=false"
        :initialAddress="addrId")

    el-dialog(
      :title="$t('whoHasTheRightToTheDevice')"
      :visible.sync="permsDialog"
      top="5vh"
      :close-on-click-modal="false")
      object-perms(
        v-on:save="changeDeviceObjectPerms"
        :getGroupObjectPermsFunc="getDeviceObjectPermsFunc4Grp"
        :getSelectedObjectPerms="deviceGetSelectedObjectPerms"
        :objId="$store.state.address.title")

    el-dialog(
      :title="$t('maintenanceOfWebsiteEquipment')"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false")
      sites-attach(
        :selectedSiteIds="$store.state.devicemodule.sites"
        v-on:save="devSitesSave"
      )
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Watch
} from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceModule } from '@/store/modules/devices/device'
import {
  IDRFRequestListParametersDevGroup,
  IDevice
} from '@/api/devices/types'
import {
  getDevices,
  setDevObjectsPerms,
  getDevObjectsPerms,
  getDeviceSelectedObjectPerms,
  getGroupsWithDevices
} from '@/api/devices/req'
import DevForm from './dev-form.vue'
import NewDevForm from './new-dev-form.vue'
import DataTable, {
  IDataTableColumn,
  DataTableColumnAlign
} from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import {
  IObjectGroupPermsResultStruct,
  IObjectGroupPermsInitialAxiosResponsePromise,
  IDRFRequestListParameters
} from '@/api/types'
import { AddressModule } from '@/store/modules/addresses/address'
import BooleanIcon from '@/components/boolean-icon.vue'
import ListFilters from '@/components/Address/list-filters.vue'
import TableWithAddrMixin from '@/components/Address/table-w-addr-mixin'
import {
  IDRFRequestListFilterParameters
} from '@/api/addresses/types'

class DataTableComp extends DataTable<IDevice> {}

@Component({
  name: 'DevList',
  components: {
    DevForm,
    NewDevForm,
    datatable: DataTableComp,
    BooleanIcon,
    ListFilters
  }
})
export default class extends mixins(TableWithAddrMixin) {
  @Prop({ default: 0 }) private addrId!: number
  private dialogVisible = false
  private dialogNewDev = false
  private permsDialog = false
  private sitesDlg = false
  private editFieldsVisible = false
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'comment',
      label: this.$tc('comment'),
      'min-width': 300
    },
    {
      prop: 'ip_address',
      label: this.$tc('ipAddress'),
      'min-width': 120
    },
    {
      prop: 'dev_type_str',
      label: this.$tc('type'),
      'min-width': 150
    },
    {
      prop: 'mac_addr',
      label: this.$tc('macAddress'),
      'min-width': 150
    },
    {
      prop: 'status',
      label: this.$tc('devices.status')
    },
    {
      prop: 'is_noticeable',
      label: this.$tc('notices')
    },
    {
      prop: 'create_time',
      label: this.$tc('devices.createTime')
    },
    {
      prop: 'oper',
      label: this.$tc('buttons'),
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
    let newPrms: IDRFRequestListFilterParameters = Object.assign(params, {
      address: this.addrId,
      fields: 'id,ip_address,comment,dev_type_str,mac_addr,status,is_noticeable,group,create_time'
    })
    const group = this.$route.query.group
    if (group) {
      newPrms.group = Number(group)
    }
    if (this.$route.query) {
      newPrms = Object.assign(newPrms, this.$route.query)
    }
    return getDevices(newPrms)
  }

  private async delDevice(dev: IDevice) {
    this.$confirm(`Действительно удалить устройство "${dev.comment}"?`).then(async() => {
      await DeviceModule.DelDevice(dev.id)
      this.$message.success(this.$tc('deleted'))
      this.$refs.tbl.LoadTableData()
    })
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.tbl.LoadTableData()
  }

  private frmNewDevDone(newDev: IDevice) {
    this.dialogNewDev = false
    this.$message.success(this.$tc('newDeviceRetained'))
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
    this.onGrpLoc(this.addrId)
  }

  @Watch('addrId')
  private async onGrpLoc(locId: number) {
    if (locId > 0) {
      await AddressModule.GetAddress(locId)
      await BreadcrumbsModule.SetCrumbs([
        {
          path: '/devices',
          meta: {
            hidden: true,
            title: this.$tc('equipment')
          }
        },
        {
          path: '',
          meta: {
            hidden: true,
            title: this.$store.state.address.title
          }
        }
      ] as any)
    }
  }

  // End Breadcrumbs

  private async changeDeviceObjectPerms(info: IObjectGroupPermsResultStruct) {
    await setDevObjectsPerms(this.$store.state.address.title, info)
    this.permsDialog = false
  }

  private getDeviceObjectPermsFunc4Grp(): IObjectGroupPermsInitialAxiosResponsePromise {
    return getDevObjectsPerms(this.$store.state.address.id)
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
      this.$refs.tbl.LoadTableData()
      this.$message.success(this.$tc('facilitiesMaintained'))
    })
    this.sitesDlg = false
  }

  private openSitesDlg(dev: IDevice) {
    DeviceModule.GetDevice(dev.id)
    this.sitesDlg = true
  }

  private fetchGroups(params: IDRFRequestListParameters) {
    return getGroupsWithDevices(Object.assign(params, {}))
  }
}
</script>
