<template lang="pug">
.router_node
  span(contenteditable) asldkasd
  img(src="/maps/router.png")
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
import nodeMixin from './node-mixin'

@Component({
  name: 'Router'
})
export default class extends mixins(nodeMixin) {
}
</script>

<style>
.router_node {
  width: 64px;
  /* height: 59px; */
  /* align-content: center; */
}
.router_node span {
  display: block;
  text-align: center;
}
</style>