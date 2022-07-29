<template lang="pug">
div
  el-select(v-model="gwChoice")
    el-option(
      v-for="g in choices"
      :key="g.val"
      :value="g.val"
      :label="g.title"
    )
  el-divider
  template(v-if="frmComponentGetter")
    component(
      :is="frmComponentGetter"
      @done="done"
    )
  h2(v-else) Выберите тип шлюза
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AlltimeGwForm from './forms/alltime-form.vue'
import RncbGwForm from './forms/rncb-form.vue'

const frmMap = new Map()
frmMap.set(2, RncbGwForm)
frmMap.set(3, AlltimeGwForm)

@Component({
  name: 'NewGwForm'
})
export default class extends Vue {
  private gwChoice = 0

  private choices = [
    {val: 0, title: 'Не выбран'},
    {val: 2, title: 'RNCB'},
    {val: 3, title: 'All time'},
  ]

  private get frmComponentGetter() {
    return frmMap.get(this.gwChoice)
  }

  private done(data: any) {
    this.$emit('done', data)
  }
}
</script>
