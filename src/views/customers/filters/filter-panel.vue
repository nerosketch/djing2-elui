<template lang="pug">
  el-row
    el-col(:span="8")
      filters
    el-col(:span="8")
      h1 Annotations
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Filters from './filters.vue'

@Component({
  name: 'FilterPanel',
  components: {
    Filters
  }
})
export default class extends Vue {}
</script>
