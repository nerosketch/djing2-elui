<template lang="pug">
div
  h4(v-if="loading") Загрузка...
  template(v-else)
    div(v-if="customers.length > 0")
      div(v-for="(cst, i) in customers" :key="i")
        el-link(type='primary')
          router-link(:to="{name: 'customerDetails', params:{uid: cst.pk }}") {{ cst.full_name }}
    h4(v-else) Абоненты на порту не найдены
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ICustomerOnPort } from '@/api/customers/types'
import { filterDevicePort } from '@/api/customers/req'
import { IDevice } from '@/api/devices/types'

@Component({
  name: 'SwitchPortView'
})
export default class extends Vue {
  @Prop({ default: null }) private device!: IDevice | null
  @Prop({ default: 0 }) private portId!: number
  private customers: ICustomerOnPort[] = []
  private loading = false

  @Watch('portId')
  private onPortChange(portId: number) {
    this.loadCustomers()
  }

  private async loadCustomers() {
    this.loading = true
    if (this.device !== null && this.portId > 0) {
      const { data } = await filterDevicePort(this.device.pk, this.portId)
      this.customers = data
      this.loading = false
    } else {
      this.$message.error('Parameters required')
    }
  }

  created() {
    this.loadCustomers()
  }
}
</script>
