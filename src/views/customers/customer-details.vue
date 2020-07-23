<template lang="pug">
  .app-container
    span Баланс: 
    small {{ balance }}. 
    span Создан: 
    small {{ createDate }}
    el-tabs.border-card
      el-tab-pane(label="Инфо" lazy)
        keep-alive
          info(v-if='loaded')
      el-tab-pane(label="Тарифы" lazy)
        keep-alive
          services(v-if='loaded')
      el-tab-pane(label="Финансы" lazy)
        keep-alive
          finance
      el-tab-pane(label="История задач" lazy)
        keep-alive
          customer-task-history
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Info from './customers-details/info.vue'
import Services from './customers-details/services.vue'
import Finance from './customers-details/finance.vue'
import CustomerTaskHistory from './customers-details/customer-task-history.vue'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'CustomerDetails',
  components: { Info, Services, Finance, CustomerTaskHistory }
})
export default class extends Vue {
  @Prop({ default: 0 }) private uid!: number

  private loaded = false

  async created() {
    this.loaded = false
    await CustomerModule.GetCustomer(this.uid)
    this.loaded = true
  }

  get createDate() {
    return CustomerModule.create_date
  }

  get balance() {
    return CustomerModule.balance
  }
}
</script>
