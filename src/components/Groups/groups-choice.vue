<template lang="pug">
  el-select(v-model="localValue" :loading='loading' :disabled="groups.length == 0" clearable :multiple="multiple")
    el-option(
      v-for="(g, i) in groups"
      :key="i"
      :value='g.id'
      :label="g.title"
    )
</template>

<script lang="ts">
import { getGroups } from '@/api/groups/req'
import { IGroup } from '@/api/groups/types'
import { IDRFAxiosResponsePromise, IDRFRequestListParameters } from '@/api/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'GroupsChoice'
})
export default class extends Vue {
  @Prop({ default: 0 }) private value!: number

  @Prop({ default: false }) private multiple!: boolean

  @Prop({ default: null })
  private fetchFunction!: (params?: IDRFRequestListParameters) => IDRFAxiosResponsePromise<IGroup[]>

  private groups: IGroup[] = []

  private localValue = this.value

  private loading = false

  private async loadGroups() {
    this.loading = true
    try {
      const { data } = await (this.fetchFunction || getGroups)({
        page: 1,
        page_size: 0,
        fields: 'id,title'
      }) as any
      console.log('Fetched', data)
      this.groups = data
    } catch (err) {
      this.$message.error(err)
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
    console.log(this.fetchFunction)
    this.loadGroups()
  }
}
</script>
