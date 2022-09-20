<template lang="pug">
el-row(:gutter="5")
  el-col(:span='8')
    customer-fields(
      v-model="localFilter.field"
      ref='cf'
    )

  el-col(:span='7')
    el-select(
      v-model="localFilter.compareOperator"
      :disabled="localFilter.compareOperator===0"
    )
      el-option(
        v-for="f in compareOpts"
        :key="f.v"
        :value='f.v'
        :label="f.l"
      )

  el-col(:span='7')
    component(
      v-if="conditionComponent"
      :is="conditionComponent"
      v-model="localFilter.conditionValue"
    )
    span(v-else) —

  el-col(:span='2')
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ICompareItem, IFilterData } from "@/api/customers/types"
import { compares, conditionComponents } from './filters'
import CustomerFields from './customerFields.vue'

@Component({
  name: 'FilterItem',
  components: {
    CustomerFields
  }
})
export default class extends Vue {
  public readonly $refs!: {
    cf: CustomerFields
  }
  @Prop({ required: true }) private value!: IFilterData

  private compareOpts: ICompareItem[] = [
    { v: 0, l: 'Not Selected' },
  ]

  private conditionComponent = null

  private localFilter: IFilterData = {
    field: this.value.field,
    compareOperator: this.value.compareOperator,
    conditionValue: this.value.conditionValue
  }

  @Watch('localFilter.field')
  private onChFieldType(field: number) {
    if (!field) return
    const metaFound = this.$refs.cf.customerFields.filter(f => f.v === field)
    if (metaFound.length === 0) return
    const meta = metaFound[0]

    const fieldTypeName = meta.m.fieldType

    const cmps = compares[fieldTypeName]
    // cmps.push({ v: 0, l: 'not Selected' })
    this.$set(this, 'compareOpts', cmps)
    this.localFilter.compareOperator = cmps[0].v

    // Fill condition
    const cCompon = conditionComponents[fieldTypeName]
    this.localFilter.conditionValue = null
    if (cCompon) {
      this.conditionComponent = cCompon
    } else {
      this.conditionComponent = null
    }
  }

  @Watch('localFilter', { deep: true })
  private onChFilter(f: IFilterData) {
    this.$emit('change', f)
  }

  @Watch('value', { deep: true })
  private onChValue(v: IFilterData) {
    if (!v.field && !v.compareOperator && !v.conditionValue) return
    this.$set(this, 'localFilter', v)
  }
}
</script>
