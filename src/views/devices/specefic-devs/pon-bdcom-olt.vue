<template lang="pug">
  el-card
    template(v-slot:header)
      .clearfix {{ device.comment || 'BDCOM' }}
        small {{ ` ${device.ip_address || device.mac_addr}` }}
    el-row(v-if="ready")
      el-col(
        :span="24"
        v-for="(fiber, i) in fibers"
        :key="i"
      )
        el-card(shadow="never")
          template(v-slot:header)
            .clearfix {{ fiber.fb_name }} ({{ fiber.fb_active_onu }}/{{ fiber.fb_onu_num }})
          el-table(
            :data="fiber.onuList"
            border fit size='small'
          )
            el-table-column(
              label="#"
              width="50"
            )
              template(v-slot:default="{row}")
                i.el-icon-success.el-alert--success.is-light(v-if="row.status")
                i.el-icon-error.el-alert--error.is-light(v-else)
            el-table-column(
              label="SNMP Ном."
              min-width="97"
            )
              template(v-slot:default="{row}") {{ row.number }}
            el-table-column(
              label="Имя"
              min-width="93"
            )
              template(v-slot:default="{row}") {{ row.title }}
            el-table-column(
              label="Мак"
              min-width="123"
            )
              template(v-slot:default="{row}") {{ row.mac_addr }}
            el-table-column(
              label="Ур. сигнала"
              min-width="92"
            )
              template(v-slot:default="{row}") {{ row.signal }}
            el-table-column(
              label="В сети"
              min-width="151"
            )
              template(v-slot:default="{row}") {{ row.uptime }}
            el-table-column(
              label='#'
              width='60'
              align='center'
            )
              template(v-slot:default="{row}")
                el-button(size='mini' icon='el-icon-plus' circle @click="openSaveOnu(row)")
    el-progress.disable_animations(
      v-else
      :percentage="loadPercent"
    )
    el-dialog(
      title="Добавить ONU"
      :visible.sync="dialogVisible"
    )
      new-dev-form(
        v-if="dialogVisible"
        v-on:done="frmDone"
        v-on:err="frmErr"
        :initialMac="currentOnu.mac_addr"
        :initialDevType="onuType"
        :initialGroup="device.group"
        :initialSnmpSxtra="currentOnu.number"
      )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { scanOnuList, scanOltFibers } from '@/api/devices/req'
import { IScannedONU, IDevFiber, IDevice, IDeviceTypeEnum } from '@/api/devices/types'
import NewDevForm from '../new-dev-form.vue'

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

  private fetchItems() {
    if (this.device) {
      return scanOnuList(this.device.pk, (c: ProgressEvent) => {
        this.loadPercent = Math.floor((100 * c.loaded) / c.total)
      }).then(({ data }) => {
        for (const line of data.split('\n')) {
          try {
            let onu = JSON.parse(line) as IScannedONU
            const fibIndex = this.fibers.findIndex((fb: IDevFiber) => fb.fb_id === onu.fiberid)
            if (fibIndex !== undefined) {
              this.fibers[fibIndex].onuList.push(onu)
            }
          } catch (e) {
            continue
          }
        }
        this.ready = true
      })
    }
    return new Promise((r) => (r()))
  }

  private fetchFibers() {
    if (this.device) {
      return scanOltFibers(this.device.pk).then(({ data }) => {
        for (const fib of data) {
          this.fibers.push(Object.assign({ onuList: [] }, fib) as IDevFiberLocal)
        }
      })
    }
    return new Promise((r) => (r()))
  }

  private loadAll() {
    this.loading = true
    this.ready = false
    if (this.device) {
      return this.fetchFibers().then(() => {
        this.fetchItems()
      }).finally(() => {
        this.loading = false
      })
    }
    throw new Error('devId is required')
  }

  created() {
    this.loadAll()
  }

  private frmDone(newOnu: IDevice) {
    this.dialogVisible = false
    this.$message.success('Новая onu сохранена')
    this.$router.push({ name: 'device-view',
      params: {
        devId: newOnu.pk.toString()
      } })
  }
  private frmErr(err: Error) {
    this.dialogVisible = false
  }

  private openSaveOnu(onu: IScannedONU) {
    this.currentOnu = onu
    this.dialogVisible = true
  }
}
</script>

<style>
.disable_animations * {
  transition: none !important;
}
</style>
