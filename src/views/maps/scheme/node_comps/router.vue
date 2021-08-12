<template lang="pug">
  .router_node
    el-popover(
      trigger="click"
    )
      node-opts-index
      i.el-icon-s-tools.btn_opts(
        slot="reference"
      )
    span(contenteditable) asldkasd
    img(src="/maps/router.png")

</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
import nodeMixin from './node-mixin'
import NodeOptsIndex from '../node-opts/index.vue'

@Component({
  name: 'Router',
  components: {
    NodeOptsIndex
  }
})
export default class extends mixins(nodeMixin) {
  private optsVisible = false
}
</script>

<style>
.router_node {
  width: 64px;
  /* height: 59px; */
  /* align-content: center; */
}
.router_node>* {
  display: block;
  text-align: center;
}
.btn_opts {
  margin-top: -11px;
  margin-left: -13px;
  width: 16px;
  font-size: x-small;
  cursor: pointer;
}
</style>
