<template lang="pug">
div
  el-tree(
    :props="props"
    :load="loadNode"
    :expand-on-click-node="false"
    node-key="id"
    lazy
    v-loading="isLoading"
    v-on:node-click="nodeClick"
  )
  el-button(
    icon='el-icon-circle-check'
    type='primary'
    :disabled="!isSaveIsActive"
    @click="saveSelected"
  ) Ok

</template>

<script lang="ts">
import { getAddresses } from '@/api/addresses/req'
import { AddrTreeNode, IAddressModel } from '@/api/addresses/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'AddrSelectForm'
})
export default class extends Vue {
  private isLoading = false

  @Prop({ required: true })
  private value!: number

  private origVal = this.value || 0
  private localValue = this.value || 0

  private props = {
    label: (a: IAddressModel) => `${a.fias_address_type_name} ${a.title}`,
  }

  private async loadNode(node: AddrTreeNode, resolve: Function) {
    if (node.level === 0) {
      const r = await this.loadAddresses()
      return resolve(r)
    }
    const r = await this.loadAddresses(node.data.id)
    resolve(r)
  }

  private async loadAddresses(parent?: number): Promise<IAddressModel[]> {
    this.isLoading = true
    try {
      const { data } = await getAddresses({
        page: 1,
        page_size: 0,
        parent_addr: parent || 0,
        // fields: 'id,title,parent_addr'
      })
      return data as unknown as IAddressModel[]
    } finally {
      this.isLoading = false
    }
  }

  private get isSaveIsActive() {
    return Boolean(this.localValue) && this.origVal !== this.localValue
  }

  private nodeClick(addr: IAddressModel) {
    this.localValue = addr.id
  }


  private saveSelected() {
    this.$emit('done', this.localValue)
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.$emit('input', val)
  }

  @Watch('value')
  private onChVal(v: number) {
    this.localValue = v
  }}
</script>
