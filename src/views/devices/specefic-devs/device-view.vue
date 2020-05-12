<template lang="pug">
  .app-container
    template(v-if="ready")
      //- onu(:device="device" v-if="[3,6,7].includes(device.dev_type)")
      pon-bdcom-olt(
        v-if="device.dev_type === 2"
        :device="device"
      )
      //- olt-zte(:device="dev" v-else-if="dev.dev_type === 5")
      switch-view(:device="device" v-else)

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDevice } from '@/api/devices/types'
import { DeviceModule } from '@/store/modules/devices/device'
import PonBdcomOlt from './pon-bdcom-olt.vue'
import SwitchView from './switch-view.vue'

@Component({
  name: 'DeviceView',
  components: {
    PonBdcomOlt,
    SwitchView
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

  created() {
    this.getDevice()
  }
}
</script>
