<template>
  <div
    :class="[{'is-active': isActive}]"
    @click="toggleClick"
  >
    <i class="hamb el-icon-s-fold" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'Hamburger'
})
export default class extends Vue {
  @Prop({ default: false }) private isActive!: boolean

  private toggleClick() {
    this.$emit('toggleClick')
  }
}
</script>

<style lang="scss" scoped>
.hamb {
  width: 20px;
  height: 20px;
  vertical-align: sub;
  font-size: larger;
}
.is-active {
  transform: rotate(180deg);
}
</style>
