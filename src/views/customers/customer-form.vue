<template lang="pug">
  el-form(rel='form' :model)
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ICustomerState } from '@/store/modules/customers/customer'

@Component({
  name: 'customer-form'
})
export default class extends Vue {
  @Prop({ default: {
    pk: 0,
    is_active: true
  } }) private customer!: ICustomerState

  @Prop({ default: 0 }) private groupId!: number

  // private gatewayList: IGateway[] = []
}
</script>
