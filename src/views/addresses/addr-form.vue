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
      label="Уровень ФИАС"
      prop='fias_address_level'
    )
      fias-level-choice(v-model="frmMod.fias_address_level")
    el-form-item(
      label="Тип адреса ФИАС"
      prop='fias_address_level'
    )
      fias-type-choice(
        v-model="frmMod.fias_address_type"
        :level="frmMod.fias_address_level"
      )
    el-form-item(
      label="Родительский адресный объект"
    )
      address-choice(
        v-model="frmMod.parent_addr"
      )
    el-form-item(
      label="Тип адресного объекта"
      prop='address_type'
    )
      address-type-choice(
        v-model="frmMod.address_type"
      )
    el-form-item
      el-button(
        icon='el-icon-upload'
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
      ) Сохранить

      el-divider(direction="vertical")

      el-link(
        href="https://github.com/hflabs/socrbase/blob/master/socrbase.csv"
        target="_blank"
        type="info"
        icon="el-icon-thumb"
      ) Справочник адресных объектов
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { AddressModule } from '@/store/modules/addresses/address'
import AddressChoice from '@/components/Address/address-choice.vue'
import AddressTypeChoice from '@/components/Address/type-choice.vue'
import { IAddressModel } from '@/api/addresses/types'
import { positiveNumberValueAvailable } from '@/utils/validate'
import FiasLevelChoice from '@/components/Address/fias-level-choice.vue'
import FiasTypeChoice from '@/components/Address/fias-type-choice.vue'

@Component({
  name: 'AddressForm',
  components: {
    AddressChoice,
    AddressTypeChoice,
    FiasLevelChoice,
    FiasTypeChoice,
  }
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: 'Название надо указать', trigger: 'blur' }
    ],
    address_type: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: 'Нужно выбрать тип' }
    ],
    fias_address_level: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: 'Нужно выбрать уровень' }
    ],
    fias_address_type: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: 'Нужно выбрать тип ФИАС' }
    ]
  }

  @Watch('$store.state.address', { deep: true })
  private onChangeLoc(addr: IAddressModel) {
    this.frmMod.title = addr.title
    this.frmMod.parent_addr = addr.parent_addr || null
    this.frmMod.address_type = addr.address_type
  }

  private frmMod: {
    title: string,
    parent_addr: number | null,
    address_type: number,
    fias_address_level: number | null,
    fias_address_type: number | null
  } = {
    title: '',
    parent_addr: null,
    address_type: 0,
    fias_address_level: null,
    fias_address_type: null
  }

  get isNew() {
    return this.$store.state.address.id === 0
  }

  created() {
    this.onChangeLoc(this.$store.state.address)
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        let newDat
        if (this.isNew) {
          newDat = await AddressModule.AddAddress(this.frmMod)
        } else {
          newDat = await AddressModule.PatchAddress(this.frmMod)
        }
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
