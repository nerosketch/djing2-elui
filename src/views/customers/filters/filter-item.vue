<template lang="pug">
el-row
  el-col(:span='8')
    customer-fields(v-model="localFilter.fieldType" ref='cf')
  el-col(:span='7')
    el-select(v-model="localFilter.compareOperator")
      el-option(
        v-for="f in compareOpts"
        :key="f.v"
        :value='f.v'
        :label="f.l"
      )

  el-col(:span='7')
    component(
      :is="conditionComponent"
      v-model="localFilter.conditionValue"
    )

  el-col(:span='2')
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ICompareItem, IFilterData } from "./api/types";
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

  private conditionComponent = conditionComponents.stringField

  private localFilter: IFilterData = {
    fieldType: this.value.fieldType,
    compareOperator: this.value.compareOperator,
    conditionValue: this.value.conditionValue
  }

  @Watch('localFilter.fieldType')
  private onChFieldType(fieldType: number) {
    if (!fieldType) return
    const metaFound = this.$refs.cf.customerFields.filter(field => field.v === fieldType)
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
    this.conditionComponent = cCompon
  }

  @Watch('localFilter', { deep: true })
  private onChFilter(f: IFilterData) {
    this.$emit('change', f)
  }

  @Watch('value', { deep: true })
  private onChValue(v: IFilterData) {
    if (!v.fieldType && !v.compareOperator && !v.conditionValue) return
    this.$set(this, 'localFilter', v)
  }
}
</script>
