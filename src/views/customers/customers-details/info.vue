<template>
  <el-row :gutter="5">
    <el-col class="col_vert_space" :sm="24" :md="12">
      <el-card shadow="never">
        <template v-slot:header>{{ $t('customers.customerChange') }}</template>
        <customer-form></customer-form>
      </el-card>
    </el-col>
    <el-col class="col_vert_space" :sm="24" :md="12">
      <device></device>
    </el-col>
    <el-col class="col_vert_space" :sm="24" :md="12">
      <network></network>
    </el-col>
    <el-col class="col_vert_space" :sm="24" :md="12">
      <el-card shadow="never">
        <template v-slot:header>{{ $t('customers.flags') }}</template>
        <markers></markers>
      </el-card>
    </el-col>
    <el-col class="col_vert_space" :sm="24" :md="12">
      <el-card shadow="never">
        <template v-slot:header>{{ $t('customers.docs') }}</template>
        <customer-docs></customer-docs>
      </el-card>
    </el-col>
    <el-col class="col_vert_space" :sm="24" :md="12">
      <customer-comment-list :customerId="$store.state.customer.id"></customer-comment-list>
    </el-col>
    <el-col class="col_vert_space" :sm="24" :md="12">
      <customer-dynamic-fields></customer-dynamic-fields>
    </el-col>
  </el-row>
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
