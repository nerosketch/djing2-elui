<template lang="pug">
  customer-list(:fetchFunc="fetchBumCustomers")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CustomerList from '@/views/customers/customer-list.vue'
import { getCustomersBums } from '@/api/customers/req'
import { IDRFRequestListParameters } from '@/api/types'

@Component({
  name: 'Bums',
  components: {
    CustomerList
  }
})
export default class extends Vue {
  private fetchBumCustomers(params?: IDRFRequestListParameters) {
    return getCustomersBums(params)
  }
}
</script>
