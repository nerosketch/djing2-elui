<template lang="pug">
  el-card(shadow='never' v-if="currentConfig.vlanConfig.length > 0")
    template(v-slot:header)
      span Варианты конфигурации на ONU

    span Шаблон конфига для ONU
    el-select(v-model="currentConfig.configTypeCode" size='mini' placeholder="Шаблон конфига")
      el-option(
        :value='v.code'
        :label='v.title'
        v-for="(v, i) in configTypeCodes"
        :key="i"
      )

    template(v-if="isAcceptVlanSelectedConfig")
      el-card(
        shadow='never'
        v-for="portVlanConf in currentConfig.vlanConfig"
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
                  @click="changeVlanMode(portVlanConf.port, v)"
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
          :disabled="!$perms.networks.view_vlanif"
          @click="openAddVlanDialog(portVlanConf.port)"
        )

    el-card(
      shadow='never'
      v-else
    )
      span Настройка VLAN не принимается выбранным конфигом

    el-button-group
      el-button(
        type="primary"
        icon="el-icon-download"
        @click="onSubmit"
        :loading="vlanLoading"
        :disabled="!$perms.devices.can_apply_onu_config"
        size='mini'
      ) Применить

    el-dialog(
      :visible.sync="addVlanVisible"
      title="Добавить vlan на порт"
    )
      keep-alive
        add-vlan(
          v-on:done="addVlanDone"
          :vlans="vlans"
        )
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { mixins } from 'vue-class-component'
import VlanMixin from '@/views/networks/components/vlan-mixin'
import { DeviceModule } from '@/store/modules/devices/device'
import { IDevConfigChoice, IDevOnuVlanInfo, IDevOnuVlan, IDeviceOnuConfigTemplate } from '@/api/devices/types'
import { readOnuVlanInfo, applyDeviceOnuConfig } from '@/api/devices/req'
import AddVlan from './add-vlan.vue'

const multipleAccessVlanMsg = 'Порт не может содержать больше одного access vlan'

@Component({
  name: 'OnuVlanForm',
  components: { AddVlan }
})
export default class extends mixins(VlanMixin) {
  private addVlanVisible = false
  private configTypeCodes: IDevConfigChoice[] = []
  private currentAddVlanPort = 0
  private currentConfig: IDeviceOnuConfigTemplate = {
    configTypeCode: this.devCodeGetter,
    vlanConfig: []
  }

  created() {
    this.loadVlans()
    this.getDevConfigTypes()
    this.scanDevOnuVlan()
  }

  private async onSubmit() {
    if (this.devIdGetter > 0) {
      this.vlanLoading = true
      try {
        await applyDeviceOnuConfig(this.devIdGetter, this.currentConfig)
        this.vlanLoading = false
        this.$message.success({
          message: 'ONU успешно зарегистрирована',
          duration: 15000,
          showClose: true
        })
        DeviceModule.GetDevice(this.devIdGetter)
      } catch (err) {
        this.vlanLoading = false
        this.$message.error(err)
      }
    } else {
      this.$message.error('Id оборудования не передан')
    }
  }

  private vlanRemove(portNum: number, remVlan: IDevOnuVlan) {
    this.$confirm('Удалить vlan с порта?').then(() => {
      const confObj = this.findPortConf(portNum)
      if (confObj) {
        const confIndex = confObj.vids.findIndex(v => v.vid === remVlan.vid)
        if (confIndex > -1) {
          confObj.vids.splice(confIndex, 1)
          this.$message.success(`Влан ${remVlan.vid} удалён с порта №${portNum}`)
        } else {
          this.$message.error('Не найден vid=' + remVlan.vid)
        }
      }
    })
  }

  private changeVlanMode(portNum: number, v: IDevOnuVlan) {
    if (!v.native && this.nativeVlanCount(portNum) > 0) {
      this.$message.error(multipleAccessVlanMsg)
      return
    }
    v.native = !v.native
    this.$message.success('Изменён режим Trunk/Success')
  }

  private addVlanDone(vlanConf: IDevOnuVlan) {
    this.addVlanVisible = false
    const portNum = this.currentAddVlanPort

    if (this.isVlanExists(portNum, vlanConf.vid)) {
      this.$message.error('Порт должен содержать уникальные vlan')
      return
    }

    if (vlanConf.native && this.nativeVlanCount(portNum) > 0) {
      this.$message.error(multipleAccessVlanMsg)
      return
    }

    const confObj = this.findPortConf(portNum)
    if (confObj) {
      confObj.vids.push(vlanConf)
      this.$message({
        type: 'success',
        message: `vlan Id: ${vlanConf.vid}, ${vlanConf.native ? 'access' : 'trunk'}`
      })
    }
  }

  private delVlanPort(portNum: number) {
    this.$confirm('Удалить настройки с порта?').then(() => {
      const confInd = this.currentConfig.vlanConfig.findIndex(v => v.port === portNum)
      if (confInd > -1) {
        this.currentConfig.vlanConfig.splice(confInd, 1)
        this.$message.success(`Настройки с порта №${portNum} удалены`)
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
    this.configTypeCodes = conf.config_choices
  }

  private async scanDevOnuVlan(devId?: number) {
    if (!devId || devId === 0) {
      devId = this.devIdGetter
    }
    const { data } = await readOnuVlanInfo(devId)
    this.currentConfig.vlanConfig = data
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

  private nativeVlanCount(portNum: number): number {
    const confObj = this.findPortConf(portNum)
    let nativeCount = 0
    if (confObj) {
      confObj.vids.forEach(portVid => {
        if (portVid.native) {
          nativeCount++
        }
      })
    }
    return nativeCount
  }
  private isVlanExists(portNum: number, vid: number): boolean {
    const confObj = this.findPortConf(portNum)
    if (confObj) {
      for (let portVid of confObj.vids) {
        if (portVid.vid === vid) {
          return true
        }
      }
    }
    return false
  }

  private findPortConf(portNum: number): IDevOnuVlanInfo | undefined {
    const confObj = this.currentConfig.vlanConfig.find(v => v.port === portNum)
    if (confObj) {
      return confObj
    }
    this.$message.error('Не найден конфиг для порта №' + portNum)
    return undefined
  }

  private get isAcceptVlanSelectedConfig(): boolean {
    let selectedConf = this.configTypeCodes.find(val => val.code === this.currentConfig.configTypeCode)
    if (selectedConf) {
      return selectedConf.accept_vlan || false
    }
    return false
  }
}
</script>

<style>
.onuvlan_miniwidth{
  padding: 7px 3px;
}
</style>
