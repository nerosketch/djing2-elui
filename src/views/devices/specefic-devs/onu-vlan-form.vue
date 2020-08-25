<template lang="pug">
  el-card(shadow='never')
    template(v-slot:header)
      span Варианты конфигурации на ONU

    span Шаблон конфига для ONU
    el-select(v-model="configTypeCode" size='mini' placeholder="Шаблон конфига")
      el-option(
        :value='v.code'
        :label='v.title'
        v-for="(v, i) in configTypeCodes"
        :key="i"
      )
    //- p configTypeCode { { configTypeCode }}
    //- p configTypeCodes { { configTypeCodes }}
    //- p portNum { { portNum }}
    //- p vlans { { vlans }}
    //- p currentVlanConfig { { currentVlanConfig }}

    el-card.box-card.onuvlan_miniheader(
      shadow='never'
      v-for="portVlanConf in currentVlanConfig"
      :key="portVlanConf.port"
    )
      template(v-slot:header)
        el-link(
          style="float: right"
          size='mini'
          icon='el-icon-close'
          type='danger'
          @click="delVlanPort(portVlanConf.port)"
        )
        | Vlan на порт №{{ portVlanConf.port }}
      el-row
        el-col(:span="4" v-for="(v, i) in portVlanConf.vids" :key="i")
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
                @click="vlanRemove(portVlanConf.port, v)"
              )

      el-button(
        type="success"
        icon="el-icon-plus"
        size='mini'
        circle
        @click="openAddVlanDialog(portVlanConf.port)"
      )

    el-button-group
      el-button(
        type="primary"
        icon="el-icon-download"
        @click="onSubmit"
        :loading="loading"
        size='mini'
      ) Применить

    el-dialog(
      :visible.sync="addVlanVisible"
      title="Добавить vlan на порт"
    )
      keep-alive
        add-vlan(
          v-on:done="addVlanDone"
        )
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { mixins } from 'vue-class-component'
import VlanMixin from '@/views/networks/components/vlan-mixin'
import { DeviceModule } from '@/store/modules/devices/device'
import { IDevConfigChoice, IDevOnuVlanInfo, IDevOnuVlan } from '@/api/devices/types'
import { readOnuVlanInfo } from '@/api/devices/req'
import AddVlan from './add-vlan.vue'

@Component({
  name: 'OnuVlanForm',
  components: { AddVlan }
})
export default class extends mixins(VlanMixin) {
  private addVlanVisible = false
  private configTypeCode = this.devCodeGetter
  private configTypeCodes: IDevConfigChoice[] = []
  private portNum = 0
  private currentVlanConfig: IDevOnuVlanInfo[] = []
  private currentAddVlanPort = 0

  created() {
    this.loadVlans()
    this.getDevConfigTypes()
    this.scanDevOnuVlan()
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.$message.success('Типо сохранил')
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private vlanRemove(portNum: number, remVlan: IDevOnuVlan) {
    this.$confirm('Удалить vlan с порта?').then(() => {
      const confObj = this.currentVlanConfig.find(v => v.port === portNum)
      if (confObj) {
        const confIndex = confObj.vids.findIndex(v => v.vid === remVlan.vid)
        if (confIndex > -1) {
          confObj.vids.splice(confIndex, 1)
          this.$message.success(`Влан ${remVlan.vid} удалён с порта №${portNum}`)
        } else {
          this.$message.error('Не найден vid='+remVlan.vid)
        }
      } else {
        this.$message.error('Не найден конфиг для порта №' + portNum)
      }
    })
  }

  private changeVlanMode(v: IDevOnuVlan) {
    v.native = !v.native
    this.$message.success('Изменён режим Trunk/Success')
  }

  private addVlanDone(vlanConf: IDevOnuVlan) {
    this.addVlanVisible = false
    const confObj = this.currentVlanConfig.find(v => v.port === this.currentAddVlanPort)
    if (confObj) {
      confObj.vids.push(vlanConf)
      this.$message({
        type: 'success',
        message: `vlan Id: ${vlanConf.vid}, ${vlanConf.native ? 'access' : 'trunk'}`
      })
    } else {
      this.$message.error('Не найден конфиг для порта №' + this.currentAddVlanPort)
    }
  }

  private delVlanPort(portNum: number) {
    this.$confirm('Удалить настройки с порта?').then(() => {
      const confInd = this.currentVlanConfig.findIndex(v => v.port === portNum)
      if (confInd > -1) {
        this.currentVlanConfig.splice(confInd, 1)
        this.$message.success(`Настройки с порта №${portNum} удалены`)
      } else {
        this.$message.error('Не найден конфиг для порта №' + portNum)
      }
    })
  }

  get devCodeGetter() {
    return DeviceModule.code
  }
  get devIdGetter() {
    return DeviceModule.pk || 0
  }
  @Watch('devIdGetter')
  private onDevIdChanged(devId: number) {
    this.getDevConfigTypes(devId)
  }

  private async getDevConfigTypes(devId?: number) {
    const conf = await DeviceModule.GetConfigChoices(devId)
    this.portNum = conf.port_num
    this.configTypeCodes = conf.config_choices
  }

  private async scanDevOnuVlan(devId?: number) {
    if (!devId || devId === 0) {
      devId = this.devIdGetter
    }
    const { data } = await readOnuVlanInfo(devId)
    this.currentVlanConfig = data
  }

  private calcVlanTitleByVid(vid: number) {
    const vlan = this.vlans.find(v => v.vid === vid)
    if (vlan) {
      return vlan.title
    }
    return undefined
  }

  private openAddVlanDialog(portNum: number) {
    this.currentAddVlanPort = portNum
    this.addVlanVisible = true
  }
}
</script>

<style>
/*.onuvlan_miniheader>.el-card__header {
  padding: 0 8px !important;
}*/
.onuvlan_miniwidth{
  padding: 7px 3px;
}
</style>
