<template lang="pug">
base-layout
  .main-container
    navbar
    section.app-main
      breadcrumb.breadcrumb-container
    router-view
    //- transition(
    //-   name="fade-transform"
    //-   mode="out-in"
    //- )
      router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BaseLayout from './base.vue'
import { Navbar } from './components'
import Breadcrumb from '@/components/Breadcrumb/index.vue'

@Component({
  name: 'LayoutRegular',
  components: {
    BaseLayout,
    Navbar,
    Breadcrumb,
  }
})
export default class extends Vue {}
</script>
