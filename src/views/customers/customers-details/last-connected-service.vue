<template lang="pug">
  div(v-loading)
    p(v-if="lastConnectedExists") {{ $t('customers.serviceLastConnected') }} -
      b {{ lastConnectedTitle }}
    p {{ $t('customers.serviceAutocontinuation') }} -
      el-checkbox(
        v-loading="serviceBlockLoad"
        v-on:change="onChangeAutoConnect"
        v-model="autoRenewalService"
        :disabled="!$perms.customers.change_customerservice"
      )
        boolean-icon(v-model="autoRenewalService")
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { CustomerModule } from '@/store/modules/customers/customer'
import BooleanIcon from '@/components/boolean-icon.vue'

@Component({
  name: 'LastConnectedService',
  components: {
    BooleanIcon
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
    await CustomerModule.PatchCustomer({
      auto_renewal_service: v
    })
    this.serviceBlockLoad = false
    this.$message.success(
      this.$t('customers.autoContinuationSaved').toString()
    )
  }

  get lastConnectedTitle() {
    return CustomerModule.last_connected_service_title
  }

  get lastConnectedExists() {
    return CustomerModule.last_connected_service > 0
  }
}
</script>
