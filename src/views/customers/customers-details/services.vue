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
      el-card(shadow="never")
        .clearfix(slot='header')
          span Текущая услуга абонента
        h3 {{ currentServiceName }}
        el-row
          el-col(:span='12')
            span Последняя подключённая
          el-col(:span='12')
            b -Название последней-
        el-row
          el-col(:span='12')
            span Автопродление услуги
          el-col(:span='12')
            el-checkbox(v-model="isDynamicIp") {{ isDynamicIp ? 'Да' : 'Нет' }}
    el-col(:span='12')
      el-card(shadow="never")
        .clearfix(slot='header')
          span Периодический платёж
        el-button(type='primary' size='mini') Добавить периодический платёж
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IService } from '@/api/services/types'
import { getServices } from '@/api/services/req'
import { CustomerModule } from '../../../store/modules/customers/customer'

@Component({
  name: 'Services'
})
export default class extends Vue {
  private services: IService[] = []
  private servicesLoading = false
  private isDynamicIp = false

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

  created() {
    this.loadServices()
  }

  get currentServiceName() {
    return CustomerModule.service_title
  }
}
</script>
