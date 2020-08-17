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
import BtnShareMixin from './btn-share-mixin'

@Component({
  name: 'DeleteFromOltBtn'
})
export default class extends mixins(BtnShareMixin) {
  @Prop({ default: 0 }) private devId!: number | null

  private created() {
    this.btnText = 'Удалить с OLT'
  }

  private async delFromOltOnu() {
    if (this.devId && this.devId > 0) {
      this.loading = true
      const { data } = await removeFromOlt(this.devId)
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
