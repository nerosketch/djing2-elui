<template>
  <el-row :gutter="5">
    <el-col :sm="24" :md="12">
      <el-card shadow="never">
        <template v-slot:header>{{ $t('customers.services4Buy') }}</template>
        <services-list v-on:buydone="loadCurrentService" :isServiceAvailable="isServiceAvailable"></services-list>
      </el-card>
    </el-col>
    <el-col :sm="24" :md="12">
      <el-card shadow="never" :loading="serviceBlockLoad" style="font-size: small;">
        <template v-slot:header>{{ $t('customers.currentCustomerService') }}</template>
        <template v-if="!serviceBlockLoad">
          <div v-if="isServiceAvailable">
            <h3>{{ currentService.service.title }}</h3><i>{{ currentService.service.descr }}</i>
            <dl>
              <dt><b>{{ $t('customers.sum') }}</b></dt>
              <dd>{{ currentService.service.cost }} {{ $t('defaultCurrencySymbol') }}</dd>
              <dt><b>{{ $t('customers.inSpeed') }}</b></dt>
              <dd>{{ currentService.service.speed_in }}</dd>
              <dt><b>{{ $t('customers.outSpeed') }}</b></dt>
              <dd>{{ currentService.service.speed_out }}</dd>
              <dt><b>{{ $t('customers.burst') }}</b></dt>
              <dd>{{ currentService.service.speed_burst }}</dd>
              <dt><b>{{ $t('customers.serviceStartDate') }}</b></dt>
              <dd>{{ currentService.start_time }}</dd>
              <dt><b>{{ $t('customers.serviceWorksUntil') }}</b></dt>
              <dd>{{ currentService.deadline }}</dd>
            </dl>
            <el-button type="danger" icon="el-icon-delete" @click="onStopService" :disabled="!$perms.customers.can_complete_service">{{ $t('customers.serviceFinish') }}</el-button>
          </div><b v-else>{{ $t('customers.serviceNotConnected') }}</b>
          <last-connected-service></last-connected-service>
        </template>
        <h3 v-else>{{ $t('loading') }}</h3>
      </el-card>
    </el-col>
    <el-col :sm="24" :md="12">
      <el-card shadow="never">
        <template v-slot:header>{{ $t('customers.attachedPeriodicPays') }}</template>
        <periodic-services-list></periodic-services-list>
      </el-card>
    </el-col>
  </el-row>
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
    this.$confirm(this.$t('customers.doFinishServiceAheadOfShedule').toString(), {
      confirmButtonText: this.$t('yes').toString(),
      cancelButtonText: this.$t('no').toString(),
      type: 'info'
    }).then(async() => {
      await CustomerModule.StopService()
      await CustomerModule.UpdateCustomer()
      await this.loadCurrentService()
      this.$message.success(
        this.$t('customers.serviceStoppedAheadOfSheduleOk').toString()
      )
    })
  }
}
</script>
