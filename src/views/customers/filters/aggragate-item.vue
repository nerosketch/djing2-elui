<template lang="pug">
el-row(:gutter="5")
  el-col(:span='8')
    el-select(v-model="localFilter.aggr")
      el-option(
        v-for="f in aggregates"
        :key="f.v"
        :value='f.v'
        :label="f.l"
      )

  el-col(:span='16')
    filter-item(v-model="localFilter.filter")

  //- el-col(:span='7')
  //-   component(
  //-     :is="conditionComponent"
  //-     v-model="localFilter.conditionValue"
  //-   )
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import CustomerFields from './customerFkFields.vue'
import FilterItem from './filter-item.vue'

const aggregates = [
  { v: 1, l: 'Count'    },
  { v: 2, l: 'Sum'      },
  { v: 3, l: 'Max'      },
  { v: 4, l: 'Min'      },
  { v: 5, l: 'ArrayAgg' },
  { v: 6, l: 'Avg'      },
  { v: 7, l: 'StdDev'   },
]

@Component({
  name: 'AggregateFilter',
  components: {
    FilterItem
  }
})
export default class extends Vue {
  private localFilter = {
    aggr: 0,
    filter: {
      field: 0,
      compareOperator: 0,
      conditionValue: null
    }
  }

  private aggregates = aggregates
}
</script>
