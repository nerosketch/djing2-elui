<template lang="pug">
  el-select.input-with-select(v-model='selectedDevice' size="mini")
    el-option(
      v-for="dv in devices"
      :key="dv.pk"
      :label="dv.comment"
      :value="dv.pk"
    )
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IDevice } from '@/api/devices/types'
import { getDevices } from '@/api/devices/req'

@Component({
  name: 'DeviceSelect'
})
export default class extends Vue {
  @Prop({ default: 0 }) private value!: number
  @Prop({ default: 0 }) private groupId!: number
  private devices: IDevice[] = []
  private selectedDevice = 0

  @Watch('selectedDevice')
  private onChDev(devId: number) {
    this.$emit('input', devId)
  }

  @Watch('value')
  protected onChVal(devId: number) {
    this.selectedDevice = devId
  }

  created() {
    this.loadDevices()
    this.selectedDevice = this.value
  }

  private async loadDevices() {
    const { data } = await getDevices({
      page: 1,
      page_size: 100,
      group: this.groupId
    })
    this.devices = data.results
  }
}
</script>
