<template lang="pug">
  div
    h4(v-if="loading")
      | {{ $t('zagruzka') }}
  
    template(v-else)
      div(v-if="customers.length > 0")
        div(v-for="(cst, i) in customers", :key="i")
          router-link.el-link.el-link--primary.is-underline(:to="{name: 'customerDetails', params:{uid: cst.id }}")
            | {{ cst.full_name }}
    
      h4(v-else)
        | {{ $t('abonenty-na-portu-ne-naideny') }}
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
  private onPortChange() {
    this.loadCustomers()
  }

  private async loadCustomers() {
    if (this.device !== null && this.portId > 0) {
      this.loading = true
      try {
        const { data } = await filterDevicePort(this.device.id, this.portId)
        this.customers = data
      } finally {
        this.loading = false
      }
    } else {
      this.$message.error(this.$t('parameters-required'))
    }
  }

  created() {
    this.loadCustomers()
  }
}
</script>
