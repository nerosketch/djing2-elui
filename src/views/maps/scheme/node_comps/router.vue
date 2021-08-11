<template lang="pug">
.router_node
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
  height: 46px;
  background: url(/maps/router.png) no-repeat center;
}
</style>