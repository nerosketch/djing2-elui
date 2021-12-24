<template>
  <el-popover trigger="manual" width="400" v-model="isDisplay">
    <el-card shadow="never" style="font-size: small;" v-loading="detailLoading">
      <template v-slot:header>{{ $t('customers.session') }}
        <el-link style="float: right" icon="el-icon-close" @click="isDisplay=false" :underline="false"></el-link>
      </template>
      <template v-if="ses">
        <template v-if="lease"><b>{{ lease.ip_address }}</b><i> &lt;{{ lease.mac_address }}&gt;</i></template>
        <dl>
          <dt><b>{{ $t('customers.sessionStartTime') }}</b></dt>
          <dd>{{ ses.assign_time || '-----' }}</dd>
          <dt><b>{{ $t('customers.sessionDuration') }}</b></dt>
          <dd>{{ ses.session_duration || '-----' }}</dd>
          <dt><b>{{ $t('customers.sessionLastUpdate') }}</b></dt>
          <dd>{{ ses.last_event_time || '-----' }}</dd>
          <dt><b>{{ $t('customers.sessionInTraf') }}</b></dt>
          <dd>{{ ses.h_input_octets || '-----' }}</dd>
          <dt><b>{{ $t('customers.sessionOutTraf') }}</b></dt>
          <dd>{{ ses.h_output_octets || '-----' }}</dd>
          <dt><b>{{ $t('customers.sessionInPkts') }}</b></dt>
          <dd>{{ ses.h_input_packets || '-----' }}</dd>
          <dt><b>{{ $t('customers.sessionOutPkts') }}</b></dt>
          <dd>{{ ses.h_output_packets || '-----' }}</dd>
        </dl>
        <free-session-button :sessionId="ses.id"></free-session-button>
      </template>
      <div v-else>{{ $t('customers.sessionNotFound') }}</div>
    </el-card>
    <el-button slot="reference" icon="el-icon-s-data" @click="isDisplay=!isDisplay">{{ $t('customers.sessionDetail') }}</el-button>
  </el-popover>
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
