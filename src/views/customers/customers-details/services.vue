<template lang="pug">
  el-row(:gutter="5")
    el-col(:sm="24" :md="12")
      el-card(shadow="never")
        template(v-slot:header)
          | {{ $t('customers.services4Buy') }}

        services-list(
          v-on:buydone="loadCurrentService"
          :isServiceAvailable="isServiceAvailable"
        )

    el-col(:sm="24" :md="12")
      el-card(
        shadow="never"
        :loading="serviceBlockLoad"
        style="font-size: small;")
        template(v-slot:header)
          | {{ $t('customers.currentCustomerService') }}

        template(v-if="!serviceBlockLoad")
          div(v-if="isServiceAvailable")
            h3 {{ currentService.service.title }}

            i {{ currentService.service.descr }}

            dl
              dt
                b {{ $t('customers.sum') }}

              dd {{ currentService.service.cost }} {{ $t('defaultCurrencySymbol') }}

              dt
                b {{ $t('customers.inSpeed') }}

              dd {{ currentService.service.speed_in }}

              dt
                b {{ $t('customers.outSpeed') }}

              dd {{ currentService.service.speed_out }}

              dt
                b {{ $t('customers.burst') }}

              dd {{ currentService.service.speed_burst }}

              dt
                b {{ $t('customers.serviceStartDate') }}

              dd {{ currentService.start_time }}

              dt
                b {{ $t('customers.serviceWorksUntil') }}

              dd {{ currentService.deadline }}

            el-button(
              type="danger"
              icon="el-icon-delete"
              @click="onStopService"
              :disabled="!$perms.customers.can_complete_service")
              | {{ $t('customers.serviceFinish') }}

          b(v-else)
            | {{ $t('customers.serviceNotConnected') }}

          last-connected-service

        h3(v-else)
          | {{ $t('loading') }}

    el-col(:sm="24" :md="12")
      el-card(shadow="never")
        template(v-slot:header)
          | {{ $t('customers.attachedPeriodicPays') }}

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

  public created() {
    this.loadCurrentService()
  }

  private get isServiceAvailable() {
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
    } finally {
      this.serviceBlockLoad = false
    }
  }

  private onStopService() {
    this.$confirm(this.$tc('customers.doFinishServiceAheadOfShedule'), {
      confirmButtonText: this.$tc('yes'),
      cancelButtonText: this.$tc('no'),
      type: 'info'
    }).then(async() => {
      await CustomerModule.StopService()
      CustomerModule.UpdateCustomer()
      await this.loadCurrentService()
      this.$message.success(
        this.$tc('customers.serviceStoppedAheadOfSheduleOk')
      )
    })
  }
}
</script>
