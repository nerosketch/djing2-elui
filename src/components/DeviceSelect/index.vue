<template lang="pug">
  el-select(v-model='selectedDeviceId' size="mini" :disabled="devices.length == 0")
    el-option(
      v-for="dv in devices"
      :key="dv.pk"
      :label="`${dv.comment} ` + (dv.ip_address ? `(${dv.ip_address})` : '')"
      :value="dv.pk"
    )
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IDevice } from '@/api/devices/types'
import { getDevices } from '@/api/devices/req'

@Component({
  name: 'DeviceSelect'
})
export default class extends Vue {
  @Prop({ default: 0 }) private value!: number
  @Prop({ default: 0 }) private groupId!: number
  @Prop({ default: () => ({ pk: null, comment: 'Не выбрано' }) }) private initialDevice!: IDevice
  private devices: IDevice[] = []
  private selectedDeviceId = 0

  @Watch('selectedDeviceId')
  private onChDev(devId: number) {
    this.$emit('input', devId)
  }

  @Watch('value')
  protected onChVal(devId: number) {
    this.selectedDeviceId = devId
  }

  private addDevice(dev: IDevice) {
    const dv = this.devices.find(fd => fd.pk === dev.pk)
    if (dv === undefined) {
      this.devices.push(dev)
    }
  }

  @Watch('initialDevice')
  private onSPCh(dev: IDevice) {
    this.addDevice(dev)
  }

  created() {
    this.loadDevices()
    this.selectedDeviceId = this.value
    this.devices.push(this.initialDevice)
  }

  private async loadDevices() {
    try {
      const { data } = await getDevices({
        page: 1,
        page_size: 0,
        group: this.groupId,
        fields: 'pk,comment,ip_address'
      }) as any
      this.devices = data
    } catch (err) {
      this.$message.error(err)
    }
  }
}
</script>
