<template lang="pug">
  customer-location-list
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CustomerLocationList from '@/views/customers/customer-locations.vue'

@Component({
  name: 'CustomerContractIndex',
  components: {
    CustomerLocationList
  }
})
export default class extends Vue {}
</script>
