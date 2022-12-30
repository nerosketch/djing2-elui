<template lang="pug">
  .app-container
    template(v-if="ready")
      pon-onu(
        :device="device"
        v-if="[3,6,7,14].includes(device.dev_type)"
        v-on:reqrefresh="getDevice")

      pon-bdcom-olt(
        v-else-if="device.dev_type === 2"
        :device="device"
      )

      olt-zte(
        :device="device"
        v-else-if="device.dev_type === 5"
      )

      switch-view(:device="device" v-else)
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
import { IAddressModel } from '@/api/addresses/types'
import { getAddressByType } from '@/api/addresses/req'

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

  private localityDetail: IAddressModel | null = null

  private async getDevice() {
    this.ready = false
    try {
      const { data } = await DeviceModule.GetDevice(this.devId)
      this.device = data
      return data
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

  @Watch('localityDetail')
  private onChLocDet(lc: IAddressModel | null) {
    this.setCrumbs(lc)
  }

  @Watch('$store.state.devicemodule.address')
  private onChCustomerAddr(addrId: number) {
    if (addrId) {
      this.loadLocalityDetail(addrId, 4)
    }
  }

  private async loadLocalityDetail(addrId: number, addrType: number) {
    const { data } = await getAddressByType(addrId, addrType)
    this.localityDetail = data
  }

  created() {
    this.getDevice().then(dev => {
      if (dev) {
        document.title = dev.comment || dev.ip_address
        if (dev.address_id) {
          this.loadLocalityDetail(dev.address_id, 4)
        }
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
  private setCrumbs(addr: IAddressModel | null) {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/devices',
        meta: {
          hidden: true,
          title: this.$tc('equipment')
        }
      },
      addr
        ? {
            path: { name: 'devicesList', params: { addrId: addr.id } },
            meta: {
              hidden: true,
              title: addr.title
            }
          }
        : {
            path: '',
            meta: {
              hidden: true,
              title: '-'
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
  // End Breadcrumbs
}
</script>
