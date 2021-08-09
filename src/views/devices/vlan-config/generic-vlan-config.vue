<template lang="pug">
  el-row.mt5.mb5
    el-col(:span="1")
      el-button(
        type="success"
        icon="el-icon-plus"
        size='mini'
        circle
        :disabled="!$perms.networks.view_vlanif"
        @click="openAddVlanDialog()"
      )
    el-col(:span="3" v-for="(v, i) in portVlanConf.vids" :key="i")
      el-tooltip.item(
        :content="calcVlanTitleByVid(v.vid)"
        placement="top"
      )
        el-button-group
          el-button.onuvlan_miniwidth(
            :type='v.native ? "info" : "primary"'
            size='mini'
            @click="changeVlanMode(v)"
          ) {{ v.native ? 'A' : 'T' }}
          el-button(size='mini') {{ v.vid }}
          el-button.onuvlan_miniwidth(
            type='danger'
            size='mini'
            icon='el-icon-close'
            @click="vlanRemove(v)"
          )
  
    el-dialog(
      :visible.sync="addVlanVisible"
      title="Добавить vlan на порт"
      :close-on-click-modal="false"
    )
      keep-alive
        add-vlan(
          v-on:done="addVlanDone"
          :vlans="vlans"
        )
</template>

<script lang="ts">
import { IDevOnuVlan, IDevOnuVlanInfo } from '@/api/devices/types'
import { IVlanIf } from '@/api/networks/types'
import { Component, Prop, Vue } from 'vue-property-decorator'
import AddVlan from './add-vlan.vue'

const multipleAccessVlanMsg = 'Порт не может содержать больше одного access vlan'

@Component({
  name: 'GenericVlanConfig',
  components: {
    AddVlan
  }
})
export default class extends Vue {
  @Prop({ required: true })
  private portVlanConf!: IDevOnuVlanInfo

  @Prop({ required: true })
  protected vlans!: IVlanIf[]

  private addVlanVisible = false

  private calcVlanTitleByVid(vid: number) {
    const vlan = this.vlans.find(v => v.vid === vid)
    if (vlan) {
      return vlan.title
    }
    return undefined
  }

  private changeVlanMode(v: IDevOnuVlan) {
    if (!v.native && this.nativeVlanCount > 0) {
      this.$message.error(multipleAccessVlanMsg)
      return
    }
    v.native = !v.native
    this.$message.success('Изменён режим Trunk/Success')
  }

  private vlanRemove(remVlan: IDevOnuVlan) {
    this.$confirm('Удалить vlan с порта?').then(() => {
        const confIndex = this.portVlanConf.vids.findIndex(v => v.vid === remVlan.vid)
        if (confIndex > -1) {
          this.portVlanConf.vids.splice(confIndex, 1)
          this.$message.success(`Влан ${remVlan.vid} удалён с порта №${this.portVlanConf.port}`)
        } else {
          this.$message.error('Не найден vid=' + remVlan.vid)
        }
    })
  }

  get nativeVlanCount() {
    return this.portVlanConf.vids.filter(v => v.native).length
  }

  private isVlanExists(vid: number) {
    const r = this.portVlanConf.vids.filter(pvc => pvc.vid === vid)
    return r.length > 0
  }

  private openAddVlanDialog() {
    this.addVlanVisible = true
  }

  private addVlanDone(obj: IDevOnuVlan) {
    if (this.isVlanExists(obj.vid)) {
      this.$message.error('Порт должен содержать уникальные vlan')
      return
    }
    if (obj.native && this.nativeVlanCount > 0) {
      this.$message.error(multipleAccessVlanMsg)
      return
    }
    this.portVlanConf.vids.push(obj)
    // this.$emit('update:portVlanConf', this.portVlanConf)
  }
}
</script>

<style>
.onuvlan_miniwidth{
  padding: 7px 3px;
}
</style>
