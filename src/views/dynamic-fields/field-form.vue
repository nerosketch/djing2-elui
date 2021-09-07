<template lang="pug">
  el-form(
    label-width="100px"
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Название"
    )
      el-input(v-model="frmMod.title")
    el-form-item(
      label="Тип поля"
    )
      el-select(v-model="frmMod.field_type")
        el-option(
          v-for="(t, i) in fieldTypeChoices"
          :key="i"
          :label="t.label"
          :value="t.value"
        )
    el-form-item(
      label="Группы"
    )
      el-select(v-model="frmMod.groups" multiple)
        el-option(
          v-for="(grp, i) in groups"
          :key="i"
          :label="grp.title"
          :value="grp.pk"
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
import { Component, Vue, Watch } from 'vue-property-decorator'
import {DynamicFieldModule} from '@/store/modules/dynamicfields/dynamic-field'
import { getGroups } from '@/api/groups/req'
import { IGroup } from '@/api/groups/types'
import { IDynamicField, IFieldChoiceType } from '@/api/dynamic-fields/types'
import { getFieldTypeChoices } from '@/api/dynamic-fields/req'

@Component({
  name: 'FieldForm'
})
export default class extends Vue {
  private isLoading = false

  private frmMod = {
    id: 0,
    title: '',
    field_type: 0,
    groups: [] as number[]
  }

  @Watch('$store.state.dynamicfield', { deep: true })
  private onChangedField(field: IDynamicField) {
    this.frmMod.id = field.id
    this.frmMod.title = field.title
    this.frmMod.field_type = field.field_type
    this.frmMod.groups = field.groups
  }

  private groups: IGroup[] = []

  private fieldTypeChoices: IFieldChoiceType[] = []

  private async loadFieldTypeChoices() {
    const { data } = await getFieldTypeChoices()
    this.fieldTypeChoices = data
  }

  private async loadGroups() {
    this.isLoading = true
    try {
      const { data } = await getGroups()
      this.groups = data as IGroup[]
    } finally {
      this.isLoading = false
    }
  }

  private get isNew() {
    return DynamicFieldModule.id === 0
  }

  private async onSubmit() {
    this.isLoading = true
    try {
      let newDat
      if (this.isNew) {
        newDat = await DynamicFieldModule.AddField(this.frmMod)
      } else {
        newDat = await DynamicFieldModule.PatchField(this.frmMod)
      }
      this.$emit('done', newDat)
    } finally {
      this.isLoading = false
    }
  }

  created() {
    this.loadGroups()
    this.loadFieldTypeChoices()
    this.onChangedField(this.$store.state.dynamicfield)
  }
}
</script>
