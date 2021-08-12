<template lang="pug">
  el-card(shadow="hover" :body-style="{ padding: '10px 20px' }")
    template(v-slot:header) Node opts
    color-selector
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ColorSelector from './color-selector.vue'

@Component({
  name: 'NodeOptsIndex',
  components: {
    ColorSelector
  }
})
export default class extends Vue {}
</script>
