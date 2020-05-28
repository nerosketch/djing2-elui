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
import { Component, Vue, Prop } from 'vue-property-decorator'
import { registerDevice } from '@/api/devices/req'
import { IDevice } from '@/api/devices/types'
import { DeviceModule } from '../../../store/modules/devices/device'

@Component({
  name: 'RegisterDeviceBtn'
})
export default class extends Vue {
  @Prop({ default: null }) private device!: IDevice | null

  private btnText = 'Зарегистрировать устройство'
  private btnType = ''
  private loading = false

  private setResState(text: string, bState: string, timeout = 3000) {
    let initTxt = this.btnText
    this.btnText = text
    this.btnType = bState
    let tm = setTimeout(() => {
      this.btnText = initTxt
      this.btnType = ''
    }, timeout)
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
