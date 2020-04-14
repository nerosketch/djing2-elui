<template lang="pug">
  el-form(
    ref='form'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Название"
      prop='title'
    )
      el-input(v-model="frmMod.title")
    el-form-item(
      label="VID"
      prop='vid'
    )
      el-input(v-model="frmMod.vid" type='number')
    el-form-item(
      label="Управление"
      prop="is_management"
    )
      el-checkbox(v-model="frmMod.is_management") Является-ли вланом управления.
        b {{ frmMod.is_management ? 'Да' : 'Нет' }}
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { IVlanIf } from '@/api/networks/types'
import { VlanIfModule } from '@/store/modules/networks/vlan'

@Component({
  name: 'group-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: 'Название vlan надо указать', trigger: 'blur' }
    ]
  }

  private frmMod: IVlanIf = {
    id: VlanIfModule.id,
    title: VlanIfModule.title,
    vid: VlanIfModule.vid,
    is_management: VlanIfModule.is_management
  }

  get vId() {
    return VlanIfModule.id
  }
  @Watch('vId')
  private async onVlanCh() {
    this.frmMod = await VlanIfModule.GetAllState()
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        await VlanIfModule.SET_ALL(this.frmMod)
        const newDat = await VlanIfModule.SaveVlan()
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
