<template lang="pug">
  el-card
    template(#header)
      .clearfix {{ device.comment || 'BDCOM' }}

        small {{ ` ${device.ip_address || device.mac_addr} ` }}

        router-link.el-link.el-link--primary.is-underline(:to="{name: 'device-view', params: { devId: device.parent_dev }}")
          | [{{ device.parent_dev_name }}]

    el-row(v-if="ready")
      el-col(
        :span="24"
        v-for="(fiber, i) in fibers"
        :key="i")
        el-card(shadow="never")
          template(#header)
            .clearfix
              | {{ fiber.fb_name }} ({{ fiber.fb_active_onu }}/{{ fiber.fb_onu_num }})

          el-table(
            :data="fiber.onuList"
            border
            fit)
            el-table-column(label="#" width="50")
              template(#default="{row}")
                i.el-icon-success.el-alert--success.is-light(v-if="row.status")

                i.el-icon-error.el-alert--error.is-light(v-else)

            el-table-column(
              :label="$t('devices.snmpNum')"
              min-width="97"
              prop="number")

            el-table-column(
              :label="$t('name')"
              min-width="93"
              prop="title")

            el-table-column(
              :label="$t('devices.mac')"
              min-width="123"
              prop="mac_addr")

            el-table-column(
              :label="$t('devices.level')"
              min-width="92"
              prop="signal")

            el-table-column(
              :label="$t('devices.uptime')"
              min-width="151"
              prop="uptime")

            el-table-column(
              label="#"
              width="60"
              align="center")
              template(#default="{row}")
                el-button(
                  icon="el-icon-plus"
                  circle
                  @click="openSaveOnu(row)"
                  :disabled="!$perms.devices.add_device")

    el-progress.progress_disable_animations(v-else :percentage="loadPercent")

    el-dialog(
      :title="$t('addIt')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false")
      new-dev-form(
        v-if="dialogVisible"
        v-on:done="frmDone"
        v-on:err="frmErr"
        :initialMac="currentOnu.mac_addr"
        :initialDevType="onuType"
        :initialGroup="device.group"
        :initialSnmpSxtra="currentOnu.number"
        :initialParentDev="device.id"
        :initialParentDevName="`${device.ip_address} ${device.comment}`")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { scanOnuList, scanOltFibers } from '@/api/devices/req'
import { IScannedONU, IDevFiber, IDevice, IDeviceTypeEnum } from '@/api/devices/types'
import NewDevForm from '@/views/devices/new-dev-form.vue'

interface IDevFiberLocal extends IDevFiber {
  onuList: IScannedONU[]
}

@Component({
  name: 'PonBdcomOlt',
  components: {
    NewDevForm
  }
})
export default class extends Vue {
  @Prop({ default: null }) private device!: IDevice | null
  private loading = false
  private ready = false
  private loadPercent = 0
  private fibers: IDevFiberLocal[] = []
  private dialogVisible = false
  private currentOnu: IScannedONU | null = null
  private onuType = IDeviceTypeEnum.EPON_BDCOM_FORA

  private async fetchItems() {
    if (this.device) {
      const { data } = await scanOnuList(this.device.id, (c: ProgressEvent) => {
        this.loadPercent = Math.floor((100 * c.loaded) / c.total)
      })
      let newData
      if (typeof data === 'string') {
        newData = data.trim().split('\n').map(k => JSON.parse(k))
      } else {
        newData = [data]
      }
      for (const line of newData) {
        try {
          // let onu = JSON.parse(line) as IScannedONU
          const fibIndex = this.fibers.findIndex((fb: IDevFiber) => fb.fb_id === line.fiberid)
          if (fibIndex !== undefined) {
            this.fibers[fibIndex].onuList.push(line)
          }
        } catch (e) {
          continue
        }
      }
      this.ready = true
    }
  }

  private async fetchFibers() {
    if (this.device) {
      await scanOltFibers(this.device.id).then(({ data }) => {
        this.fibers = data.map(fib => Object.assign({ onuList: [] }, fib))
      })
    }
  }

  private loadAll() {
    this.loading = true
    this.ready = false
    if (this.device) {
      this.fetchFibers().then(() => {
        this.fetchItems()
      }).finally(() => {
        this.loading = false
      })
    }
  }

  created() {
    this.loadAll()
  }

  private frmDone(newOnu: IDevice) {
    this.dialogVisible = false
    this.$message.success(this.$tc('theNewONUIsSaved'))
    this.$router.push({
      name: 'device-view',
      params: {
        devId: newOnu.id.toString()
      }
    })
  }

  private frmErr() {
    this.dialogVisible = false
  }

  private openSaveOnu(onu: IScannedONU) {
    this.currentOnu = onu
    this.dialogVisible = true
  }
}
</script>
