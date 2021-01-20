<template lang="pug">
  el-form(
    ref='form'
    label-width="205px"
    size="mini"
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
      label="Уровень адресного объекта"
      prop='ao_level'
    )
      el-select(v-model="frmMod.ao_level" size='mini')
        el-option(
          v-for="al in addrLevels"
          :key="al[0]"
          :label="al[1]"
          :value="al[0]"
        )
    el-form-item(
      label="Тип адресного объекта"
      prop='ao_type'
    )
      el-select(
        size='mini'
        v-model="frmMod.ao_type"
        :disabled="addrTypes.length === 0"
        :loading='typesLoading'
      )
        el-option(
          v-for="at in addrTypes"
          :key="at[0]"
          :label="at[1]"
          :value="at[0]"
        )

    el-form-item
      el-button(
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
      ) Сохранить
</template>

<script lang="ts">
import { getAddrLevels, getAddrTypes } from '@/api/sorm/req'
import { IAddrLevelItem, IAddrTypeItem } from '@/api/sorm/types'
import { FiasRecursiveAddressModule } from '@/store/modules/sorm'
import { Form } from 'element-ui'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'AddrForm'
})
export default class extends Vue {
  private isLoading = false
  private typesLoading = false

  private frmMod = {
    title: '',
    ao_level: 0,
    ao_type: 0
  }

  private addrLevels: IAddrLevelItem[] = []
  private addrTypes: IAddrTypeItem[] = []

  private frmRules = {
    title: [
      { required: true, message: 'Название надо указать', trigger: 'blur' }
    ],
    ao_level: [
      { required: true, message: 'Уровень надо указать', trigger: 'blur' }
    ],
    ao_type: [
      { required: true, message: 'Тип надо указать', trigger: 'blur' }
    ]
  }

  get isNew() {
    return FiasRecursiveAddressModule.id === 0
  }

  created() {
    this.getAddrLevels()
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        let newDat
        if (this.isNew) {
          newDat = await FiasRecursiveAddressModule.AddAddr(this.frmMod)
          this.$message.success('Адресный объект изменён')
        } else {
          newDat = await FiasRecursiveAddressModule.PatchAddr(this.frmMod)
          this.$message.success('Адресный объект создан')
        }
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  @Watch('frmMod.ao_level')
  private onAoLevChanged(aoLevel: number) {
    this.getAddrTypes(aoLevel)
  }

  private async getAddrLevels() {
    const { data } = await getAddrLevels()
    this.addrLevels = data
  }

  private async getAddrTypes(levelNum?: number) {
    this.typesLoading = true
    try {
      const { data } = await getAddrTypes(levelNum)
      this.addrTypes = data
    } finally {
      this.typesLoading = false
    }
  }

  @Watch('$store.state.fiasaddrs.id')
  private onAddrChanged(id: number) {
    this.frmMod.title = FiasRecursiveAddressModule.title
    this.frmMod.ao_level = FiasRecursiveAddressModule.ao_level
    this.frmMod.ao_type = FiasRecursiveAddressModule.ao_type
  }
}
</script>
