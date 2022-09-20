<template lang="pug">
el-row(:gutter="5")
  el-col(:span='7')
    el-select(v-model="localFilter.aggr")
      el-option(
        v-for="f in aggregates"
        :key="f.v"
        :value='f.v'
        :label="f.l"
      )

  el-col(:span='15')
    filter-item(v-model="localFilter.filter")

  slot
</template>

<script lang="ts">
import { IAggregateFilter } from '@/api/customers/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import FilterItem from './filter-item.vue'
import { aggregates } from './filters'

@Component({
  name: 'AggregateFilter',
  components: {
    FilterItem
  }
})
export default class extends Vue {
  @Prop({ required: true }) private value!: IAggregateFilter

  private localFilter: IAggregateFilter = this.value

  private aggregates = aggregates

  @Watch('localFilter', { deep: true })
  private onChLocFilt(lf: IAggregateFilter) {
    this.$emit('input', lf)
  }

  @Watch('value', { deep: true })
  private onChVal(v: IAggregateFilter) {
    this.localFilter = v
  }
}
</script>
