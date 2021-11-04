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
    :allow-drop="allowDrop"
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
import { changeAddress, getAddresses } from '@/api/addresses/req'
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
    label: (a: IAddressModel) => `${a.fias_address_type_name} ${a.title}`,
  }

  private dialogVisible = false

  private tmpAddrTreeNode: AddrTreeNode | null = null

  private async loadNode(node: AddrTreeNode, resolve: Function) {
    if (node.level === 0) {
      const r = await this.loadAddresses()
      return resolve(r)
    }

    const r = await this.loadAddresses(node.data.id)
    resolve(r)
  }

  private async openEdit(loc: AddrTreeNode) {
    await AddressModule.SET_ALL_ADDR(loc.data)
    this.tmpAddrTreeNode = loc
    this.dialogVisible = true
  }

  private addNode(node: AddrTreeNode) {
    AddressModule.RESET_ALL_ADDR()
    AddressModule.SET_ADDR_PARENT(node.data.id)
    this.dialogVisible = true
  }

  private async addAbsoluteNode() {
    await AddressModule.RESET_ALL_ADDR()
    this.dialogVisible = true
  }

  private frmAddDone(addr: IAddressModel) {
    this.dialogVisible = false
    this.$message.success('Адресный объект добавлен')

    if (addr.parent_addr) {
      this.$refs.etree.append(addr, addr.parent_addr)
    }
  }

  private frmChangeDone(addr: IAddressModel) {
    this.dialogVisible = false
    this.$message.success('Адресный объект изменён')

    if (this.tmpAddrTreeNode) {
      this.tmpAddrTreeNode.data = addr
      this.tmpAddrTreeNode = null
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
    let t
    if (this.$store.state.address.id === 0) {
      t = this.$t('add').toString()
    } else {
      t = this.$t('change').toString()
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
    ] as any)
  }
  // End Breadcrumbs

  private allowDrop(node: AddrTreeNode, dropNode: AddrTreeNode, type: TreeDropType) {
    return type === 'inner'
  }

  private handleDrop(draggingNode: AddrTreeNode, dropNode: AddrTreeNode, dropType: TreeDropType) {
    if (dropType === 'inner') {
      changeAddress(draggingNode.data.id, {
        parent_addr: dropNode.data.id
      })
    }
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
