<template lang="pug">
  el-button(
    size='mini'
    :type="pstate ? 'danger' : 'success'"
    :icon="pstate ? 'el-icon-remove' : 'el-icon-circle-plus'"
    :loading="loading"
    :disabled="isdis || !$perms.devices.can_toggle_ports"
    @click="togglePort"
    circle
  )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDevPortState, IScannedPort } from '@/api/devices/types'
import { PortModule } from '@/store/modules/devices/port'

@Component({
  name: 'SwitchPortToggleButton'
})
export default class extends Vue {
  @Prop({ default: null }) private port!: IScannedPort | null
  @Prop({ default: 0 }) private portId!: number
  private pstate = false
  private loading = false

  private togglePort() {
    if (!this.isdis) {
      if (this.pstate) {
        this.$confirm('Выключить порт? Отключится линк. Внимательно, не выключи uplink, иначе коммутатор потеряется').then(async() => {
          this.performToggle(true)
        })
      } else {
        this.performToggle(false)
      }
    }
  }

  private async performToggle(st: boolean) {
    this.loading = true
    await PortModule.SET_PORT_PK(this.portId)
    await PortModule.TogglePort(st ? IDevPortState.DOWN : IDevPortState.UP)
    this.pstate = !st
    this.loading = false
  }

  get isdis() {
    return this.port === null || this.portId === 0
  }

  created() {
    if (this.port !== null) {
      this.pstate = this.port.status
    }
  }
}
</script>
