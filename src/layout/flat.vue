<template lang="pug">
base-layout
  .main-container
    router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BaseLayout from './base.vue'

@Component({
  name: 'LayoutRegular',
  components: {
    BaseLayout,
  }
})
export default class extends Vue {}
</script>
