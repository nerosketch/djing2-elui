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

        generic-vlan-config(
          :portVlanConf.sync="portVlanConf"
          :vlans="vlans"
        )

    el-card(
      shadow='never'
      v-else
    ) Настройка VLAN не принимается выбранным конфигом

    el-button-group
      el-button(
        type="primary"
        icon="el-icon-download"
        @click="onSubmit"
        :loading="vlanLoading"
        :disabled="!$perms.devices.can_apply_onu_config || disabled"
        size='mini'
      ) Применить

</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import VlanMixin from '@/views/networks/components/vlan-mixin'
import { DeviceModule } from '@/store/modules/devices/device'
import { IDevConfigChoice, IDeviceOnuConfigTemplate } from '@/api/devices/types'
import { readOnuVlanInfo, applyDeviceOnuConfig } from '@/api/devices/req'
import GenericVlanConfig from '@/views/devices/vlan-config/generic-vlan-config.vue'

@Component({
  name: 'OnuVlanForm',
  components: {
    GenericVlanConfig
  }
})
export default class extends mixins(VlanMixin) {
  @Prop({ default: false })
  private disabled!: boolean

  private configTypeCodes: IDevConfigChoice[] = []
  private currentConfig: IDeviceOnuConfigTemplate = {
    configTypeCode: this.$store.state.devicemodule.code,
    vlanConfig: []
  }

  created() {
    this.loadVlans()
    this.getDevConfigTypes()
    this.scanDevOnuVlan()
  }

  private async onSubmit() {
    if (this.$store.state.devicemodule.pk > 0) {
      this.vlanLoading = true
      try {
        await applyDeviceOnuConfig(this.$store.state.devicemodule.pk, this.currentConfig)
        this.vlanLoading = false
        this.$message.success({
          message: 'ONU успешно зарегистрирована',
          duration: 15000,
          showClose: true
        })
        DeviceModule.GetDevice(this.$store.state.devicemodule.pk)
      } catch (err) {
        this.vlanLoading = false
        this.$message.error(err)
      }
    } else {
      this.$message.error('Id оборудования не передан')
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

  @Watch('$store.state.devicemodule.pk')
  private onDevIdChanged(devId: number) {
    this.getDevConfigTypes(devId)
  }

  private async getDevConfigTypes(devId?: number) {
    const conf = await DeviceModule.GetConfigChoices(devId)
    this.configTypeCodes = conf.config_choices
  }

  private async scanDevOnuVlan(devId?: number) {
    if (!devId || devId === 0) {
      devId = this.$store.state.devicemodule.pk
    }
    if (devId && devId > 0) {
      const { data } = await readOnuVlanInfo(devId)
      this.currentConfig.vlanConfig = data
    }
  }

  private get isAcceptVlanSelectedConfig() {
    let selectedConf = this.configTypeCodes.find(val => val.code === this.currentConfig.configTypeCode)
    if (selectedConf) {
      return selectedConf.accept_vlan || false
    }
    return false
  }
}
</script>
