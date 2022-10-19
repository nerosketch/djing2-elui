<template lang="pug">
  el-form(
    :model="frmMod"
    v-loading="isLoading"
    :label-width="$store.getters.isMobileView ? undefined : '100px'")
    el-card(shadow="never")
      template(#header)
        | {{ $t('route.devices') }}

      el-row
        el-col(:span="8")
          | {{ $t('devices.dev' ) }}

        el-col(:span="16")
          device-select(
            v-model="frmMod.device"
            :addrId="$store.state.customer.address_id"
            :initialDevice="devComm")

      el-row
        el-col(:span="8")
          | {{ $t('devices.port') }}

        el-col(:span="16")
          selected-dev-port(
            v-model="frmMod.dev_port_id"
            :deviceId="frmMod.device"
          )

      el-row
        el-col
          el-button-group
            el-button(
              icon="el-icon-upload"
              type="primary"
              @click="onSubmit"
              :loading="isLoading")
              | {{ $t('save') }}

            el-button(
              icon="el-icon-view"
              @click="onGo2Dev"
              :disabled="!frmMod.device")
              | {{ $t('view') }}

            el-button(
              type="danger"
              icon="el-icon-delete"
              @click="onClearDevice")
              | {{ $t('clear') }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { CustomerModule } from '@/store/modules/customers/customer'
import DeviceSelect from '@/components/DeviceSelect/index.vue'
import SelectedDevPort from '@/components/DeviceSelect/selectDevPort.vue'

@Component({
  name: 'device',
  components: { DeviceSelect, SelectedDevPort }
})
export default class extends Vue {
  private isLoading = false

  private frmMod = {
    device: CustomerModule.device_id,
    dev_port_id: CustomerModule.dev_port_id
  }

  private get devComm() {
    return {
      id: CustomerModule.device_id,
      comment: CustomerModule.device_comment
    }
  }

  @Watch('$store.state.customer.id')
  private onChangedId() {
    this.frmMod = {
      device: CustomerModule.device_id,
      dev_port_id: CustomerModule.dev_port_id
    }
  }

  private async onSubmit() {
    this.isLoading = true
    const newDat = await CustomerModule.PatchCustomer(this.frmMod)
    this.isLoading = false
    this.$emit('done', newDat)
  }

  private onClearDevice() {
    this.$confirm(
      this.$tc('customers.clearDevQuestion')
    ).then(async() => {
      this.isLoading = true
      const { data } = await CustomerModule.ClearDevice()
      this.frmMod.device = data.device_id
      this.frmMod.dev_port_id = data.dev_port_id
      this.$emit('done', data)
      this.isLoading = false
    })
  }

  private onGo2Dev() {
    this.$router.push({
      name: 'device-view',
      params: {
        devId: this.frmMod.device.toString()
      }
    })
  }
}
</script>
