<template lang="pug">
  el-button(
    icon='el-icon-view'
    :loading="loading"
    :disabled="disabled"
    @click="doFree"
  ) {{ $t('customers.freeSession') }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { freeLeaseSession } from '@/api/networks/req'

@Component({
  name: 'FreeSessionButton'
})
export default class extends Vue {
  @Prop({ required: true }) private leaseId!: number
  @Prop({ default: false }) private disabled!: boolean

  private loading = false

  private async doFree() {
    if (!this.leaseId) return
    try {
      this.loading = true
      const { data } = await freeLeaseSession(this.leaseId)
      this.$message.success(`Ok: ${data}`)
    } finally {
      this.loading = false
    }
  }
}
</script>
