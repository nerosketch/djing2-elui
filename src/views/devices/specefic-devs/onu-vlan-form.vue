<template lang="pug">
  el-form(
    ref='form'
    size="mini"
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='loading'
  )
    el-form-item
      el-card.box-card.onuvlan_miniheader(shadow='never')
        template(v-slot:header)
          .clearfix Port №1
            el-link(style="float: right; padding: 7px" size='mini' icon='el-icon-close' type='danger')
        el-row
          el-col(:span="4" v-for="(v, i) in vlans" :key="i")
            el-tooltip.item(:content="v.title" placement="top")
              el-button-group
                el-button.onuvlan_miniwidth(type='primary' size='mini') T
                el-button(size='mini') {{ v.vid }}
                el-button.onuvlan_miniwidth(type='danger' size='mini' icon='el-icon-close')

        el-button(type="success" icon="el-icon-plus" size='mini' circle)

    p {{ vlans }}
    el-form-item
      el-button-group
        el-button(type="primary" icon="el-icon-download" @click="onSubmit" :loading="loading" size='mini') Применить
        el-button(type="success" icon="el-icon-plus" size='mini') Добавить
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { mixins } from 'vue-class-component'
import VlanMixin from '@/views/networks/components/vlan-mixin'

@Component({
  name: 'OnuVlanForm'
})
export default class extends mixins(VlanMixin) {
  private selectedVlans: number[] = []
  private portTypes: object[] = [
    { title: 'Access', val: 1 },
    { title: 'Trunk', val: 2 }
  ]
  private frmRules = {
    vlan: [
      { required: true, message: 'Vlan нужно выбрать чтоб сохраниться', trigger: 'blur' }
    ]
  }

  private frmMod = {
    vlan: 0
  }

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
}
</script>

<style>
.onuvlan_miniheader>.el-card__header {
  padding: 0 8px !important;
}
.onuvlan_miniwidth{
  padding: 7px 3px;
}
</style>
