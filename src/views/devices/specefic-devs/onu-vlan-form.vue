<template lang="pug">
  el-card(shadow='never')
    template(v-slot:header)
      span Редактировать VLAN на ONU
    el-card.box-card.onuvlan_miniheader(shadow='never')
      template(v-slot:header)
        el-link(
          style="float: right"
          size='mini'
          icon='el-icon-close'
          type='danger'
          @click="delVlanPort"
        )
        | Port №1
      el-row
        el-col(:span="4" v-for="(v, i) in vlans" :key="i")
          el-tooltip.item(
            :content="v.title"
            placement="top"
          )
            el-button-group
              el-button.onuvlan_miniwidth(
                type='primary'
                size='mini'
                @click="changeVlanMode(v)"
              ) T
              el-button(size='mini') {{ v.vid }}
              el-button.onuvlan_miniwidth(
                type='danger'
                size='mini'
                icon='el-icon-close'
                @click="vlanRemove(v)"
              )

      el-button(
        type="success"
        icon="el-icon-plus"
        size='mini'
        circle
        @click="addVlanVisible=true"
      )

    p {{ vlans }}
    el-button-group
      el-button(
        type="primary"
        icon="el-icon-download"
        @click="onSubmit"
        :loading="loading"
        size='mini'
      ) Применить
      el-button(
        type="success"
        icon="el-icon-plus"
        size='mini'
        @click="addVlanPortVisible=true"
      ) Добавить

    el-dialog(
      :visible.sync="addVlanPortVisible"
      title="Добавить порт"
    )
      keep-alive
        add-vlan-port(
          v-on:done="addVlanPortDone"
        )
    el-dialog(
      :visible.sync="addVlanVisible"
      title="Добавить vlan на порт"
    )
      keep-alive
        add-vlan(
          v-on:done="addVlanDone"
        )
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { mixins } from 'vue-class-component'
import VlanMixin from '@/views/networks/components/vlan-mixin'
import { IVlanIf } from '@/api/networks/types'
import AddVlanPort from './add-vlan-port.vue'
import AddVlan from './add-vlan.vue'

@Component({
  name: 'OnuVlanForm',
  components: { AddVlanPort, AddVlan }
})
export default class extends mixins(VlanMixin) {
  private addVlanPortVisible = false
  private addVlanVisible = false
  // private portTypes: object[] = [
  //   { title: 'Access', val: 1 },
  //   { title: 'Trunk', val: 2 }
  // ]

  created() {
    this.loadVlans()
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.$message.success('Типо сохранил')
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private addVlanPortDone(portId: number) {
    this.$message({
      type: 'info',
      message: 'port Id: ' + portId
    })
    this.addVlanPortVisible = false
  }

  private vlanRemove(v: IVlanIf) {
    this.$confirm('Удалить vlan с порта?').then(() => {
      this.$message.success('Типо удалён')
    })
  }

  private changeVlanMode(v: IVlanIf) {
    this.$message.success('Типо поменяли режим Trunk/Success')
  }

  private addVlanDone(vlanId: number) {
    this.$message({
      type: 'info',
      message: 'vlan Id: ' + vlanId
    })
    this.addVlanVisible = false
  }

  private delVlanPort() {
    this.$confirm('Удалить настройки с порта?').then(() => {
      this.$message.success('Типо удалён')
    })
  }
}
</script>

<style>
/*.onuvlan_miniheader>.el-card__header {
  padding: 0 8px !important;
}*/
.onuvlan_miniwidth{
  padding: 7px 3px;
}
</style>
