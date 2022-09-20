<template lang="pug">
el-card(shadow="never")
  template(v-slot:header) Aggregations

  p localAggrs {{ localAggrs }}
  aggregate-item(
    v-for="v in localAggrs"
    :key="v.un"
    v-model="v.o"
  )
    el-button(
      icon='el-icon-close'
      @click="closeIt(v.un)"
    )
</template>

<script lang="ts">
import { IAggregateFilter } from '@/api/customers/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
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
    un: ++this.unCounter,
    o: a
  }))

  public addAggregation(f: IAggregateFilter) {
    this.localAggrs.push({
      un: ++this.unCounter,
      o: f
    })
  }

  @Watch('localAggrs', { deep: true })
  private onChLocAggrs(la: ILocAggrCopy[]) {
    const plainVals = la.map(v => v.o)
    this.$emit('change', plainVals)
  }
}
</script>
