<template lang="pug">
  el-button(
    :type="btnType"
    :disabled="isCustomerNotHere || customer.lease_count === 0 || !customer.is_active"
    @click="pingProfile"
    :loading="pingLoading"
    size='mini'
  ) {{ isCustomerNotHere ? 'Не передан абонент' : btnText }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { pingAllIps } from '@/api/customers/req'
import { ICustomer } from '@/api/customers/types'

@Component({
  name: 'PingProfile'
})
export default class extends Vue {
  @Prop({ default: null }) private customer!: ICustomer | null
  private pingLoading = false
  private btnText = 'Ping'
  private btnType = 'primary'

  private async pingProfile() {
    if (!this.customer || this.isCustomerNotHere) {
      this.$message.error('Не передан абонент')
      return
    }
    this.pingLoading = true
    let { data } = await pingAllIps(this.customer.pk)
    if (data.status) {
      this.$message.success(data.text)
      this.btnType = 'success'
    } else {
      this.$message.error(data.text)
      this.btnType = 'danger'
    }
    this.btnText = data.text
    this.pingLoading = false
  }

  get isCustomerNotHere(): boolean {
    return this.customer === null || this.customer.pk === 0
  }
}
</script>
