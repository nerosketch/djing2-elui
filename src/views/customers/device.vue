<template lang="pug">
el-form(
  :model='frmMod'
  v-loading='isLoading'
)
  el-card(shadow="never")
    .clearfix(slot='header')
      span Устройство
    el-row
      el-col(:span='8')
        b Устройство
      el-col(:span='16')
        el-select.input-with-select(v-model='selectedDevice' size="mini")
          el-option(
            v-for="dv in devices"
            :key="dv.pk"
            :label="dv.comment"
            :value="dv.pk"
          )
    el-row
      el-col(:span='8')
        b Порт устройства
      el-col(:span='16')
        el-select(v-model='frmMod.dev_port' size="mini")
          el-option(
            v-for="dp in devPorts"
            :key="dp.pk"
            :label="dp.descr"
            :value="dp.pk"
          )
    el-row
      el-col(:span='8')
        el-button-group
          el-button(type="primary" @click="onSubmit" :loading="isLoading" size="mini") Сохранить
          el-button(type="danger" icon="el-icon-delete" size="mini" @click="onClearDevice") Очистить
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { IPort, IDevice } from '@/api/devices/types'
import { ICustomer } from '@/api/customers/types'
import { CustomerModule } from '@/store/modules/customers/customer'
import { getPorts, getDevices } from '../../api/devices/req'

@Component({
  name: 'device'
})
export default class extends Vue {

  private isLoading = false
  private devPorts: IPort[] = []
  private devices: IDevice[] = []
  private selectedDevice: number | null = null

  private frmMod: ICustomer = <ICustomer> {
    pk: CustomerModule.pk,
    device: CustomerModule.device,
    dev_port: CustomerModule.dev_port
  }

  private async loadDevPorts(devId: number) {
    this.isLoading = true
    const { data } = await getPorts(devId)
    this.devPorts = data.results
    this.isLoading = false
    
    if(!this.devPorts.find(dp => dp.device === devId)){
      this.frmMod.dev_port = null
    } else {
      this.frmMod.dev_port = CustomerModule.dev_port
    }
  }

  private async loadDevices() {
    this.isLoading = true
    const { data } = await getDevices({
      page: 1,
      page_size: 100,
      group: CustomerModule.group
    })
    this.devices = data.results
    this.selectedDevice = CustomerModule.device
    this.isLoading = false
  }

  created() {
    this.loadDevices()
    // this.loadDevPorts(CustomerModule.device)
  }

  @Watch('selectedDevice')
  private changedSelectedDevice(devId: number) {
    this.frmMod.device = devId
    this.loadDevPorts(devId)
  }

  private async onSubmit() {
    this.isLoading = true
    await CustomerModule.SET_ALL(this.frmMod)
    const newDat = await CustomerModule.SaveCustomer()
    this.isLoading = false
    this.$emit('done', newDat)
  }

  private async onClearDevice() {
    this.isLoading = true
    const newDat = await CustomerModule.ClearDevice()
    this.frmMod = newDat.data
    this.selectedDevice = newDat.data.device!
    this.$emit('done', newDat)
    this.isLoading = false
  }
}
</script>
