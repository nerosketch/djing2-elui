<template lang="pug">
div(:class="{'tab-container': !dense}")
  slot(name='head')
  el-tabs(v-model="activeTabName" type="border-card")
    el-tab-pane(
      v-for="t in tabs"
      :label="t.title"
      :name="t.name"
      lazy
    )
      slot(:name="t.name")

  slot(name="additional_tabs")
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

  @Watch('activeTabName')
  private onActiveNameChange(value: string) {
    const newPath = `${this.$route.path}?tab=${value}`
    if (newPath !== this.$route.fullPath) {
      this.$router.push(newPath)
    }
  }

  @Watch('$route.query')
  private onChangedQuery({ tab }: Dictionary<string>) {
    if (tab && tab !== this.activeTabName) {
      this.activeTabName = tab
    }
  }

  created() {
    // Init the default selected tab
    const tab = this.$route.query.tab as string
    if (tab) {
      this.activeTabName = tab
    }
  }
}
</script>
