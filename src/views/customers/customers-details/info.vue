<template lang="pug">
  el-row
    el-col(:span='12')
      el-card.box-card
        .clearfix(slot='header')
          span Изменение абонента
        customer-form
    el-col(:span='12')
      device

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CustomerForm from '@/views/customers/customer-form.vue'
import Device from '@/views/customers/device.vue'

@Component({
  name: 'Info',
  components: { CustomerForm, Device }
})
export default class extends Vue {}
</script>
