<template lang="pug">
.entrypoint_item
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
import nodeMixin from './node-mixin'

@Component({
  name: 'Entrypoint'
})
export default class extends mixins(nodeMixin) {
}
</script>

<style>
.entrypoint_item {
  width: 64px;
  height: 46px;
  background: url(/maps/router.png) no-repeat center;
}
</style>