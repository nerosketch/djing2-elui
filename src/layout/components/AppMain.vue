<template>
  <section class="app-main">
    <breadcrumb
      class="breadcrumb-container"
    />
    <router-view />
    <!--<transition
      name="fade-transform"
      mode="out-in"
    >
      <router-view />
    </transition> -->
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Breadcrumb from '@/components/Breadcrumb/index.vue'

@Component({
  name: 'AppMain',
  components: {
    Breadcrumb
  }
})
export default class extends Vue {}
</script>

<style lang="scss">
.app-main {
  overflow: hidden;
}
.el-breadcrumb__item {
  line-height: 33px;
  height: 19px;
}
</style>
