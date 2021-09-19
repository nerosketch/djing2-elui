<template lang="pug">
.tab-container
  el-tabs(
    type="border-card"
    v-model="activeName"
  )
    el-tab-pane(
      label='Мессенджеры'
      name='messengers'
    )
      keep-alive
        messenger-type-list
    el-tab-pane(
      label="Настройки"
      name='options'
      lazy
    )
      keep-alive
        messenger-options
</template>

<script lang="ts">
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteRecord } from 'vue-router'
import MessengerTypeList from './type-list.vue'
import MessengerOptions from './options/index.vue'

@Component({
  name: 'MessengerIndex',
  components: {
    MessengerTypeList,
    MessengerOptions
  }
})
export default class extends Vue {
  private activeName = 'messengers'

  created() {
    // Init the default selected tab
    const tab = this.$route.query.tab as string
    if (tab) {
      this.activeName = tab
    }

    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Мессенджеры'
        }
      }
    ] as RouteRecord[])
  }

  @Watch('activeName')
  private onActiveNameChange(value: string) {
    const newPath = `${this.$route.path}?tab=${value}`
    if (newPath !== this.$route.fullPath) {
      this.$router.push(newPath)
    }
  }
}
</script>
