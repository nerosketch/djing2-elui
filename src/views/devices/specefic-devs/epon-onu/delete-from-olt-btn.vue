<template lang="pug">
  el-button(
    size='mini'
    icon='el-icon-close'
    :type="btnType"
    :loading="loading"
    @click="delFromOltOnu"
  ) {{ btnText }}
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { removeFromOlt } from '@/api/devices/req'
import { IDevice } from '@/api/devices/types'
import BtnShareMixin from './btn-share-mixin'

@Component({
  name: 'DeleteFromOltBtn'
})
export default class extends mixins(BtnShareMixin) {
  @Prop({ default: null }) private device!: IDevice | null

  private created() {
    this.btnText = 'Удалить с OLT'
  }

  private async delFromOltOnu() {
    if (this.device !== null) {
      this.loading = true
      const { data } = await removeFromOlt(this.device.pk)
      if (data.status === 1) {
        this.setResState(data.text, 'success', 5000)
        this.$emit('done')
      } else {
        this.setResState(data.text, 'danger')
      }
    } else {
      this.setResState('В кнопку не передано устройство', 'danger')
    }
    this.loading = false
  }
}
</script>
