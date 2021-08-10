<template lang="pug">
div
  h3 Test vue el: "{{ dt }}"
  el-input(placeholder="Test input" v-model="dt")
  el-button(
    @click="onCl"
  ) El button {{ loading }}
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
import nodeMixin from './node-mixin'

@Component({
  name: 'Test'
})
export default class extends mixins(nodeMixin) {
  private loading = false
  private dt = ''

  private onCl() {
    this.loading = !this.loading
  }
}
</script>
