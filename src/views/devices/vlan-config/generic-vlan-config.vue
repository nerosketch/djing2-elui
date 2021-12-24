<template lang="pug">
  el-row.mt5.mb5
    el-col(:span="1")
      el-popover(width="400", trigger="click")
        el-select(v-model="addVlanFrmMod.vid")
          el-option(
            v-for="v in vlans"
            :key="v.id"
            :label="$t('v-title-v-vid', [v.title, v.vid])"
            :value="v.vid")
      
        el-divider
      
        el-switch(
          v-model="addVlanFrmMod.native"
          active-text="Access"
          inactive-text="Trunk")
      
        el-divider(direction="vertical")
      
        el-button(
          type="success"
          icon="el-icon-plus"
          @click="onAddVidToPort")
          | {{ $t('add') }}
      
        el-button(
          slot="reference"
          type="success"
          icon="el-icon-plus"
          circle)
  
    el-col(
      :span="3"
      v-for="(v, i) in portVlanConf.vids"
      :key="i")
      el-button-group
        el-button.btn_miniwidth(
          :type="v.native ? 'info' : 'primary'"
          @click="changeVlanMode(v)"
        ) {{ v.native ? 'A' : 'T' }}
      
        el-button {{ v.vid }}
      
        el-button.btn_miniwidth(
          type="danger"
          icon="el-icon-close"
          @click="vlanRemove(v)"
        )
</template>

<script lang="ts">
import { IDevVlanSimple, IDevVlanSimpleInfo } from '@/api/devices/types'
import { IVlanIf } from '@/api/networks/types'
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import VlanMixin from '@/views/networks/components/vlan-mixin'

const multipleAccessVlanMsg = this.$t('port-ne-mozhet-soderzhat-bolshe-odnogo-access-vlan')

@Component({
  name: 'GenericVlanConfig'
})
export default class extends mixins(VlanMixin) {
  @Prop({ required: true })
  private portVlanConf!: IDevVlanSimpleInfo

  @Prop({ default: () => ([]) })
  private allVlans!: IVlanIf[]

  private addVlanFrmMod: IDevVlanSimple = {
    vid: 1,
    native: false
  }

  private changeVlanMode(v: IDevVlanSimple) {
    if (!v.native && this.nativeVlanCount > 0) {
      this.$message.error(multipleAccessVlanMsg)
      return
    }
    v.native = !v.native
    this.$message.success(this.$t('izmenyon-rezhim-trunk-success'))
  }

  private vlanRemove(remVlan: IDevVlanSimple) {
    const confIndex = this.portVlanConf.vids.findIndex(v => v.vid === remVlan.vid)
    if (confIndex > -1) {
      this.portVlanConf.vids.splice(confIndex, 1)
      this.$message.success(`Влан ${remVlan.vid} удалён с порта №${this.portVlanConf.port}`)
    } else {
      this.$message.error(this.$t('ne-naiden-vid') + ' ' + remVlan.vid)
    }
  }

  get nativeVlanCount() {
    return this.portVlanConf.vids.filter(v => v.native).length
  }

  private isVlanExists(vid: number) {
    const r = this.portVlanConf.vids.filter(pvc => pvc.vid === vid)
    return r.length > 0
  }

  private onAddVidToPort() {
    const obj = this.addVlanFrmMod
    if (this.isVlanExists(obj.vid)) {
      this.$message.error(this.$t('port-dolzhen-soderzhat-unikalnye-vlan'))
      return
    }
    if (obj.native && this.nativeVlanCount > 0) {
      this.$message.error(multipleAccessVlanMsg)
      return
    }
    this.portVlanConf.vids.push(JSON.parse(JSON.stringify(obj)))
  }

  created() {
    if (this.allVlans.length > 0) {
      this.vlans = this.allVlans
    } else {
      this.loadVlans()
    }
  }
}
</script>

<style scoped>
.btn_miniwidth{
  padding: 7px 3px;
}
</style>
