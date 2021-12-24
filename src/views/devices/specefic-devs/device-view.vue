<template>
  <div class="app-container">
    <template v-if="ready">
      <pon-onu :device="device" v-if="[3,6,7].includes(device.dev_type)" v-on:reqrefresh="getDevice"></pon-onu>
      <pon-bdcom-olt v-else-if="device.dev_type === 2" :device="device"></pon-bdcom-olt>
      <olt-zte :device="device" v-else-if="device.dev_type === 5"></olt-zte>
      <switch-view :device="device" v-else></switch-view>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { IDevice } from '@/api/devices/types'
import { DeviceModule } from '@/store/modules/devices/device'
import PonBdcomOlt from './pon/pon-bdcom-olt.vue'
import SwitchView from './switch-view.vue'
import PonOnu from './pon/pon-onu.vue'
import OltZte from './pon/gpon/olt-zte.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { AddressModule } from '@/store/modules/addresses/address'

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
    try {
      const { data } = await DeviceModule.GetDevice(this.devId)
      this.device = data
      return data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.ready = true
    }
  }

  private onKeyPress(ev: KeyboardEvent) {
    if (ev.keyCode === 116) {
      this.getDevice()
      ev.preventDefault()
    }
  }

  created() {
    this.getDevice().then(dev => {
      if (dev) {
        document.title = dev.comment || dev.ip_address
        this.onLocCh(dev.address)
      }
    })
    document.addEventListener('keydown', this.onKeyPress)
  }

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyPress)
  }

  @Watch('devId')
  private onDevIdChanged() {
    this.getDevice()
  }

  // Breadcrumbs
  @Watch('$store.state.devicemodule.address')
  private async onLocCh(addrId: number) {
    if (addrId > 0) {
      await AddressModule.GetAddress(addrId)
      await BreadcrumbsModule.SetCrumbs([
        {
          path: '/devices',
          meta: {
            hidden: true,
            title: this.$t('oborudovanie-1')
          }
        },
        {
          path: { name: 'devicesList', params: { addrId: addrId } },
          meta: {
            hidden: true,
            title: this.$store.state.address.title
          }
        },
        {
          path: '',
          meta: {
            hidden: true,
            title: DeviceModule.comment
          }
        }
      ] as any)
    }
  }
  // End Breadcrumbs
}
</script>
