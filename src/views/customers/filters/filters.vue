<template lang="pug">
el-card(shadow="never")
  template(v-slot:header) Filters

  filter-item(
    v-for="v in filters"
    :key="v.un"
    v-model="v.o"
  )
      el-button(
        icon='el-icon-close'
        @click="closeIt(v.un)"
      )

  el-divider

  el-button(@click="addFilter") +
  el-button filter customers
  el-button Save filter

  slot

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
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
  private unCounter = 0

  public filters: ILocFiltCopy[] = [
    {
      un: ++this.unCounter,
      o: {
        field: 0,
        compareOperator: 0,
        conditionValue: null
      }
    }
  ]

  private closeIt(uniq: number) {
    const e = this.filters.findIndex(v => v.un === uniq)
    if (e >= 0) {
      this.filters.splice(e, 1)
    }
  }

  private addFilter() {
    this.filters.push({
      un: ++this.unCounter,
      o: {
        field: 0,
        compareOperator: 0,
        conditionValue: null
      }
    })
  }
}
</script>
