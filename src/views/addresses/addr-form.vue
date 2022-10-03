<template lang="pug">
  el-form(
    ref="form"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(:label="$t('title')" prop="title")
      el-input(v-model="frmMod.title")

    el-form-item(
      :label="$t('fiasLevel')"
      prop="fias_address_level"
    )
      fias-level-choice(v-model="frmMod.fias_address_level")

    el-form-item(:label="$t('typeOfFiasAddress')" prop="fias_address_type")
      fias-type-choice(
        v-model="frmMod.fias_address_type"
        :level="frmMod.fias_address_level"
      )

    el-form-item(:label="$t('typeOfAddressObject')" prop="address_type")
      address-type-choice(v-model="frmMod.address_type")

    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="isLoading")
        | {{ $t('save') }}

      el-divider(direction="vertical")
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { AddressModule } from '@/store/modules/addresses/address'
import AddressTypeChoice from '@/components/Address/type-choice.vue'
import { IAddressEnumTypes, IAddressModel } from '@/api/addresses/types'
import { positiveNumberValueAvailable } from '@/utils/validate'
import FiasLevelChoice from '@/components/Address/fias-level-choice.vue'
import FiasTypeChoice from '@/components/Address/fias-type-choice.vue'

@Component({
  name: 'AddressForm',
  components: {
    AddressTypeChoice,
    FiasLevelChoice,
    FiasTypeChoice
  }
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: this.$tc('nameShouldBeIndicated'), trigger: 'blur' },
      { validator: this.titleDynamicValidator, trigger: 'change' }
    ],
    address_type: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: this.$tc('weNeedToPickAType') }
    ],
    fias_address_level: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: this.$tc('weNeedToPickALevel') }
    ],
    fias_address_type: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: this.$tc('weNeedToPickAFiasType') }
    ]
  }

  private titleDynamicValidator(rule: any, value: number, callback: Function) {
    // Если должно быть только число, то валидируем как число
    if (this.isTitleMustBeNumeric) {
      if (!isNaN(value) && Number(value) > 0) {
        callback()
      } else {
        callback(new Error(this.$tc('onlyNumber')))
      }
    } else {
      callback()
    }
  }

  private get isTitleMustBeNumeric() {
    // Должен ли title принимать только числа
    return [IAddressEnumTypes.HOUSE, IAddressEnumTypes.OFFICE_NUM].includes(
      this.frmMod.address_type
    )
  }

  @Watch('frmMod.fias_address_type')
  private onChangeFiasAddrType(fiasAddressType: number) {
    // Пробуем автоматически подставлять типы адреса по типу из фиаса
    if ([601, 809, 902, 905, 906, 907, 909].includes(fiasAddressType)) {
      this.frmMod.address_type = IAddressEnumTypes.HOUSE
    } else if (fiasAddressType === 904) {
      this.frmMod.address_type = IAddressEnumTypes.OFFICE_NUM
    } else if (fiasAddressType === 529) {
      this.frmMod.address_type = IAddressEnumTypes.STREET
    } else if (fiasAddressType === 525) {
      this.frmMod.address_type = IAddressEnumTypes.BUILDING
    } else if (fiasAddressType === 806) {
      this.frmMod.address_type = IAddressEnumTypes.CORPUS
    } else {
      this.frmMod.address_type = IAddressEnumTypes.OTHER
    }
  }

  @Watch('$store.state.address', { deep: true })
  private onChangeLoc(addr: IAddressModel) {
    this.frmMod.title = addr.title
    this.frmMod.address_type = addr.address_type
    this.frmMod.parent_addr_id = addr.parent_addr_id!
    this.frmMod.fias_address_level = addr.fias_address_level
    this.frmMod.fias_address_type = addr.fias_address_type
  }

  private frmMod: {
    title: string,
    address_type: number,
    parent_addr_id: number | null,
    fias_address_level: number | null,
    fias_address_type: number | null
  } = {
    title: '',
    address_type: 0,
    parent_addr_id: null,
    fias_address_level: null,
    fias_address_type: null
  }

  created() {
    this.onChangeLoc(this.$store.state.address)
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          if (this.$store.state.address.id === 0) {
            const addr = await AddressModule.AddAddress(this.frmMod)
            this.$emit('added', addr)
          } else {
            const addr = await AddressModule.PatchAddress(this.frmMod)
            this.$emit('changed', addr)
          }
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error(this.$tc('fixFormErrs'))
      }
    })
  }
}
</script>
