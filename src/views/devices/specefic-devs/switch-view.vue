<template lang="pug">
  .app-container
    pon-bdcom-olt(
      v-if="ready"
      :device="device"
      :devId="devId"
      :devTitle="devTitle"
    )
    //- el-row
    //-   el-col(:span="24")
    //-     el-card.box-card
    //-       template(v-slot:header)
    //-         .clearfix
    //-           span Свич XXX. Время работы X дней
    //-       el-row
    //-         el-col(:span='2').text.item(
    //-           v-for="(port, i) in ports"
    //-           :key="i"
    //-         )
    //-           el-card.box-card.port
    //-             .center { { port.num } }
    //-             el-button-group
    //-               el-button(type="primary" size="mini" icon="el-icon-check")
    //-               el-button(type="primary" size="mini" icon="el-icon-poweroff")
    //-   el-col(:span='12')
    //-     el-card.box-card
    //-       template(v-slot:header)
    //-         .clearfix
    //-           span Управление портами
    //-       el-table(:data="ports" size='mini' fit)
    //-         el-table-column(
    //-           prop='num'
    //-           label='Номер'
    //-         )
    //-         el-table-column(
    //-           prop='descr'
    //-           label='Описание'
    //-         )
    //-         el-table-column(
    //-           prop='user_count'
    //-           label='Сколько абонов'
    //-         )

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { IPort, IScannedPort, IDevice } from '@/api/devices/types'
import { getPorts } from '@/api/devices/req'
import { DeviceModule } from '@/store/modules/devices/device'
import PonBdcomOlt from './pon-bdcom-olt.vue'

@Component({
  name: 'SwitchView',
  components: {
    PonBdcomOlt
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private devId!: number
  @Prop({ default: null }) private devTitle!: string

  private ports: IPort[] = []
  private scannedPorts: IScannedPort[] = []
  private device: IDevice | null = null
  private ready = false

  get devType() {
    return DeviceModule.dev_type
  }

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
