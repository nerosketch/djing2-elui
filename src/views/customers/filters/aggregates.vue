<template lang="pug">
el-card(shadow="never")
  template(v-slot:header) Aggregations

  aggregate-item
  aggregate-item
  aggregate-item
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AggregateItem from './aggragate-item.vue'

@Component({
  name: 'Aggregations',
  components: {
    AggregateItem
  }
})
export default class extends Vue {}
</script>
