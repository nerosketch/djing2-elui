<template lang="pug">
  h3 Device
    el-input(
      prefix-icon="el-icon-receiving"
      v-model="text"
    )
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
import nodeMixin from './node-mixin'

@Component({
  name: 'Device'
})
export default class extends mixins(nodeMixin) {
  private text = ''
}
</script>
