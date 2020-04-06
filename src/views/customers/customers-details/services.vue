<template lang="pug">
  el-row(:gutter='5')
    el-col(:span='12')
      el-card(shadow="never")
        .clearfix(slot='header')
          span Услуги для заказа
        el-table(
          v-loading='servicesLoading'
          :data='services'
          border fit
          size='small'
        )
          el-table-column(
            align="center"
            label="Заказать"
            width="80"
          )
            el-button(type='primary' slot-scope="{row}" size='mini') Cart
          el-table-column(
            align="center"
            label="ID"
            width="60"
          )
            template(slot-scope="{row}") {{ row.pk }}
          el-table-column(
            label="Услуга"
          )
            template(slot-scope="{row}") {{ row.title }}
          el-table-column(
            label="Сумма"
          )
            template(slot-scope="{row}") {{ row.cost }}
          el-table-column(
            label="Входящая скорость"
          )
            template(slot-scope="{row}") {{ row.speed_in }}
          el-table-column(
            label="Исходящая скорость"
          )
            template(slot-scope="{row}") {{ row.speed_out }}
    el-col(:span='12')
      el-card(shadow="never" :loading="!serviceAvailable")
        .clearfix(slot='header')
          span Текущая услуга абонента
        h3 {{ serviceInfo.service_title }}
        el-row(v-if="lastConnectedExists")
          el-col(:span='12')
            span Последняя подключённая
          el-col(:span='12')
            b -Название последней-
            br
            b {{ serviceInfo.speed_in }} / {{ serviceInfo.speed_out }}
        el-row
          el-col(:span='12')
            span Автопродление услуги
          el-col(:span='12')
            el-checkbox(
              v-model="autoRenewalService"
              v-loading='serviceBlockLoad'
            ) {{ autoRenewalService ? 'Да' : 'Нет' }}
    el-col(:span='12')
      el-card(shadow="never")
        .clearfix(slot='header')
          span Периодический платёж
        el-button(type='primary' size='mini') Добавить периодический платёж
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { IService } from '@/api/services/types'
import { getServices } from '@/api/services/req'
import { CustomerModule } from '@/store/modules/customers/customer'
import { ICustomer } from '@/api/customers/types'
import { ServiceModule } from '@/store/modules/services/service'

@Component({
  name: 'Services'
})
export default class extends Vue {
  private services: IService[] = []
  private servicesLoading = false
  private autoRenewalService = CustomerModule.auto_renewal_service
  private serviceBlockLoad = false

  private async loadServices() {
    this.servicesLoading = true
    const r = await getServices({
      page: 1,
      page_size: 100,
      groups: CustomerModule.group
    })
    this.services = r.data.results
    this.servicesLoading = false
  }

  @Watch('autoRenewalService')
  private async onChangeAutoConnect(v: boolean) {
    this.serviceBlockLoad = true
    await CustomerModule.SET_AUTO_RENEWAL_SERV(v)
    await CustomerModule.SaveCustomer()
    this.serviceBlockLoad = false
    this.$message.success('Автопродление сохранено')
  }

  async created() {
    await this.loadServices()
    if(CustomerModule.current_service !== 0){
      await this.loadService(CustomerModule.current_service)
    }
  }

  get lastConnectedExists() {
    return CustomerModule.last_connected_service !== null
  }
  get serviceAvailable() {
    return ServiceModule.pk !== 0
  }

  private async loadService(id: number) {
    this.serviceBlockLoad = true
    const r = await ServiceModule.GetService(id)
    this.serviceBlockLoad = false
  }

  get serviceInfo() {
    return ServiceModule.context.state
  }
}
</script>
