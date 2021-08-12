<template lang="pug">
  el-color-picker(
    v-model="color"
    :disabled="disabled"
  )
</template>

<script lang="ts">
// import Drawflow from 'drawflow'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ColorSelector'
})
export default class extends Vue {
  @Prop({ default: false })
  private disabled!: boolean

  private color = ''
}
</script>
