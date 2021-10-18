<template lang="pug">
.app-container
  span Балланс:
  small &nbsp; {{ $store.state.customerlegal.balance }}.
  span  Создан:
  small &nbsp; {{ $store.state.customerlegal.create_date }}
  el-tabs.border-card
    el-tab-pane(label="Инфо")
      el-row(:gutter='5')
        el-col.col_vert_space(:sm='24' :md='12')
          el-card(shadow='never')
            template(v-slot:header) Изменение данных организации
            legal-form(v-if="ready")
        el-col.col_vert_space(:sm='24' :md='12')
          el-card(shadow='never')
            template(v-slot:header) Банковские реквизиты
            legal-bank-info
        el-col.col_vert_space(:sm='24' :md='12')
          el-card(shadow='never')
            template(v-slot:header) Почтовый адрес
            legal-post-form
        el-col.col_vert_space(:sm='24' :md='12')
          el-card(shadow='never')
            template(v-slot:header) Адрес доставки счёта
            legal-delivery-address-form

    el-tab-pane(label="Филиалы" lazy)
      h3 филиалы
</template>

<script lang="ts">
import { CustomerLegalModule } from '@/store/modules/customers_legal/customer-legal'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import LegalForm from '@/views/customers_legal/legal-form.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import LegalBankInfo from './legal-bank-info.vue'
import LegalPostForm from './legal-post-info.vue'
import LegalDeliveryAddressForm from './legal-delivery-address-form.vue'

@Component({
  name: 'LegalDetails',
  components: {
    LegalForm,
    LegalBankInfo,
    LegalPostForm,
    LegalDeliveryAddressForm
  }
})
export default class extends Vue {
  @Prop({ required: true }) private uid!: number

  private ready = false

  private async loadLegalCustomer(uid: number) {
    this.ready = false
    try {
      await CustomerLegalModule.getCustomerLegal(uid)
      this.ready = true
    } catch (err) {
      this.ready = false
    }
  }

  created() {
    if (this.uid) {
      this.loadLegalCustomer(this.uid)
    }

    this.setCrumbs()
  }

  @Watch('$store.state.customerlegal.title')
  private onChLegalTitle() {
    this.setCrumbs()
  }

  // Breadcrumbs
  private async setCrumbs() {
    await BreadcrumbsModule.SetCrumbs([
      {
        path: '/legal/',
        meta: {
          hidden: true,
          title: 'Организации'
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: this.$store.state.customerlegal.title || '-'
        }
      }
    ] as any)
  }
  // End Breadcrumbs

}
</script>
