<template lang="pug">
el-card(shadow="never")
  template(v-slot:header) Filters

  filter-item(
    v-for="i in filtersCount"
    :key="i"
  )

  el-divider

  el-button(@click="filtersCount ++") +
  el-button(
    @click="filtersCount --"
    :disabled="filtersCount === 0"
  ) -
  el-button filter customers
  el-button Save filter

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import FilterItem from './filter-item.vue'

@Component({
  name: 'Filters',
  components: {
    FilterItem
  }
})
export default class extends Vue {
  private filtersCount = 1
}
</script>
