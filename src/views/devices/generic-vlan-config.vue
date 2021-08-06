<template lang="pug">
  el-col(:span="4" v-for="(v, i) in portVlanConf.vids" :key="i")
    el-tooltip.item(
      :content="calcVlanTitleByVid(v.vid)"
      placement="top"
    )
      el-button-group
        el-button.onuvlan_miniwidth(
          :type='v.native ? "info" : "primary"'
          size='mini'
          @click="changeVlanMode(portVlanConf.port, v)"
        ) {{ v.native ? 'A' : 'T' }}
        el-button(size='mini') {{ v.vid }}
        el-button.onuvlan_miniwidth(
          type='danger'
          size='mini'
          icon='el-icon-close'
          @click="vlanRemove(portVlanConf.port, v)"
        )
</template>

<script lang="ts">
import { IDevOnuVlan, IDevOnuVlanInfo } from '@/api/devices/types'
import { IVlanIf } from '@/api/networks/types'
import { Component, Prop, Vue } from 'vue-property-decorator'

const multipleAccessVlanMsg = 'Порт не может содержать больше одного access vlan'

@Component({
  name: 'GenericVlanConfig'
})
export default class extends Vue {
  @Prop({ required: true })
  private portVlanConf!: IDevOnuVlanInfo

  @Prop({ required: true })
  protected vlans!: IVlanIf[]

  private calcVlanTitleByVid(vid: number) {
    const vlan = this.vlans.find(v => v.vid === vid)
    if (vlan) {
      return vlan.title
    }
    return undefined
  }

  private changeVlanMode(portNum: number, v: IDevOnuVlan) {
    if (!v.native && this.nativeVlanCount(portNum) > 0) {
      this.$message.error(multipleAccessVlanMsg)
      return
    }
    v.native = !v.native
    this.$message.success('Изменён режим Trunk/Success')
  }

  private vlanRemove(portNum: number, remVlan: IDevOnuVlan) {
    this.$confirm('Удалить vlan с порта?').then(() => {
        const confIndex = this.portVlanConf.vids.findIndex(v => v.vid === remVlan.vid)
        if (confIndex > -1) {
          this.portVlanConf.vids.splice(confIndex, 1)
          this.$message.success(`Влан ${remVlan.vid} удалён с порта №${portNum}`)
        } else {
          this.$message.error('Не найден vid=' + remVlan.vid)
        }
    })
  }

  private nativeVlanCount() {
    const r = this.portVlanConf.vids.filter(v => v.native)
    return r.length
  }

  private isVlanExists(vid: number) {
    const r = this.portVlanConf.vids.filter(pvc => pvc.vid === vid)
    return r.length > 0
  }
}
</script>

<style>
.onuvlan_miniwidth{
  padding: 7px 3px;
}
</style>
