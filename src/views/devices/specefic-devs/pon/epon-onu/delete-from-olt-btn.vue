<template lang="pug">
  el-button(
    icon="el-icon-close"
    :type="btnType"
    :loading="loading"
    @click="delFromOltOnu"
    :disabled="!$perms.devices.can_remove_from_olt")
    | {{ btnText }}
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceModule } from '@/store/modules/devices/device'
import BtnShareMixin from './btn-share-mixin'

@Component({
  name: 'DeleteFromOltBtn'
})
export default class extends mixins(BtnShareMixin) {
  @Prop({ default: 0 }) private devId!: number | null

  private created() {
    this.btnText = this.$tc('removeFromOLT')
  }

  private async delFromOltOnu() {
    if (this.devId && this.devId > 0) {
      this.loading = true
      try {
        const data = await DeviceModule.RemoveFromOlt(this.devId)
        if (data.status === 1) {
          this.setResState(data.text, 'success', 5000)
          this.$emit('done')
        } else {
          this.setResState(data.text, 'danger')
        }
      } finally {
        this.loading = false
      }
    } else {
      this.setResState(this.$tc('noDeviceTransmittedToTheButton'), 'danger')
    }
    this.loading = false
  }
}
</script>
