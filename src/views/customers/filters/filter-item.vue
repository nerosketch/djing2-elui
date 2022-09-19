<template lang="pug">
el-row
  el-col(:span='8')
    el-select(v-model="selectedFieldType")
      el-option(
        v-for="f in customerFields"
        :key="f.v"
        :value='f.v'
        :label="f.l"
      )

  el-col(:span='8')
    el-select(v-model="selectedCompareOperator" required)
      el-option(
        v-for="f in compareOpts"
        :key="f.v"
        :value='f.v'
        :label="f.l"
      )

  el-col(:span='8')
    component(
      :is="conditionComponent"
      v-model="conditionValue"
    )
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { ICompareItem } from "./types";
import { compares, conditionComponents, customerFields } from './filters'

@Component({
  name: 'FilterItem'
})
export default class extends Vue {
  private selectedFieldType = 0
  private customerFields = customerFields

  private selectedCompareOperator = 0
  private compareOpts: ICompareItem[] = [
    { v: 0, l: 'Not Selected' },
  ]

  private conditionValue = null
  private conditionComponent = conditionComponents.stringField

  @Watch('selectedFieldType')
  private onChFieldType(fieldType: number) {
    const metaFound = customerFields.filter(field => field.v === fieldType)
    if (metaFound.length === 0) return
    const meta = metaFound[0]

    const fieldTypeName = meta.m.fieldType

    const cmps = compares[fieldTypeName]
    // cmps.push({ v: 0, l: 'not Selected' })
    this.$set(this, 'compareOpts', cmps)
    this.selectedCompareOperator = cmps[0].v

    // Fill condition
    const cCompon = conditionComponents[fieldTypeName]
    this.conditionValue = null
    this.conditionComponent = cCompon
  }

}
</script>
