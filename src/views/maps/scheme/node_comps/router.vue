<template lang="pug">
  .router_node(ref='refrouter')
    span(contenteditable) Сад_Степная_7_5.109
    img(src="/maps/router.png")
    el-button-group
      el-button(
        icon='el-icon-s-tools'
        size='mikro'
        @click="colorEmit"
      )
      el-button(
        icon='el-icon-edit'
        size='mikro'
      )
    input.hidden(
      type="color"
      ref="colorinput"
      v-model="colorValue"
    )
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Watch } from 'vue-property-decorator'
import nodeMixin from './node-mixin'

@Component({
  name: 'Router'
})
export default class extends mixins(nodeMixin) {
  public readonly $refs!: {
    colorinput: HTMLInputElement
    refrouter: HTMLDivElement
  }
  private colorValue = '#ccc'

  private colorEmit() {
    this.$refs.colorinput.click()
  }

  @Watch('colorValue')
  private onColorChanged(color: string) {
    const parentRouter = this.$refs.refrouter.closest<HTMLDivElement>('.Router')
    if (parentRouter) {
      parentRouter.style.backgroundColor = `${color}69`
    }
  }
}
</script>

<style>
.router_node {
  width: 191px;
  height: 85px;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
}
.router_node>* {
  padding: 2px 0;
}
.el-button--mikro {
  padding: 4px 7px;
  font-size: 10px;
  border-radius: 2px;
}
</style>
