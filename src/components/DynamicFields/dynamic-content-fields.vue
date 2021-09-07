<template lang="pug">
  el-card(shadow="never")
    template(v-slot:header)
      .clearfix Дополнительные данные
    el-form
      template(v-if="localContents.length > 0")
        el-form-item(
          v-for="(f, i) in localContents"
          :key="i"
          :label="f.title"
        )
          el-input(v-model="f.content")
      h3(v-else) Нет полей
      el-form-item
        el-button(
          icon='el-icon-upload'
          type="primary" @click="saveData"
        ) Сохранить
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IDynamicContentFieldList } from '@/api/dynamic-fields/types'

@Component({
  name: 'DynamicContentFields'
})
export default class extends Vue {
  @Prop({ required: true })
  private contents!: IDynamicContentFieldList

  @Watch('contents', { deep: true })
  private onChCont(cont: IDynamicContentFieldList) {
    this.localContents = cont
  }

  private localContents: IDynamicContentFieldList = this.contents

  private saveData() {
    this.$emit('save', this.localContents)
  }
}
</script>
