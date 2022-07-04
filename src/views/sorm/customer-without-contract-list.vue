<template lang="pug">
  base-customer-problem-list(
    :fetchFunc="getAllCustomers"
  )
</template>

<script lang="ts">
import { IDRFRequestListParameters } from '@/api/types'
import { Component, Vue } from 'vue-property-decorator'
import { getCustomersWithoutContracts } from './api/req'
import BaseCustomerProblemList from './base-customer-problem-list.vue'

@Component({
  name: 'CustomerWithoutContractList',
  components: {
    BaseCustomerProblemList
  }
})
export default class extends Vue {

  private getAllCustomers(params: IDRFRequestListParameters) {
    return getCustomersWithoutContracts(params)
  }
}
</script>
