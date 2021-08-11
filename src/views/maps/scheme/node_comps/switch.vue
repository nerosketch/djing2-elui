<template lang="pug">
.switch_node
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component, Vue } from 'vue-property-decorator'
import nodeMixin from './node-mixin';

@Component({
  name: 'SwitchNode'
})
export default class extends mixins(nodeMixin) {}
</script>

<style>
.switch_node {
  width: 64px;
  height: 46px;
  background: url(/maps/switch.png) no-repeat center;
}
</style>
