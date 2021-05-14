<template lang="pug">
  el-row(:gutter="5")
    el-col(:sm='24' :md='12')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix Изменение абонента
        customer-form
    el-col(:sm='24' :md='12')
      device
    el-col(:sm='24' :md='12')
      network
    el-col(:sm='24' :md='12')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix Загрузки
        customer-docs
    el-col(:sm='24' :md='12')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix Флаги абонента
        markers

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CustomerForm from '@/views/customers/customer-form.vue'
import Device from '@/views/customers/device.vue'
import Network from './network.vue'
import CustomerDocs from './docs.vue'
import Markers from './markers.vue'

@Component({
  name: 'Info',
  components: {
    CustomerForm,
    Device,
    Network,
    CustomerDocs,
    Markers
  }
})
export default class extends Vue {}
</script>
