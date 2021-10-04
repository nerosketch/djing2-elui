<template lang="pug">
.app-container
  el-tree(
    :props="props"
    :load="loadNode"
    :expand-on-click-node="false"
    node-key="id"
    ref="etree"
    lazy
    draggable
    :allow-drag="allowDrag"
    :allow-drop="allowDrop"
    @node-drag-start="handleDragStart"
    @node-drag-enter="handleDragEnter"
    @node-drag-leave="handleDragLeave"
    @node-drag-over="handleDragOver"

    @node-drag-end="handleDragEnd"
    @node-drop="handleDrop"
  )
    span.custom-tree-node(slot-scope="{ node, data }")
      span {{ node.label }}
      span
        el-button(
          type="text"
          icon="el-icon-plus"
          @click="addNode(node)"
        )
        el-button(
          type="text"
          icon="el-icon-edit"
          @click="openEdit(node)"
        )
  el-dialog(
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
  )
    address-form(
      v-on:done="frmDone"
    )
</template>

<script lang="ts">
import { getAddresses } from '@/api/addresses/req'
import { IAddressModel } from '@/api/addresses/types'
import { AddressModule } from '@/store/modules/addresses/address'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { ElTree, TreeNode } from 'element-ui/types/tree'
import { Component, Vue } from 'vue-property-decorator'
import AddressForm from './addr-form.vue'


type AddrTreeNode = TreeNode<number, IAddressModel>
type TreeDropType = 'none' | 'before' | 'after' | 'inner'

@Component({
  name: 'AddrsTree',
  components: {
    AddressForm
  }
})
export default class extends Vue {
  public readonly $refs!: {
    etree: ElTree<number, IAddressModel>
  }

  private props = {
    label: 'title',
    // children: 'children',
    // isLeaf: 'leaf'
  }

  private dialogVisible = false

  private async loadNode(node: AddrTreeNode, resolve: Function) {
    if (node.level === 0) {
      const r = await this.loadAddresses()
      return resolve(r)
    }
    if (node.level > 1) return resolve([])

    const r = await this.loadAddresses(node.data.id)
    resolve(r)
  }

  private async openEdit(loc: AddrTreeNode) {
    await AddressModule.SET_ALL_ADDR(loc.data)
    this.dialogVisible = true
  }

  private async addNode(node: AddrTreeNode) {
    await AddressModule.RESET_ALL_ADDR()
    await AddressModule.SET_ADDR_PARENT(node.data.id)
    this.dialogVisible = true
  }

  private frmDone(addr: IAddressModel) {
    this.dialogVisible = false
    this.$message.success('адресный объект сохранён')
    if (addr.parent_addr) {
      this.$refs.etree.append(addr, addr.parent_addr)
    }
  }

  private async loadAddresses(parent?: number): Promise<IAddressModel[]> {
    const { data } = await getAddresses({
      page: 1,
      page_size: 0,
      parent_addr: parent || 0,
      // fields: 'id,title,parent_addr'
    })
    return data as unknown as IAddressModel[]
  }

  get dialogTitle() {
    let t = 'Изменить'
    if (this.$store.state.address.id === 0) {
      t = 'Создать'
    }
    return `${t} адресный объект`
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        meta: {
          hidden: true,
          title: 'Адреса'
        }
      }
    ] as any[])
  }
  // End Breadcrumbs

  private allowDrag(node: AddrTreeNode) {
    return true
  }

  private allowDrop(node: AddrTreeNode) {
    return true
  }
  private handleDragStart(node: AddrTreeNode, ev: any) {
    console.log('handleDragStart:', node, typeof ev)
  }
  handleDragEnter(node: AddrTreeNode, dropNode: AddrTreeNode, ev: any) {
    console.log('tree drag enter: ', dropNode)
  }
  handleDragLeave(node: AddrTreeNode, dropNode: AddrTreeNode, ev: any) {
    console.log('tree drag leave: ', dropNode.label)
  }
  handleDragOver(draggingNode: AddrTreeNode, dropNode: AddrTreeNode, ev: any) {
    console.log('tree drag over: ', dropNode.label)
  }
  handleDragEnd(draggingNode: AddrTreeNode, dropNode: AddrTreeNode, dropType: TreeDropType, ev: any) {
    console.log('tree drag end: ', dropNode && dropNode.label, dropType, typeof dropType, typeof ev)
  }
  handleDrop(draggingNode: AddrTreeNode, dropNode: AddrTreeNode, dropType: TreeDropType, ev: any) {
    console.log('tree drop: ', dropNode.label, dropType, typeof dropType, typeof ev)
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>