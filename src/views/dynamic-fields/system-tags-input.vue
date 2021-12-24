<template>  
  <el-select v-model="selectedTag" :loading="loading">
    <el-option v-for="(t, i) in tags" :key="i" :label="t.label" :value="t.value"></el-option>
  </el-select>
</template>

<script lang="ts">
import { getFieldSystemTags } from '@/api/dynamic-fields/req'
import { IDynamicFieldSystemTag } from '@/api/dynamic-fields/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'SystemTagsInput'
})
export default class extends Vue {
  @Prop({ required: true })
  private value!: number

  private tags: IDynamicFieldSystemTag[] = []
  private loading = false
  private selectedTag = this.value

  @Watch('value')
  private onChangeValue(v: number) {
    this.selectedTag = v
  }

  @Watch('selectedTag')
  private onChangedTag(tag: number) {
    this.$emit('input', tag)
  }

  private async loadSystemTags() {
    this.loading = true
    try {
      const { data } = await getFieldSystemTags()
      this.tags = data
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadSystemTags()
  }
}
</script>
