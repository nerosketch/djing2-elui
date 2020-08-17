<template lang="pug">
  .app-container
    template(v-if="ready")
      pon-onu(
        :device="device"
        v-if="[3,6,7,12].includes(device.dev_type)"
        v-on:reqrefresh="getDevice"
      )
      pon-bdcom-olt(
        v-else-if="device.dev_type === 2"
        :device="device"
      )
      olt-zte(:device="device" v-else-if="device.dev_type === 5")
      switch-view(:device="device" v-else)

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { IDevice } from '@/api/devices/types'
import { DeviceModule } from '@/store/modules/devices/device'
import PonBdcomOlt from './pon-bdcom-olt.vue'
import SwitchView from './switch-view.vue'
import PonOnu from './pon-onu.vue'
import OltZte from './gpon/olt-zte.vue'

@Component({
  name: 'DeviceView',
  components: {
    PonBdcomOlt,
    SwitchView,
    PonOnu,
    OltZte
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private devId!: number

  private device: IDevice | null = null
  private ready = false

  private async getDevice() {
    this.ready = false
    const { data } = await DeviceModule.GetDevice(this.devId)
    this.device = data
    this.ready = true
  }

  private onKeyPress(ev: KeyboardEvent) {
    if (ev.keyCode === 116) {
      this.getDevice()
      ev.preventDefault()
    }
  }

  created() {
    this.getDevice()
    document.addEventListener('keydown', this.onKeyPress)
  }

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyPress)
  }

  @Watch('devId')
  private onDevIdChanged(id: number) {
    this.getDevice()
  }
}
</script>
