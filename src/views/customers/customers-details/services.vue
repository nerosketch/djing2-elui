<template lang="pug">
  el-row(:gutter='5')
    el-col(:sm='24' :md='12')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix
            span Услуги для заказа
        services-list(
          v-on:buydone="loadCurrentService"
          :isServiceAvailable="isServiceAvailable"
        )

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
              :disabled="!$perms.customers.can_complete_service"
            ) Завершить услугу
          b(v-else) Услуга не подключена
          last-connected-service
        h3(v-else) Загрузка ...

    el-col(:sm='24' :md='12')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix Назначенные периодические платежи

        periodic-services-list

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { CustomerModule } from '@/store/modules/customers/customer'
import { ICustomerService } from '@/api/customers/types'
import LastConnectedService from './last-connected-service.vue'
import PeriodicServicesList from './per-pay/srv-list.vue'
import ServicesList from './srv/srv-list.vue'

@Component({
  name: 'Services',
  components: {
    LastConnectedService,
    PeriodicServicesList,
    ServicesList
  }
})
export default class extends Vue {
  private serviceBlockLoad = false
  private currentService: ICustomerService | null = null

  async created() {
    this.loadCurrentService()
  }

  get isServiceAvailable() {
    return this.currentService !== null
  }

  private async loadCurrentService() {
    this.serviceBlockLoad = true
    try {
      const currsrv = await CustomerModule.GetCurrentServiceDetails()
      if (currsrv) {
        this.currentService = currsrv
      } else {
        this.currentService = null
      }
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.serviceBlockLoad = false
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
}
</script>
