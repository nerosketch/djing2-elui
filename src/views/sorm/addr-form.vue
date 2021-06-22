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
      label="Группы"
    )
      el-select(
        v-model="frmMod.groups"
        :diabled="!groupsListLoaded"
        multiple
      )
        template(v-if="groupsListLoaded")
          el-option(
            v-for="g in groupsList"
            :key="g.pk"
            :label="g.title"
            :value="g.pk"
          )

    el-button(
      :type="isNew ? 'success' : 'primary'"
      size='mini'
      @click="onSubmit"
      :loading="isLoading"
    ) {{ isNew ? 'Добавить' : 'Сохранить' }}
</template>

<script lang="ts">
import { getGroups } from '@/api/groups/req'
import { IGroup } from '@/api/groups/types'
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

  get groupsListLoaded() {
    return this.groupsList.length > 0
  }

  private frmMod: {
    title: string,
    ao_level?: number,
    ao_type?: number,
    parent_ao?: number,
    groups: number[]
  } = {
    title: '',
    ao_level: undefined,
    ao_type: undefined,
    parent_ao: undefined,
    groups: []
  }

  private addrLevels: IAddrLevelItem[] = []
  private addrTypes: IAddrTypeItem[] = []
  private groupsList: IGroup[] = []

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
    this.loadAllGroups()
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

  private async loadAllGroups() {
    const { data } = await getGroups()
    this.groupsList = data as IGroup[]
    return data
  }

  @Watch('$store.state.fiasaddrs.id')
  private onAddrChanged() {
    this.frmMod.title = FiasRecursiveAddressModule.title
    this.frmMod.ao_level = FiasRecursiveAddressModule.ao_level || undefined
    this.frmMod.ao_type = FiasRecursiveAddressModule.ao_type || undefined
    this.frmMod.parent_ao = FiasRecursiveAddressModule.parent_ao || undefined
    this.frmMod.groups = FiasRecursiveAddressModule.groups
  }
}
</script>
