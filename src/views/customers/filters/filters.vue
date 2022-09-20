<template lang="pug">
el-card(shadow="never")
  template(v-slot:header) Filters

  el-row(
    v-for="v in filters"
    :key="v.un"
  )
    el-col(:span='22')
      filter-item(v-model="v.o")
    el-col(:span='2')
      el-button(
        type='link'
        icon='el-icon-close'
        @click="closeIt(v.un)"
      )

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import FilterItem from './filter-item.vue'
import { IFilterData } from '@/api/customers/types'

interface ILocFiltCopy {
  un: number
  o: IFilterData
}

@Component({
  name: 'Filters',
  components: {
    FilterItem
  }
})
export default class extends Vue {
  @Prop({ required:true }) private value!: IFilterData[]

  private unCounter = 0

  private filters: ILocFiltCopy[] = this.value.map(v => ({
    un: this.unCounter++,
    o: v
  }))

  private closeIt(uniq: number) {
    const e = this.filters.findIndex(v => v.un === uniq)
    if (e >= 0) {
      this.filters.splice(e, 1)
    }
  }

  public addFilter(f: IFilterData) {
    this.filters.push({
      un: this.unCounter++,
      o: f
    })
  }

  @Watch('filters', { deep: true })
  private onChFilters(fl: ILocFiltCopy[]) {
    const plainVals = fl.map(v => v.o)
    this.$emit('input', plainVals)
  }
}
</script>
