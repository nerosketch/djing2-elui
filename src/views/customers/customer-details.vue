<template lang="pug">
  .app-container
    h4 Баланс: {{ balance }}
    el-tabs.border-card
      el-tab-pane(label="Инфо" lazy)
        info
      el-tab-pane(label="Тарифы" lazy)
        services
      el-tab-pane(label="Финансы" lazy) Финансы
      el-tab-pane(label="История задач" lazy) История задач
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Info from './customers-details/info.vue'
import Services from './customers-details/services.vue'
import { getCustomer } from '@/api/customers'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'CustomerDetails',
  components: { Info, Services }
})
export default class extends Vue {
  @Prop({ default: 0 }) private uid!: number
  @Prop({ default: 0 }) private groupId!: number

  private customer = CustomerModule.GetCustomer(this.uid)

  async created() {
    await CustomerModule.GetCustomer(this.uid)
  }

  get balance() {
    return CustomerModule.balance
  }
}
</script>
