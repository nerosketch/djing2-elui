<template lang="pug">
  .app-wrapper(
    :class="classObj"
  )
    .drawer-bg(
      v-if="classObj.mobile && sidebar.opened"
      @click="handleClickOutside"
    )
    sidebar.sidebar-container
    slot
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { AppModule } from '@/store/modules/app'
import { Sidebar } from './components'
import ResizeMixin from './mixin/resize'

import './layout-styles.scss'

@Component({
  name: 'BaseLayout',
  components: {
    Sidebar
  }
})
export default class extends mixins(ResizeMixin) {
  get classObj() {
    return {
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: AppModule.IsMobileDevice
    }
  }

  private handleClickOutside() {
    AppModule.CloseSideBar(false)
  }
}
</script>
