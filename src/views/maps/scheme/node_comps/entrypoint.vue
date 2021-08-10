<template lang="pug">
div
  h3 Точка входа
  span Описание
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
