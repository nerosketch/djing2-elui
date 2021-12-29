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

      template(v-if="ses")
        template(v-if="lease")
          b
            | {{ lease.ip_address }}

          i
            | <{{ lease.mac_address }}>

        dl
          dt
            b
              | {{ $t('customers.sessionStartTime') }}

          dd
            | {{ ses.assign_time || '-----' }}

          dt
            b
              | {{ $t('customers.sessionDuration') }}

          dd
            | {{ ses.session_duration || '-----' }}

          dt
            b
              | {{ $t('customers.sessionLastUpdate') }}

          dd
            | {{ ses.last_event_time || '-----' }}

          dt
            b
              | {{ $t('customers.sessionInTraf') }}

          dd
            | {{ ses.h_input_octets || '-----' }}

          dt
            b
              | {{ $t('customers.sessionOutTraf') }}

          dd
            | {{ ses.h_output_octets || '-----' }}

          dt
            b
              | {{ $t('customers.sessionInPkts') }}

          dd
            | {{ ses.h_input_packets || '-----' }}

          dt
            b
              | {{ $t('customers.sessionOutPkts') }}

          dd
            | {{ ses.h_output_packets || '-----' }}

        free-session-button(:sessionId="ses.id")

      div(v-else)
        | {{ $t('customers.sessionNotFound') }}

    el-button(
      slot="reference"
      icon="el-icon-s-data"
      @click="isDisplay=!isDisplay")
      | {{ $t('customers.sessionDetail') }}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getSessionByLease } from '@/api/sessions/req'
import { IUserSession } from '@/api/sessions/types'
import { ICustomerIpLease } from '@/api/networks/types'
import FreeSessionButton from './free-session-button.vue'

@Component({
  name: 'IpSessionDetail',
  components: { FreeSessionButton }
})
export default class extends Vue {
  @Prop({ required: true })
  private lease!: ICustomerIpLease

  private detailLoading = false
  private isDisplay = false
  private ses: IUserSession | null = null

  private async loadSession(leaseId: number) {
    this.detailLoading = true
    try {
      const { data } = await getSessionByLease(leaseId)
      this.ses = data
    } finally {
      this.detailLoading = false
    }
  }

  @Watch('isDisplay')
  private isChDisp(isDisplay: boolean) {
    if (isDisplay && this.lease.id > 0) {
      this.loadSession(this.lease.id)
    }
  }
}
</script>
