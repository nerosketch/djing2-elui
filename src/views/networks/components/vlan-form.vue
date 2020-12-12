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
      el-button(
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
      ) Сохранить
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
    ],
    vid: [
      { required: true, message: 'Стартовый ip надо указать', trigger: 'blur' },
      {
        validator: (rule: any, value: number, callback: Function) => {
          if (value && value > 1 && value < 4095) {
            callback()
          } else {
            callback(new Error(rule.message))
          }
        },
        trigger: 'change',
        message: 'Vlan может быть в пределах 2-4094'
      }
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
    this.frmMod = await VlanIfModule.GetAllVlanState()
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          let newVlan
          if (VlanIfModule.id === 0) {
            newVlan = await VlanIfModule.AddVlan(this.frmMod)
          } else {
            newVlan = await VlanIfModule.PatchVlan(this.frmMod)
          }
          this.$emit('done', newVlan)
        } catch (err) {
          this.$message.error(err)
        }
        this.isLoading = false
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
