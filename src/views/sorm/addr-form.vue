<template lang="pug">
  el-form(
    ref='form'
    label-width="205px"
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
      prop='fias_address_level'
    )
      el-select(v-model="frmMod.fias_address_level")
        el-option(
          v-for="al in addrLevels"
          :key="al[0]"
          :label="al[1]"
          :value="al[0]"
        )
    el-form-item(
      label="Тип адресного объекта"
      prop='fias_address_type'
    )
      el-select(
        v-model="frmMod.fias_address_type"
        :disabled="!addrTypesLoaded"
        :loading='typesLoading'
      )
        template(v-if="addrTypesLoaded")
          el-option(
            v-for="at in addrTypes"
            :key="at[0]"
            :label="at[1]"
            :value="at[0]"
          )

    el-form-item(
      label="Родительский объект"
    )
      el-select(
        v-model='frmMod.parent_ao'
        :disabled="!addrTypesLoaded || !frmMod.title"
      )
        template(v-if="addrTypesLoaded")
          el-option(
            v-for="a in addrsList"
            :key="a.id"
            :label="a.title"
            :value="a.id"
          )

    el-form-item(
      label="Адресный объект"
    )
      el-select(
        v-model="frmMod.address"
        :diabled="!locListLoaded"
      )
        template(v-if="locListLoaded")
          el-option(
            v-for="l in addrs"
            :key="l.id"
            :label="l.title"
            :value="l.id"
          )

    el-button(
      :type="isNew ? 'success' : 'primary'"
      @click="onSubmit"
      :loading="isLoading"
    ) {{ isNew ? 'Добавить' : 'Сохранить' }}

    el-divider(
      direction="vertical"
    )

    el-link(
      href="https://github.com/hflabs/socrbase/blob/master/socrbase.csv"
      target="_blank"
      type="info"
      icon="el-icon-view"
    ) Справочник адресных объектов
</template>

<script lang="ts">
import { getAddresses } from '@/api/addresses/req'
import { IAddressEnumTypes, IAddressModel } from '@/api/addresses/types'
import { getAddrLevels, getAddrTypes } from '@/api/sorm/req'
import { IAddrLevelItem, IAddrTypeItem, IFiasRecursiveAddress } from '@/api/sorm/types'
import { FiasRecursiveAddressModule } from '@/store/modules/sorm'
import { Form } from 'element-ui'
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
  name: 'AddrForm'
})
export default class extends Vue {
  @Prop({ default: () => ([]) })
  private addrsList!: IFiasRecursiveAddress[]

  private isLoading = false
  private typesLoading = false

  get addrTypesLoaded() {
    return this.addrTypes.length > 0
  }

  get locListLoaded() {
    return this.addrs.length > 0
  }

  private frmMod: {
    title: string,
    parent_addr: number | null,
    fias_address_level: number | null,
    fias_address_type: number | null,
    address_type: IAddressEnumTypes,
  } = {
    title: '',
    parent_addr: null,
    fias_address_level: null,
    fias_address_type: null,
    address_type: IAddressEnumTypes.UNKNOWN
  }

  private addrLevels: IAddrLevelItem[] = []
  private addrTypes: IAddrTypeItem[] = []
  private addrs: IAddressModel[] = []

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
    this.loadAllAddresses()
    this.getAddrTypes()
    if (!this.isNew) {
      this.onAddrChanged()
    }
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          let newDat
          if (this.isNew) {
            newDat = await FiasRecursiveAddressModule.AddAddr(this.frmMod)
            this.$message.success('Адресный объект создан')
          } else {
            newDat = await FiasRecursiveAddressModule.PatchAddr(this.frmMod)
            this.$message.success('Адресный объект изменён')
          }
          this.$emit('done', newDat)
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.isLoading = false
        }
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

  private async loadAllAddresses() {
    const { data } = await getAddresses()
    this.addrs = data as IAddressModel[]
    return data
  }

  @Watch('$store.state.fiasaddrs.id')
  private onAddrChanged() {
    const s = this.$store.state.fiasaddrs
    this.frmMod.title = s.title
    this.frmMod.parent_addr = s.parent_addr
    this.frmMod.fias_address_level = s.fias_address_level
    this.frmMod.fias_address_type = s.fias_address_type
    this.frmMod.address_type = s.address_type
  }
}
</script>
