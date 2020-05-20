<template lang="pug">
  el-row(:gutter="5")
    el-col(:span='12')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix Изменение абонента
        customer-form
    el-col(:span='12')
      device
    el-col(:span='12')
      network

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CustomerForm from '@/views/customers/customer-form.vue'
import Device from '@/views/customers/device.vue'
import Network from './network.vue'

@Component({
  name: 'Info',
  components: { CustomerForm, Device, Network }
})
export default class extends Vue {}
</script>
