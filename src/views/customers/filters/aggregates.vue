<template lang="pug">
el-card(shadow="never")
  template(v-slot:header) Aggregations

  aggregate-item(
    v-for="v in localAggrs"
    :key="v.un"
    v-model="v.o"
  )
    el-button(
      icon='el-icon-close'
      @click="closeIt(v.un)"
    )

  slot
</template>

<script lang="ts">
import { IAggregateFilter } from '@/api/customers/types'
import { Component, Prop, Vue } from 'vue-property-decorator'
import AggregateItem from './aggragate-item.vue'

interface ILocAggrCopy {
  un: number
  o: IAggregateFilter
}

@Component({
  name: 'Aggregations',
  components: {
    AggregateItem
  }
})
export default class extends Vue {
  @Prop({ required: true }) private value!: IAggregateFilter[]

  private unCounter = 0

  private localAggrs: ILocAggrCopy[] = this.value.map(a => ({
    un: this.unCounter++,
    o: a
  }))

  public addAggregation(f: IAggregateFilter) {
    this.localAggrs.push({
      un: this.unCounter++,
      o: f
    })
  }

  private closeIt(uniq: number) {
    const e = this.localAggrs.findIndex(v => v.un === uniq)
    if (e >= 0) {
      this.localAggrs.splice(e, 1)
    }
  }
}
</script>
