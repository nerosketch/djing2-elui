<template lang="pug">
  el-row(:gutter='5')
    el-col(:sm='24' :md='12')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix
            span Услуги для заказа
        el-table(
          v-loading='servicesLoading'
          :data='services'
          border fit
          size='small'
        )
          el-table-column(
            align="center"
            label="Заказ."
            width="60"
          )
            template(v-slot:default="{row}")
              el-button(
                type='primary' size='small'
                @click="buyOpen(row)" :disabled="isServiceAvailable"
                icon='el-icon-shopping-cart-2' circle
              )
          el-table-column(
            align="center"
            label="ID"
            width="60"
          )
            template(v-slot:default="{row}") {{ row.pk }}
          el-table-column(
            label="Услуга"
          )
            template(v-slot:default="{row}") {{ row.title }}
          el-table-column(
            label="Сумма"
          )
            template(v-slot:default="{row}") {{ row.cost }}
          el-table-column(
            label="Входящая скорость"
          )
            template(v-slot:default="{row}") {{ row.speed_in }}
          el-table-column(
            label="Исходящая скорость"
          )
            template(v-slot:default="{row}") {{ row.speed_out }}
        el-button(@click="srvAccDialog=true" icon="el-icon-s-tools" type="primary" size='mini') Привязать услуги к этой группе
    el-col(:sm='24' :md='12')
      el-card(shadow="never" :loading="serviceBlockLoad" style="font-size: small;")
        template(v-slot:header)
          .clearfix Текущая услуга абонента
        template(v-if="!serviceBlockLoad")
          div(v-if="isServiceAvailable")
            h3 {{ currentService.service.title }}
            i {{ currentService.service.descr }}

            dl
              dt
                b Сумма
              dd {{ currentService.service.cost }} руб.
              dt
                b Входящая скорость
              dd {{ currentService.service.speed_in }}
              dt
                b Исходящая скорость
              dd {{ currentService.service.speed_out }}
              dt
                b Ускорение(burst (не доделан))
              dd {{ currentService.service.speed_burst }}
              dt
                b Дата начала
              dd {{ currentService.start_time }}
              dt
                b Действует до
              dd {{ currentService.deadline }}

            el-button(
              type='danger' size='mini'
              icon='el-icon-delete'
              @click="onStopService"
            ) Завершить услугу

          last-connected-service(v-else)
        h3(v-else) Загрузка ...

    el-col(:sm='24' :md='12')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix Периодический платёж
        el-button(type='primary' size='mini' disabled) Добавить периодический платёж

    el-dialog(
      title="Купить услугу"
      :visible.sync="buyDialog"
    )
      buy-service(
        v-on:done="buyDone"
        :services="services"
        :selectedServiceId="selectedServiceId"
      )
    el-dialog(
      title="Принадлежность услуг к группам"
      :visible.sync="srvAccDialog"
    )
      service-accessory(v-on:done="srvAccDone")
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { IService } from '@/api/services/types'
import { getServices } from '@/api/services/req'
import { CustomerModule } from '@/store/modules/customers/customer'
import { ICustomer, ICustomerService } from '@/api/customers/types'
import { ServiceModule } from '@/store/modules/services/service'
import BuyService from './buyService.vue'
import ServiceAccessory from './service-accessory.vue'
import LastConnectedService from './last-connected-service.vue'

@Component({
  name: 'Services',
  components: {
    BuyService,
    ServiceAccessory,
    LastConnectedService
  }
})
export default class extends Vue {
  private services: IService[] = []
  private servicesLoading = false
  private serviceBlockLoad = false
  private currentService: ICustomerService | null = null
  private buyDialog = false
  private selectedServiceId = 0
  private srvAccDialog = false

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

  async created() {
    this.loadServices()
    this.loadCurrentService()
  }

  get isServiceAvailable() {
    return this.currentService !== null
  }

  private async loadCurrentService() {
    this.serviceBlockLoad = true
    const currsrv = await CustomerModule.GetCurrentServiceDetails()
    if (currsrv) {
      this.currentService = currsrv
    } else {
      this.currentService = null
    }
    this.serviceBlockLoad = false
  }

  buyDone() {
    this.buyDialog = false
    this.$message.success('Услуга успешно куплена')
    this.loadCurrentService()
    CustomerModule.UpdateCustomer()
  }
  buyOpen(s: IService) {
    if (s.cost > CustomerModule.balance) {
      this.$confirm('У абонента не достаточно средств для включения услуги, включить её в минус?', {
        confirmButtonText: 'Да',
        cancelButtonText: 'Нет, не надо',
        type: 'warning'
      }).then(() => {
        this.selectedServiceId = s.pk
        this.buyDialog = true
      }).catch(() => {
        this.$message.info('Отмена покупки услуги')
      })
    } else {
      this.selectedServiceId = s.pk
      this.buyDialog = true
    }
  }

  onStopService() {
    this.$confirm('Завершить услугу абонента досрочно?', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет, не надо',
      type: 'info'
    }).then(async() => {
      await CustomerModule.StopService()
      await CustomerModule.UpdateCustomer()
      await this.loadCurrentService()
      this.$message.success('Услуга остановлена досрочно')
    })
  }

  srvAccDone() {
    this.srvAccDialog = false
    this.loadServices()
  }
}
</script>
