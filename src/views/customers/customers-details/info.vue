<template lang="pug">
  el-row(:gutter="5")
    el-col.col_vert_space(:sm="24" :md="12")
      el-card(shadow="never")
        template(#header)
          | {{ $t('customers.customerChange') }}

        customer-form

    el-col.col_vert_space(:sm="24" :md="12")
      device

    el-col.col_vert_space(:sm="24" :md="12")
      network

    el-col.col_vert_space(:sm="24" :md="12")
      el-card(shadow="never")
        template(#header)
          | {{ $t('customers.flags') }}

        markers

    el-col.col_vert_space(:sm="24" :md="12")
      el-card(shadow="never")
        template(#header)
          | {{ $t('customers.docs') }}

        customer-docs

    el-col.col_vert_space(:sm="24" :md="12")
      customer-comment-list(:customerId="$store.state.customer.id")

    el-col.col_vert_space(:sm="24" :md="12")
      customer-dynamic-fields
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CustomerForm from '@/views/customers/customer-form.vue'
import Device from '@/views/customers/device.vue'
import Network from './network.vue'
import CustomerDocs from './docs.vue'
import Markers from './markers.vue'
import CustomerCommentList from '@/views/customers/comments.vue'
import CustomerDynamicFields from '@/views/customers/dynamic-fields.vue'

@Component({
  name: 'Info',
  components: {
    CustomerForm,
    Device,
    Network,
    CustomerDocs,
    Markers,
    CustomerCommentList,
    CustomerDynamicFields
  }
})
export default class extends Vue {}
</script>
