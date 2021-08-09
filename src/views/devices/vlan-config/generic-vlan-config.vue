<template lang="pug">
  el-row.mt5.mb5
    el-col(:span="1")
      el-popover(
        width='400'
        trigger="click"
      )
        el-select(v-model="addVlanFrmMod.vid" size='mini')
          el-option(
            v-for="v in vlans"
            :key="v.id"
            :label="`${v.title} [${v.vid}]`"
            :value="v.vid"
          )
        el-divider
        el-switch(
          v-model="addVlanFrmMod.native"
          active-text="Access"
          inactive-text="Trunk"
        )
        el-divider(direction="vertical")
        el-button(
          type="success"
          icon='el-icon-plus'
          size='mini'
          @click="onAddVidToPort"
        ) Добавить

        el-button(
          slot='reference'
          type="success"
          icon="el-icon-plus"
          size='mini'
          circle
        )

    el-col(:span="3" v-for="(v, i) in portVlanConf.vids" :key="i")
      //- el-tooltip.item(
      //-   :content="calcVlanTitleByVid(v.vid)"
      //-   placement="top"
      //- )
      el-button-group
        el-button.btn_miniwidth(
          :type='v.native ? "info" : "primary"'
          size='mini'
          @click="changeVlanMode(v)"
        ) {{ v.native ? 'A' : 'T' }}
        el-button(size='mini') {{ v.vid }}
        el-button.btn_miniwidth(
          type='danger'
          size='mini'
          icon='el-icon-close'
          @click="vlanRemove(v)"
        )

</template>

<script lang="ts">
import { IDevVlanSimple, IDevVlanSimpleInfo } from '@/api/devices/types'
import { IVlanIf } from '@/api/networks/types'
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import VlanMixin from '@/views/networks/components/vlan-mixin'

const multipleAccessVlanMsg = 'Порт не может содержать больше одного access vlan'

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
    this.$message.success('Изменён режим Trunk/Success')
  }

  private vlanRemove(remVlan: IDevVlanSimple) {
    const confIndex = this.portVlanConf.vids.findIndex(v => v.vid === remVlan.vid)
    if (confIndex > -1) {
      this.portVlanConf.vids.splice(confIndex, 1)
      this.$message.success(`Влан ${remVlan.vid} удалён с порта №${this.portVlanConf.port}`)
    } else {
      this.$message.error('Не найден vid=' + remVlan.vid)
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
      this.$message.error('Порт должен содержать уникальные vlan')
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