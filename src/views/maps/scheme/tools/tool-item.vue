<template lang="pug">
  drag.text.item.list-item(
    draggable="true"
    :data="nodeItem"
  ) {{ nodeItem.description }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Drag } from "vue-easy-dnd"
import { VueClassContainer } from '../node_comps'


@Component({
  name: 'ToolItem',
  components: {
    Drag
  }
})
export default class extends Vue {
  @Prop({ required: true })
  private nodeItem!: VueClassContainer
}
</script>

<style scoped>
.list-item {
  background-color: white;
}
</style>
