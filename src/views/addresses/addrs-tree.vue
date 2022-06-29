<template lang="pug">
.app-container
  el-tree(
    :props="props"
    :load="loadNode"
    :expand-on-click-node="false"
    node-key="id"
    ref="etree"
    lazy
    :default-expanded-keys="addrIdHierarchy"
    @node-expand="onNodeExpand"
  )
    span.custom-tree-node(slot-scope="{ node, data }")
      span
        b {{ node.label.tn }}
        | &nbsp; {{ node.label.t }}
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
  el-button(
    icon='el-icon-plus'
    type='success'
    @click="addAbsoluteNode"
  ) {{ $t('add') }}
  el-dialog(
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
  )
    address-form(
      @added="frmAddDone"
      @changed="frmChangeDone"
    )
</template>

<script lang="ts">
import { getAddresses, getAddrIdHierarchy } from '@/api/addresses/req'
import { AddrTreeNode, IAddressModel } from '@/api/addresses/types'
import { AddressModule } from '@/store/modules/addresses/address'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { ElTree } from 'element-ui/types/tree'
import { Component, Vue } from 'vue-property-decorator'
import AddressForm from './addr-form.vue'

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
    label: (a: IAddressModel) => ({
      tn: a.fias_address_type_name,
      t: a.title
    }),
    isLeaf: (a: IAddressModel) => (a.children_count === 0)
  }

  private dialogVisible = false
  private parentTitle: string | null = null

  private tmpAddrTreeNode: AddrTreeNode | null = null
  private addrIdHierarchy: number[] = []

  private async loadNode(node: AddrTreeNode, resolve: Function) {
    if (node.level === 0) {
      const r = await this.loadAddresses()
      return resolve(r)
    }

    const r = await this.loadAddresses(node.data.id)
    resolve(r)
  }

  private openEdit(loc: AddrTreeNode) {
    AddressModule.SET_ALL_ADDR(loc.data)
    this.tmpAddrTreeNode = loc
    this.dialogVisible = true
  }

  private addNode(node: AddrTreeNode) {
    AddressModule.RESET_ALL_ADDR()
    AddressModule.SET_ADDR_PARENT(node.data.id)
    this.parentTitle = `${node.data.fias_address_type_name} ${node.data.title}`
    this.dialogVisible = true
  }

  private addAbsoluteNode() {
    AddressModule.RESET_ALL_ADDR()
    this.dialogVisible = true
  }

  private frmAddDone(addr: IAddressModel) {
    this.dialogVisible = false
    this.$message.success(this.$tc('addressObjectAdded'))

    if (addr.parent_addr) {
      this.$refs.etree.append(addr, addr.parent_addr)
    }
  }

  private frmChangeDone(addr: IAddressModel) {
    this.dialogVisible = false
    this.$message.success(this.$tc('rearObjectChanged'))

    if (this.tmpAddrTreeNode) {
      this.tmpAddrTreeNode.data = addr
      this.tmpAddrTreeNode = null
    }
  }

  private async loadAddresses(parent?: number): Promise<IAddressModel[]> {
    const { data } = await getAddresses({
      page: 1,
      page_size: 0,
      parent_addr: parent || 0
      // fields: 'id,title,parent_addr'
    })
    return data as unknown as IAddressModel[]
  }

  get dialogTitle() {
    if (this.$store.state.address.id === 0) {
      if (this.parentTitle) {
        return `Создать адресный объект в "${this.parentTitle}"`
      }
      return 'Создать адресный объект'
    }
    return 'Изменить адресный объект'
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        meta: {
          hidden: true,
          title: this.$tc('addresses')
        }
      }
    ] as any)

    this.loadAddrHierarchyIfExists()
  }
  // End Breadcrumbs

  private onNodeExpand(openedNode: IAddressModel, node: AddrTreeNode, nodeSelf: AddrTreeNode) {
    localStorage.setItem('addrTreeLastId', openedNode.id.toString())
  }

  private loadAddrHierarchyIfExists() {
    const pos = localStorage.getItem('addrTreeLastId')
    if (pos) {
      this.loadAddrIdHierarchy(Number(pos))
    }
  }

  private async loadAddrIdHierarchy(addrId: number) {
    const { data } = await getAddrIdHierarchy(addrId)
    this.addrIdHierarchy = data
    return data
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
