<template lang="pug">
div(:class="{'tab-container': !dense}")
  slot(name='head')
  el-tabs(v-model="localActiveTab" type="border-card")
    el-tab-pane(
      v-for="(t, i) in tabs"
      :label="t.title"
      :name="t.name"
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
import { Dictionary } from "vue-router/types/router"

export interface ICustomTabItem {
  title: string | TranslateResult
  name: string
  disabled?: boolean
}

@Component({
  name: 'Tabs'
})
export default class extends Vue {
  @Prop({ required: true })
  private tabs!: ICustomTabItem[]

  @Prop({ required: true })
  private activeTabName!: string

  @Prop({ default: false })
  private dense!: boolean

  private localActiveTab: string = ''

  @Watch('localActiveTab')
  private onActiveNameChange(value: string) {
    const newPath = `${this.$route.path}?tab=${value}`
    if (newPath !== this.$route.fullPath) {
      this.$router.push(newPath)
    }
  }

  @Watch('$route.query')
  private onChangedQuery({ tab }: Dictionary<string>) {
    if (tab && tab !== this.localActiveTab) {
      this.localActiveTab = tab
    }
  }

  created() {
    this.localActiveTab = this.activeTabName

    // Init the default selected tab
    const tab = this.$route.query.tab as string
    if (tab) {
      this.localActiveTab = tab
    }
  }
}
</script>
