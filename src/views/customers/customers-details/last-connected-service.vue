<template lang="pug">
  div(v-loading)
    p(v-if="lastConnectedExists") Последняя подключённая услуга - 
      b {{ lastConnectedTitle }}
    p Автопродление услуги - 
      el-checkbox(
        v-loading="serviceBlockLoad"
        v-on:change="onChangeAutoConnect"
        v-model="autoRenewalService"
        :disabled="!$perms.customers.change_customerservice"
      ) {{ autoRenewalService ? 'Да' : 'Нет' }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'LastConnectedService'
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
    this.$message.success('Автопродление сохранено')
  }

  get lastConnectedTitle() {
    return CustomerModule.last_connected_service_title
  }

  get lastConnectedExists() {
    return CustomerModule.last_connected_service > 0
  }
}
</script>
