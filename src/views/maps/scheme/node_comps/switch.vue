<template lang="pug">
.switch_node
  img(src="maps/switch.png")
  span asldkasd
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
import nodeMixin from './node-mixin'

@Component({
  name: 'SwitchNode'
})
export default class extends mixins(nodeMixin) {}
</script>

<style>
.switch_node {
  width: 64px;
  height: 59px;
}
</style>
