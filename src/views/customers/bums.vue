<template lang="pug">
  customers-list(
    :fetchFunc="fetchBumCustomers"
  )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CustomersList from '@/views/customers/customers-list.vue'
import { getCustomersBums } from '@/api/customers/req'
import { IDRFRequestListParameters } from '@/api/types'

@Component({
  name: 'Bums',
  components: {
    CustomersList
  }
})
export default class extends Vue {

  private fetchBumCustomers(params?: IDRFRequestListParameters) {
    return getCustomersBums(params)
  }
}
</script>
