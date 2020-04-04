<template lang="pug">
  .app-container
    el-row
      el-col(:span="24")
        el-card.box-card
          div.clearfix(slot="header")
            span Свич XXX. Время работы X дней
          el-row
            el-col(:span='2').text.item(
              v-for="(port, i) in ports"
              :key="i"
            )
              el-card.box-card.port
                .center {{ port.num }}
                el-button-group
                  el-button(type="primary" size="mini" icon="el-icon-check")
                  el-button(type="primary" size="mini" icon="el-icon-poweroff")
      el-col(:span='12')
        el-card.box-card
          .clearfix(slot="header")
            span Управление портами
          el-table(:data="ports" :size='mini' fit)
            el-table-column(
              prop='num'
              label='Номер'
            )
            el-table-column(
              prop='descr'
              label='Описание'
            )
            el-table-column(
              prop='user_count'
              label='Сколько абонов'
            )

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { IPort, IScannedPort } from '@/api/devices/types'
import { getPorts } from '@/api/devices/req'
import { DeviceModule } from '@/store/modules/devices/device'

@Component({
  name: 'switch-view'
})
export default class extends Vue {
  @Prop({ default: 0 }) private devId!: number
  @Prop({ default: 0 }) private devType!: number

  private ports: IPort[] = []
  private scannedPorts: IScannedPort[] = []

  created() {
    this.getScannedPorts()
    this.getPorts(this.devId)
  }

  private async getScannedPorts() {
    this.scannedPorts = await DeviceModule.ScanPorts(this.devId)
  }

  private async getPorts(devId: number) {
    const { data } = await getPorts(devId)
    this.ports = data.results
  }
}
</script>

<style>
.port {
  flex-direction: column;
  align-items: center;
  margin: 3px;
  border: 1px solid #7B7B7B;
  border-radius: 3px;
}
.el-table th, .el-table td {
  padding: 0 !important;
}
</style>
