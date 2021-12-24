<template>  
  <el-form ref="form" label-width="110px" status-icon :rules="frmRules" :model="frmMod" v-loading="isLoading">
    <el-form-item :label="$t('title')">
      <el-input v-model="frmMod.title"></el-input>
    </el-form-item>
    <el-form-item label="Тип поля">
      <el-select v-model="frmMod.field_type">
        <el-option v-for="(t, i) in fieldTypeChoices" :key="i" :label="t.label" :value="t.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Группы">
      <groups-choice v-model="frmMod.groups" multiple></groups-choice>
    </el-form-item>
    <el-form-item label="Системный тэг">
      <system-tags-input v-model="frmMod.system_tag"></system-tags-input>
    </el-form-item>
    <el-form-item label="Пользов. тэг" prop="user_tag">
      <el-input v-model="frmMod.user_tag"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-upload" type="primary" @click="onSubmit" :loading="isLoading">{{ $t('save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { DynamicFieldModule } from '@/store/modules/dynamicfields/dynamic-field'
import { IDynamicField } from '@/api/dynamic-fields/types'
import { getFieldTypeChoices } from '@/api/dynamic-fields/req'
import SystemTagsInput from './system-tags-input.vue'
import { regexpVal } from '@/utils/validate'
import { IChoiceItemType } from '@/api/types'
import GroupsChoice from '@/components/Groups/groups-choice.vue'

export const _userTagsValidator = regexpVal(/^(\w+,?)+$/s)

@Component({
  name: 'FieldForm',
  components: {
    SystemTagsInput,
    GroupsChoice
  }
})
export default class extends Vue {
  private isLoading = false

  private frmMod = {
    id: 0,
    title: '',
    field_type: 0,
    system_tag: 0,
    user_tag: '',
    groups: [] as number[]
  }

  @Watch('$store.state.dynamicfield', { deep: true })
  private onChangedField(field: IDynamicField) {
    this.frmMod.id = field.id
    this.frmMod.title = field.title
    this.frmMod.field_type = field.field_type
    this.frmMod.system_tag = field.system_tag
    this.frmMod.user_tag = field.user_tag
    this.frmMod.groups = field.groups
  }

  private fieldTypeChoices: IChoiceItemType[] = []

  private async loadFieldTypeChoices() {
    const { data } = await getFieldTypeChoices()
    this.fieldTypeChoices = data
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

  private frmRules = {
    user_tag: [
      {
        validator: _userTagsValidator,
        trigger: 'change',
        message: 'Тэги должны содержать только буквы, цифры и знак подчёркивания (как [a-zA-Z0-9_]). И могут быть разделены запятой.'
      }
    ]
  }

  created() {
    this.loadFieldTypeChoices()
    this.onChangedField(this.$store.state.dynamicfield)
  }
}
</script>
