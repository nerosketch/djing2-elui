<template lang="pug">
  el-button(
    :type="portStateGetter ? 'danger' : 'success'"
    :icon="portStateGetter ? 'el-icon-remove' : 'el-icon-circle-plus'"
    :loading="loading"
    :disabled="isdis || !$perms.devices.can_toggle_ports"
    @click="togglePort"
    circle)
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
  private loading = false

  private togglePort() {
    if (!this.isdis) {
      if (this.portStateGetter) {
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
    await PortModule.TogglePort({
      port_state: st ? IDevPortState.DOWN : IDevPortState.UP,
      port_snmp_num: this.port ? this.port.snmp_num : 0
    })
    this.loading = false
  }

  get isdis() {
    return this.port === null || this.portId === 0
  }

  get portStateGetter(): boolean {
    if (this.port) {
      return this.port.status
    }
    return false
  }
}
</script>
