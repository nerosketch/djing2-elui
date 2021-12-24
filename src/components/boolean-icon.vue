<template lang="pug">
  span(:class="iconClass", :style="iconColor")
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'BooleanIcon'
})
export default class extends Vue {
  @Prop({ required: true })
  private value!: boolean

  private get iconClass() {
    return {
      'el-icon-circle-check': this.value,
      'el-icon-circle-close': !this.value
    }
  }

  private get iconColor() {
    return {
      color: this.value ? 'green' : 'red',
    }
  }
}
</script>
