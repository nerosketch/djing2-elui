<template lang="pug">
div(:class="{'tab-container': !dense}")
  slot(name='head')
  el-tabs(v-model="localActiveTab" type="border-card")
    el-tab-pane(
      v-for="(t, i) in tabs"
      :label="t.title"
      :name="t.name || 'default'"
      :key="i"
      lazy
    )
      slot(:name="t.name")

    slot(name="additional_tabs")

  slot
</template>

<script lang="ts">
import { TranslateResult } from 'vue-i18n'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Dictionary } from 'vue-router/types/router'

export interface ICustomTabItem {
  title: string | TranslateResult
  name?: string
  disabled?: boolean
}

@Component({
  name: 'Tabs'
})
export default class extends Vue {
  @Prop({ required: true })
  private tabs!: ICustomTabItem[]

  @Prop({ default: 'default' })
  private activeTabName!: string

  @Prop({ default: false })
  private dense!: boolean

  private localActiveTab: string = this.activeTabName

  @Watch('localActiveTab')
  private onActiveNameChange(value: string) {
    // if query is empty, and local tab is default tab
    if (value === this.activeTabName) {
      if (this.$route.path !== this.$route.fullPath) {
        this.$router.push(this.$route.path)
      }
      return
    }
    const newPath = `${this.$route.path}?tab=${value}`
    if (newPath !== this.$route.fullPath) {
      this.$router.push(newPath)
    }
  }

  @Watch('$route.query')
  private onChangedQuery({ tab }: Dictionary<string>) {
    this.localActiveTab = tab || this.activeTabName
  }

  created() {
    // Init the default selected tab
    const tab = this.$route.query.tab as string || this.activeTabName
    if (tab && tab !== this.localActiveTab) {
      this.localActiveTab = tab
    }
  }
}
</script>
