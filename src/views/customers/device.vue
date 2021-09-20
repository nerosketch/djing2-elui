<template lang="pug">
el-form(
  :model='frmMod'
  v-loading='isLoading'
  :label-width="$store.getters.isMobileView ? undefined : '100px'"
)
  el-card(shadow="never")
    template(v-slot:header)
      .clearfix Устройство
    el-row
      el-col(:span='8')
        b Устройство
      el-col(:span='16')
        device-select(
          v-model="frmMod.device"
          :localityId="$store.state.customer.locality"
          :initialDevice="devComm"
        )
    el-row
      el-col(:span='8')
        b Порт
      el-col(:span='16')
        selected-dev-port(v-model='frmMod.dev_port' :deviceId='frmMod.device')
    el-row
      el-col
        el-button-group
          el-button(
            icon='el-icon-upload'
            type="primary" @click="onSubmit"
            :loading="isLoading"
          ) Сохранить
          el-button(
            icon="el-icon-view" @click="onGo2Dev"
            :disabled="!frmMod.device"
          ) Смотреть
          el-button(
            type="danger" icon="el-icon-delete"
            @click="onClearDevice"
          ) Очистить
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
    device: CustomerModule.device,
    dev_port: CustomerModule.dev_port
  }

  private get devComm() {
    return {
      id: CustomerModule.device,
      comment: CustomerModule.device_comment
    }
  }

  @Watch('$store.state.customer.id')
  private onChangedId() {
    this.frmMod = {
      device: CustomerModule.device,
      dev_port: CustomerModule.dev_port
    }
  }

  get groupId() {
    return CustomerModule.group
  }

  private async onSubmit() {
    this.isLoading = true
    const newDat = await CustomerModule.PatchCustomer(this.frmMod)
    this.isLoading = false
    this.$emit('done', newDat)
  }

  private onClearDevice() {
    this.$confirm('Действительно очистить устройство абонента?').then(async() => {
      this.isLoading = true
      const { data } = await CustomerModule.ClearDevice()
      this.frmMod.device = data.device
      this.frmMod.dev_port = data.dev_port
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
