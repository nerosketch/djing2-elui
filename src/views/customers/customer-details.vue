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
      el-tab-pane(label="Тарифы" lazy :disabled="!$perms.customers.view_customerservice")
        keep-alive
          services(v-if='loaded')
      el-tab-pane(label="Финансы" lazy :disabled="!$perms.customers.view_customerlog")
        keep-alive
          finance
      el-tab-pane(label="История задач" lazy :disabled="!$perms.tasks.view_task")
        keep-alive
          customer-task-history
      el-tab-pane(label="История трафика" lazy)
        keep-alive
          el-card
            template(v-slot:header) История трафика
            traf-report
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Info from './customers-details/info.vue'
import Services from './customers-details/services.vue'
import Finance from './customers-details/finance.vue'
import CustomerTaskHistory from './customers-details/customer-task-history.vue'
import TrafReport from './customers-details/traf-report.vue'
import { CustomerModule } from '@/store/modules/customers/customer'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'

@Component({
  name: 'CustomerDetails',
  components: {
    Info,
    Services,
    Finance,
    CustomerTaskHistory,
    TrafReport
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private uid!: number

  private loaded = false

  async created() {
    this.loaded = false
    await CustomerModule.GetCustomer(this.uid)
    this.setCrumbs(CustomerModule.group)
    this.loaded = true
    document.title = CustomerModule.full_name || 'Абонент'
  }

  get createDate() {
    return CustomerModule.create_date
  }

  get balance() {
    return CustomerModule.balance
  }

  private async setCrumbs(grpId: number) {
    if (grpId === 0) return
    await BreadcrumbsModule.SetCrumbs([
      {
        path: '/customers/',
        meta: {
          hidden: true,
          title: 'Группы абонентов'
        }
      },
      {
        path: { name: 'customersList', params: { groupId: grpId } },
        meta: {
          hidden: true,
          title: this.grpName
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: CustomerModule.full_name || '-'
        }
      }
    ] as RouteRecord[])
  }

  get grpName() {
    return CustomerModule.group_title
  }
  // End Breadcrumbs
}
</script>
