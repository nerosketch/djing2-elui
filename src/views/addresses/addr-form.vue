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
      label="Родительский адресный оьъект"
    )
      address-choice(
        v-model="frmMod.parent_addr"
      )
    el-form-item(
      label="Тип адресного объекта"
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
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { AddressModule } from '@/store/modules/addresses/address'
import AddressChoice from '@/components/Address/address-choice.vue'
import AddressTypeChoice from '@/components/Address/type-choice.vue'

@Component({
  name: 'AddressForm',
  components: {
    AddressChoice,
    AddressTypeChoice,
  }
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: 'Название надо указать', trigger: 'blur' }
    ]
  }

  @Watch('$store.state.address.title')
  private onChangeLoc(title: string) {
    this.frmMod.title = title
  }

  private frmMod = {
    title: '',
    parent_addr: 0,
    address_type: 0
  }

  get isNew() {
    return this.$store.state.address.id === 0
  }

  created() {
    this.onChangeLoc(this.$store.state.address.title)
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
