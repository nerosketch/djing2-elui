<template lang="pug">
  div(v-loading)
    p {{ $t('customers.serviceAutocontinuation') }} -

      el-checkbox(
        v-loading="serviceBlockLoad"
        v-on:change="onChangeAutoConnect"
        v-model="autoRenewalService"
        :disabled="!$perms.customers.change_customerservice")
        boolean-icon(v-model="autoRenewalService")

    b Service queue
    customer-queue(
      :customerId="$store.state.customer.id"
    )
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { CustomerModule } from '@/store/modules/customers/customer'
import BooleanIcon from '@/components/boolean-icon.vue'
import CustomerQueue from '@/views/services/customer_queue.vue'

@Component({
  name: 'LastConnectedService',
  components: {
    BooleanIcon,
    CustomerQueue
  }
})
export default class extends Vue {
  private autoRenewalService = CustomerModule.auto_renewal_service
  private serviceBlockLoad = false

  @Watch('$store.state.customer.auto_renewal_service')
  private onChRS(nv: boolean) {
    this.autoRenewalService = nv
  }

  private async onChangeAutoConnect(v: boolean) {
    this.serviceBlockLoad = true
    try {
      await CustomerModule.PatchCustomer({
        auto_renewal_service: v
      })
      this.$message.success(
        this.$tc('customers.autoContinuationSaved')
      )
    } finally {
      this.serviceBlockLoad = false
    }
  }
}
</script>
