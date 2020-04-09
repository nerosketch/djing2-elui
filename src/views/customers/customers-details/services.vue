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
            el-button(
              type='primary' slot-scope="{row}" size='mini'
              @click="buyOpen(row)" :disabled="isServiceAvailable"
            ) Cart
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
        el-button(@click="srvAccDialog=true" icon="el-icon-s-tools" type="primary" size='mini') Привязать услуги к этой группе
    el-col(:span='12')
      el-card(shadow="never" :loading="serviceBlockLoad" style="font-size: small;")
        .clearfix(slot='header')
          span Текущая услуга абонента
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

          el-row(v-if="lastConnectedExists")
            el-col(:span='12')
              span Последняя подключённая
            el-col(:span='12')
              b {{ currentService.last_connected_service_title }}
          el-row
            el-col(:span='12')
              span Автопродление услуги
            el-col(:span='12')
              el-checkbox(
                v-model="autoRenewalService"
              ) {{ autoRenewalService ? 'Да' : 'Нет' }}
          el-button(
            type='danger' size='mini'
            icon='el-icon-delete'
            @click="onStopService"
          ) Завершить услугу

        b(v-else) Услуга не подключена

    el-col(:span='12')
      el-card(shadow="never")
        .clearfix(slot='header')
          span Периодический платёж
        el-button(type='primary' size='mini' disabled) Добавить периодический платёж

    el-dialog(
      title="Купить услугу"
      :visible.sync="buyDialog"
      width="30%"
    )
      buy-service(
        v-on:done="buyDone"
        :services="services"
        :selectedServiceId="selectedServiceId"
      )
    el-dialog(
      title="Принадлежность услуг к группам"
      :visible.sync="srvAccDialog"
      width="30%"
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

@Component({
  name: 'Services',
  components: { BuyService, ServiceAccessory }
})
export default class extends Vue {
  private services: IService[] = []
  private servicesLoading = false
  private autoRenewalService = CustomerModule.auto_renewal_service
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
    await this.loadCurrentService()
  }

  get lastConnectedExists() {
    return CustomerModule.last_connected_service > 0
  }

  get isServiceAvailable() {
    return this.currentService !== null
  }

  async loadCurrentService() {
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

<style>
dl > dt {
  float: left;
  width: 47%;
  border-bottom: 1px #dfe4ed solid;
}
dl > dd {
  margin-left: 48%;
  border-bottom: 1px #dfe4ed solid;
}
</style>
