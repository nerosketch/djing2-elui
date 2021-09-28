<template lang="pug">
  el-tree(
    :props="props"
    :load="loadNode"
    lazy
  )
    span.custom-tree-node(slot-scope="{ node, data }")
      el-button(
        type="text"
        icon="el-icon-plus"
        @click="addNode(node)"
      )
      span {{ node.label }}
      el-button(
        type="text"
        icon="el-icon-delete"
        @click="delNode(node)"
      )
</template>

<script lang="ts">
import { getAddresses } from '@/api/addresses/req'
import { IAddressModel } from '@/api/addresses/types'
import { TreeNode } from 'element-ui/types/tree'
import { Component, Vue } from 'vue-property-decorator'

type AddrTreeNode = TreeNode<number, IAddressModel>

@Component({
  name: 'AddrsTree'
})
export default class extends Vue {
  private props = {
    label: 'title',
    // children: 'children',
    // isLeaf: 'leaf'
  }

  private async loadNode(node: AddrTreeNode, resolve: Function) {
    if (node.level === 0) {
      const r = await this.loadAddresses()
      return resolve(r)
    }
    if (node.level > 1) return resolve([]);

    const r = await this.loadAddresses(node.data.id)
    resolve(r)
  }

  private addNode(node: AddrTreeNode) {
  }
  private delNode(node: AddrTreeNode) {
  }

  private async loadAddresses(parent?: number): Promise<IAddressModel[]> {
    const { data } = await getAddresses({
      page: 1,
      page_size: 0,
      parent_addr: parent || 0,
      fields: 'id,title,parent_addr'
    })
    return data as IAddressModel[]
  }
}
</script>

<style>
</style>
