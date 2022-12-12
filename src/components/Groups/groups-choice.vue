<template lang="pug">
  el-select(
    v-model="localValue"
    :loading="loading"
    :disabled="groups.length == 0"
    clearable
    :multiple="multiple")
    el-option(
      v-for="(g, i) in groups"
      :key="i"
      :value="g.id"
      :label="g.title")
</template>

<script lang="ts">
import { getGroups } from '@/api/groups/req'
import { IGroup } from '@/api/groups/types'
import { IDRFAxiosResponsePromise, IDRFListResponse, IDRFRequestListParameters } from '@/api/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'GroupsChoice'
})
export default class extends Vue {
  @Prop({ default: 0 }) private value!: number

  @Prop({ default: false }) private multiple!: boolean

  @Prop({ default: null })
  private fetchFunction!: (params?: IDRFRequestListParameters) => IDRFAxiosResponsePromise<IDRFListResponse<IGroup>>

  private groups: IGroup[] = []

  private localValue = this.value

  private loading = false

  private async loadGroups() {
    this.loading = true
    try {
      const { data } = await (this.fetchFunction || getGroups)({
        fields: 'id,title'
      })
      this.groups = data.results
    } finally {
      this.loading = false
    }
  }

  @Watch('localValue')
  private onChLocVal(v: number) {
    this.$emit('input', v)
  }

  @Watch('value')
  private onChVal() {
    this.localValue = this.value
  }

  created() {
    this.loadGroups()
  }

  // private onSel(grpId: number) {
  //   const fl = this.groups.filter(g => g.id === grpId)
  //   if (fl && fl.length > 0) {
  //     this.$emit('select', fl[0])
  //   }
  // }
}
</script>
