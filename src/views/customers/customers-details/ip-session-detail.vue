<template lang="pug">
el-popover(
  trigger='manual'
  width='400'
  v-model="isDisplay"
)
  el-card(
    shadow='never'
    style="font-size: small;"
    v-loading="detailLoading"
  )
    template(v-slot:header) Сессия
      el-link(style="float: right" icon='el-icon-close' @click="isDisplay=false" :underline='false')
    template(v-if="ses")
      template(v-if="lease")
        b {{ lease.ip_address }}
        i  &lt;{{ lease.mac_address }}&gt;
      dl
        dt
          b Время старта
        dd {{ ses.assign_time || '-----' }}
        dt
          b Продолжительность
        dd {{ ses.session_duration || '-----' }}
        dt
          b последнее обновление
        dd {{ ses.last_event_time || '-----' }}
        dt
          b Вход. траф.
        dd {{ ses.h_input_octets || '-----' }}
        dt
          b Исход. траф.
        dd {{ ses.h_output_octets || '-----' }}
        dt
          b Вход. пакеты
        dd {{ ses.h_input_packets || '-----' }}
        dt
          b Исход. пакеты
        dd {{ ses.h_output_packets || '-----' }}
      free-session-button(
        :sessionId="ses.id"
      )
    div(v-else) Нет сессии
  el-button(
    slot='reference'
    size='mini'
    icon='el-icon-s-data'
    @click="isDisplay=!isDisplay"
  ) Detail
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
