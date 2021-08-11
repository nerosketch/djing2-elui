<template lang="pug">
div Порт №{{ portNum }}
  el-table(
    :data="deviceVlans"
    v-loading="loading"
    empty-text="Vlan'ы на порту не найдены"
    border fit size='small'
  )
    el-table-column(
      label="Название"
      min-width='200'
      prop='title'
    )
    el-table-column(
      label="VID"
      min-width='64'
      prop='vid'
    )
    el-table-column(
      label="native"
    )
      template(v-slot:default="{row}")
        i(:class="{'el-icon-circle-check': row.native, 'el-icon-circle-close': !row.native}")
    el-table-column(
      label="Управление"
    )
      template(v-slot:default="{row}")
        i(:class="{'el-icon-circle-check': row.is_management, 'el-icon-circle-close': !row.is_management}")

  el-divider

  port-vlan-config(
    :portVlanConf.sync="portVlanConf"
  )

  el-button(
    type="primary"
    icon="el-icon-download"
    @click="onApplySwitchVlanConfig"
    :loading="applyLoading"
    :disabled="!$perms.devices.can_apply_onu_config"
    size='mini'
  ) Применить

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { PortModule } from '@/store/modules/devices/port'
import {
  IDevVlan,
  IDeviceSwitchPortConfigChoicesEnum,
  IDeviceSwitchPortConfigTemplate
} from '@/api/devices/types'
import { vlanConfigApply } from '@/api/devices/req'
import PortVlanConfig from './port-vlan-config.vue'

@Component({
  name: 'VidsView',
  components: {
    PortVlanConfig
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) portId!: number
  @Prop({ default: 0 }) portNum!: number
  private loading = false
  private applyLoading = false
  private deviceVlans: IDevVlan[] = []

  private portVlanConf: IDeviceSwitchPortConfigTemplate = {
    port: this.portNum,
    vids: [{ vid: 1, native: true }],
    config_mode: IDeviceSwitchPortConfigChoicesEnum.TRUNK
  }

  @Watch('portId')
  private onChPoId() {
    this.loadVids()
  }

  created() {
    this.loadVids()
  }

  private async loadVids() {
    if (this.portId > 0) {
      this.loading = true
      try {
        const deviceVlans = await PortModule.ScanPortVlans(this.portId)

        // generate initial vlan config
        this.portVlanConf.vids = deviceVlans.map(v => ({
          vid: v.vid,
          native: v.native
        }))
        this.deviceVlans = deviceVlans
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.loading = false
      }
    } else {
      this.$message.error('portId parameter is required')
    }
  }

  private async onApplySwitchVlanConfig() {
    this.applyLoading = true
    try {
      await vlanConfigApply(this.portId, this.portVlanConf)
      this.$message.success('Vlan config успешно применён')
      this.$emit('applydone')
    } finally {
      this.applyLoading = false
    }
  }
}
</script>
