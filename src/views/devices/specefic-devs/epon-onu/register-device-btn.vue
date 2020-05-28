<template lang="pug">
  el-button(
    size='mini'
    icon='el-icon-s-tools'
    :type="btnType"
    @click="regOnu"
    :loading="loading"
  ) {{ btnText }}
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { registerDevice } from '@/api/devices/req'
import { IDevice } from '@/api/devices/types'
import { DeviceModule } from '@/store/modules/devices/device'
import BtnShareMixin from './btn-share-mixin'

@Component({
  name: 'RegisterDeviceBtn'
})
export default class extends mixins(BtnShareMixin) {
  @Prop({ default: null }) private device!: IDevice | null

  created() {
    this.btnText = 'Зарегистрировать устройство'
  }

  private async regOnu() {
    if (this.device !== null) {
      this.loading = true
      const { data } = await registerDevice(this.device.pk)
      if (data.status === 1) {
        this.setResState(data.text, 'success', 5000)
        DeviceModule.GetDevice(this.device.pk)
      } else {
        this.setResState(data.text, 'danger')
      }
    } else {
      this.setResState('В кнопку не передано устройство', 'danger')
    }
    this.loading = false
  }
}
</script>
