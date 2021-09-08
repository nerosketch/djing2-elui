<template lang="pug">
  el-select(v-model='selectedPort')
    el-option(
      label='Не выбрано'
      :value='0'
    )
    template(v-if='devPorts && devPorts.length > 0')
      el-option(
        v-for="dp in devPorts"
        :key="dp.id"
        :label="`${dp.num}: ${dp.descr}`"
        :value="dp.id"
      )
    el-option(
      v-else
      label='Порты не загружены'
      :value='null'
    )
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { IPort } from '@/api/devices/types'
import { getPorts } from '@/api/devices/req'

@Component({
  name: 'SelectDevPort'
})
export default class extends Vue {
  @Prop({ default: 0 }) private value!: number
  @Prop({ default: 0 }) private deviceId!: number
  private devPorts: IPort[] = []
  private selectedPort = 0

  @Watch('selectedPort')
  private onChPort(portId: number) {
    if (portId > 0) {
      this.$emit('input', portId)
    } else {
      this.$emit('input', null)
    }
  }

  @Watch('value')
  protected onChVal(portId: number) {
    this.selectedPort = portId
  }

  @Watch('deviceId')
  protected onChDev(devId: number) {
    this.loadDevPorts(devId)
  }

  created() {
    this.loadDevPorts(this.deviceId)
    this.selectedPort = this.value
  }

  private async loadDevPorts(devId: number) {
    if (typeof devId === 'number' && devId > 0) {
      try {
        const { data } = await getPorts(devId)
        this.devPorts = data

        const fnd = this.devPorts.find(dp => dp.id === this.selectedPort)
        if (fnd) {
          this.selectedPort = fnd.id
        } else {
          this.selectedPort = 0
        }
      } catch (err) {
        this.$message.error(err)
      }
    } else {
      this.devPorts = []
      this.selectedPort = 0
    }
  }
}
</script>
