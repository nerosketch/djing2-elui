<template lang="pug">
  el-popover(
    trigger="manual"
    width="400"
    v-model="isDisplay")
    el-card(
      shadow="never"
      style="font-size: small;"
      v-loading="detailLoading")
      template(v-slot:header)
        | {{ $t('customers.session') }}

        el-link(
          style="float: right"
          icon="el-icon-close"
          @click="isDisplay=false"
          :underline="false")

      template(v-if="lease")
        dl
          dt
            b {{ $t('customers.sessionStartTime') }}
          dd {{ defVal(lease.lease_time) }}

          dt
            b {{ $t('customers.sessionLastUpdate') }}
          dd {{ defVal(lease.last_update) }}

          dt
            b {{ $t('customers.sessionInTraf') }}
          dd {{ defVal(lease.h_input_octets) }}

          dt
            b {{ $t('customers.sessionOutTraf') }}
          dd {{ defVal(lease.h_output_octets) }}

          dt
            b {{ $t('customers.sessionInPkts') }}
          dd {{ defVal(lease.h_input_packets) }}

          dt
            b {{ $t('customers.sessionOutPkts') }}
          dd {{ defVal(lease.h_output_packets) }}

          dt
            b CVID
          dd {{ defVal(lease.cvid) }}

          dt
            b SVID
          dd {{ defVal(lease.svid) }}

          dt
            b SessionID
          dd {{ defVal(lease.session_id) }}

          dt
            b RADIUS username
          dd {{ defVal(lease.radius_username) }}

        free-session-button(
          :leaseId="lease.id"
          :disabled="!Boolean(lease.radius_username)"
        )
      div(v-else) {{ $t('customers.sessionNotFound') }}

    el-button(
      slot="reference"
      icon="el-icon-s-data"
      @click="isDisplay=!isDisplay")
      | {{ $t('customers.sessionDetail') }}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ICustomerIpLease } from '@/api/networks/types'
import { CustomerIpLeaseModule } from '@/store/modules/networks/ip_lease'
import FreeSessionButton from './free-session-button.vue'

@Component({
  name: 'IpLeaseDetail',
  components: {
    FreeSessionButton
  }
})
export default class extends Vue {
  @Prop({ default: null })
  private lease!: ICustomerIpLease

  private detailLoading = false
  private isDisplay = false

  private async loadLease(leaseId: number) {
    this.detailLoading = true
    try {
      await CustomerIpLeaseModule.GetLease(leaseId)
    } finally {
      this.detailLoading = false
    }
  }

  private defVal(val: any) {
    return val || '-----'
  }

  @Watch('isDisplay')
  private isChDisp(isDisplay: boolean) {
    if (isDisplay && this.lease && this.lease.id > 0) {
      this.loadLease(this.lease.id)
    }
  }
}
</script>
