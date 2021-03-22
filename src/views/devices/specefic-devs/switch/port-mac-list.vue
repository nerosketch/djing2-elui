<template lang="pug">
  el-table(
    :data="macs"
    v-loading="macsLoading"
    empty-text="MAC адреса на порту не найдены"
    border fit size='small'
  )
    el-table-column(
      label="Название"
      min-width='200'
      prop='name'
    )
    el-table-column(
      label="VID"
      min-width='64'
      prop='vid'
    )
    el-table-column(
      label="MAC"
      min-width='121'
      prop='mac'
    )

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { PortModule } from '@/store/modules/devices/port'
import { IDevMacPort } from '@/api/devices/types'

@Component({
  name: 'PortMacList'
})
export default class extends Vue {
  @Prop({ default: 0 }) private portId!: number
  private macs: IDevMacPort[] = []
  private macsLoading = false

  created() {
    this.scanMacs()
  }

  @Watch('portId')
  private onPortCh(pid: number) {
    this.scanMacs(pid)
  }

  private async scanMacs(pid?: number) {
    if (pid === undefined) {
      pid = this.portId
    }
    if (pid > 0) {
      this.macsLoading = true
      try {
        this.macs = await PortModule.ScanMacAddressPort(pid)
        this.macsLoading = false
      } catch (err) {
        this.macsLoading = false
        this.$message.error(err)
      }
    } else {
      this.$message.error('Port id не передан')
    }
  }
}
</script>
