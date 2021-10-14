<template lang="pug">
.app-container
  span Балланс:
  small &nbsp; {{ $store.state.customerlegal.balance }}.
  span  Создан:
  small &nbsp; {{ $store.state.customerlegal.create_date }}
  el-tabs.border-card
    el-tab-pane(label="Инфо")
      h3 details
    el-tab-pane(label="Филиалы" lazy)
      h3 филиалы
</template>

<script lang="ts">
import { CustomerLegalModule } from '@/store/modules/customers_legal/customer-legal'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'LegalDetails'
})
export default class extends Vue {
  @Prop({ required: true }) private uid!: number

  private loadLegalCustomer(uid: number) {
    CustomerLegalModule.getCustomerLegal(uid)
  }

  created() {
    if (this.uid) {
      this.loadLegalCustomer(this.uid)
    }
  }
}
</script>
