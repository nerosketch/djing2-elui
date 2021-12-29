<template lang="pug">
  el-button(
    :type="btnType"
    :disabled="pingDisabled || !$perms.customers.can_ping"
    @click="pingProfile"
    :loading="pingLoading")
    | {{ isCustomerNotHere ? $t('customers.notPassed') : btnText }}
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
  private btnText = this.$tc('ping')
  private btnType = 'primary'

  private async pingProfile() {
    if (!this.customer || this.isCustomerNotHere) {
      this.$message.error(
        this.$tc('customers.notPassed').toString()
      )
      return
    }
    this.pingLoading = true
    try {
      const { data } = await pingAllIps(this.customer.id)
      if (data.status) {
        this.$message.success(data.text)
        this.btnType = 'success'
      } else {
        this.$message.error(data.text)
        this.btnType = 'danger'
      }
      this.btnText = data.text
    } finally {
      this.pingLoading = false
    }
  }

  get pingDisabled() {
    return this.isCustomerNotHere || !this.customer || this.customer.lease_count === 0 || !this.customer.is_active
  }

  get isCustomerNotHere(): boolean {
    return this.customer === null || this.customer.id === 0
  }
}
</script>
