<template lang="pug">
  #app
    router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'App'
})
export default class extends Vue {}
</script>
