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
        device-select(v-model="frmMod.device" :groupId="groupId")
    el-row
      el-col(:span='8')
        b Порт устройства
      el-col(:span='16')
        selected-dev-port(v-model='frmMod.dev_port' :deviceId='frmMod.device')
    el-row
      el-col(:span='8')
        el-button-group
          el-button(type="primary" @click="onSubmit" :loading="isLoading" size="mini") Сохранить
          el-button(type="danger" icon="el-icon-delete" size="mini" @click="onClearDevice") Очистить
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { IPort, IDevice } from '@/api/devices/types'
import { CustomerModule } from '@/store/modules/customers/customer'
import { getPorts, getDevices } from '../../api/devices/req'
import DeviceSelect from '@/components/DeviceSelect/index.vue'
import SelectedDevPort from '@/components/DeviceSelect/selectDevPort.vue'

@Component({
  name: 'device',
  components: { DeviceSelect, SelectedDevPort }
})
export default class extends Vue {
  private isLoading = false

  private frmMod = {
    device: CustomerModule.device,
    dev_port: CustomerModule.dev_port
  }

  get onChId() {
    return CustomerModule.pk
  }
  @Watch('onChId')
  private onChangedId() {
    this.frmMod = {
      device: CustomerModule.device,
      dev_port: CustomerModule.dev_port
    }
  }

  get groupId() {
    return CustomerModule.group
  }

  private async onSubmit() {
    this.isLoading = true
    const newDat = await CustomerModule.PatchCustomer(this.frmMod)
    this.isLoading = false
    this.$emit('done', newDat)
  }

  private async onClearDevice() {
    this.isLoading = true
    const { data } = await CustomerModule.ClearDevice()
    this.frmMod.device = data.device
    this.frmMod.dev_port = data.dev_port
    this.$emit('done', data)
    this.isLoading = false
  }
}
</script>
