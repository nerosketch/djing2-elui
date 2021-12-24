<template>
  <el-form ref="form" status-icon :rules="frmRules" :model="frmMod" v-loading="isLoading">
    <el-form-item :label="$t('title')" prop="title">
      <el-input v-model="frmMod.title"></el-input>
    </el-form-item>
    <el-form-item label="$t('uroven-fias')" prop="fias_address_level">
      <fias-level-choice v-model="frmMod.fias_address_level"></fias-level-choice>
    </el-form-item>
    <el-form-item label="$t('tip-adresa-fias')" prop="fias_address_type">
      <fias-type-choice v-model="frmMod.fias_address_type" :level="frmMod.fias_address_level"></fias-type-choice>
    </el-form-item>
    <el-form-item label="$t('tip-adresnogo-obekta')" prop="address_type">
      <address-type-choice v-model="frmMod.address_type"></address-type-choice>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-upload" type="primary" @click="onSubmit" :loading="isLoading">{{ $t('save') }}</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-link href="https://github.com/hflabs/socrbase/blob/master/socrbase.csv" target="_blank" type="info" icon="el-icon-thumb">{{ $t('spravochnik-adresnykh-obektov') }}</el-link>
    </el-form-item>
  </el-form>
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
      { required: true, message: this.$t('nazvanie-nado-ukazat'), trigger: 'blur' },
      { validator: this.titleDynamicValidator, trigger: 'change' }
    ],
    address_type: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: this.$t('nuzhno-vybrat-tip') }
    ],
    fias_address_level: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: this.$t('nuzhno-vybrat-uroven') }
    ],
    fias_address_type: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: this.$t('nuzhno-vybrat-tip-fias') }
    ]
  }

  private titleDynamicValidator(rule: any, value: number, callback: Function) {
    // Если должно быть только число, то валидируем как число
    if (this.isTitleMustBeNumeric) {
      if (!isNaN(value) && Number(value) > 0) {
        callback()
      } else {
        callback(new Error(this.$t('dolzhno-soderzhat-tolko-chislo')))
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
    if ([803, 902, 903, 907, 910, 911, 913 ].includes(fiasAddressType)) {
      this.frmMod.address_type = IAddressEnumTypes.HOUSE
    } else if (fiasAddressType === 904) {
      this.frmMod.address_type = IAddressEnumTypes.OFFICE_NUM
    } else if ([729, 714, 719, 722, 762, 798, 799].includes(fiasAddressType)) {
      this.frmMod.address_type = IAddressEnumTypes.STREET
    } else if ([811, 805, 810].includes(fiasAddressType)) {
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
    this.frmMod.parent_addr = addr.parent_addr!
    this.frmMod.fias_address_level = addr.fias_address_level
    this.frmMod.fias_address_type = addr.fias_address_type
  }

  private frmMod: {
    title: string,
    address_type: number,
    parent_addr: number | null,
    fias_address_level: number | null,
    fias_address_type: number | null
  } = {
    title: '',
    address_type: 0,
    parent_addr: null,
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
        try {
          if (this.isNew) {
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
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }
}
</script>
