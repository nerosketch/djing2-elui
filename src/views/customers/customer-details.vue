<template lang="pug">
  .app-container
    h4 Баланс: {{ balance }}
    el-tabs.border-card
      el-tab-pane(label="Инфо" lazy)
        info(v-if='loaded')
      el-tab-pane(label="Тарифы" lazy)
        services(v-if='loaded')
      el-tab-pane(label="Финансы" lazy) Финансы
      el-tab-pane(label="История задач" lazy) История задач
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Info from './customers-details/info.vue'
import Services from './customers-details/services.vue'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'CustomerDetails',
  components: { Info, Services }
})
export default class extends Vue {
  @Prop({ default: 0 }) private uid!: number

  private loaded = false

  async created() {
    this.loaded = false
    await CustomerModule.GetCustomer(this.uid)
    this.loaded = true
  }

  get balance() {
    return CustomerModule.balance
  }
}
</script>
