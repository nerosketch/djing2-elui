<template lang="pug">
  el-table(
    v-loading="loading"
    :data="queue"
    border
    fit
  )
    el-table-column(
      label="Service title"
      prop="service_title"
    )
    el-table-column(
      label="Service queue"
      prop="number_queue"
    )
    el-table-column(
      label="Actions"
      width="155"
      align='center'
    )
      template(#default="{row}")
        el-button-group
          el-button(
            icon="el-icon-caret-top"
            :disabled="moveDisabled"
          )
          el-button(
            icon="el-icon-caret-bottom"
            :disabled="moveDisabled"
          )
          el-button(
            icon="el-icon-close"
            :disabled="row.number_queue === 1"
          )
</template>

<script lang="ts">
import { getPendingCustomerServiceQueue } from '@/api/services/req'
import { ICustomerServiceConnectingQueueResponse } from '@/api/services/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'CustomerQueue'
})
export default class extends Vue {
  @Prop({ required: true }) private customerId!: number
  private loading = false
  private queue: ICustomerServiceConnectingQueueResponse[] = []

  private async loadQueue(customerId: number) {
    try {
      this.loading = true
      const { data } = await getPendingCustomerServiceQueue(customerId)
      this.queue = data
    } finally {
      this.loading = false
    }
  }

  get moveDisabled() {
    return this.queue.length < 2
  }

  @Watch('customerId')
  private onChCustomerId(customerId: number) {
    this.loadQueue(customerId)
  }

  created() {
    if (this.customerId > 0) {
      this.loadQueue(this.customerId)
    }
  }
}
</script>
