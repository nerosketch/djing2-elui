<template lang="pug">
  el-form(
    ref="form"
    label-width="110px"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(:label="$t('title')")
      el-input(v-model="frmMod.title")
  
    el-form-item(:label="$t('tip-polya')")
      el-select(v-model="frmMod.field_type")
        el-option(
          v-for="(t, i) in fieldTypeChoices"
          :key="i"
          :label="t.label"
          :value="t.value")
  
    el-form-item(:label="$t('gruppy')")
      groups-choice(v-model="frmMod.groups" multiple)
  
    el-form-item(:label="$t('sistemnyi-teg')")
      system-tags-input(v-model="frmMod.system_tag")
  
    el-form-item(:label="$t('polzov-teg')" prop="user_tag")
      el-input(v-model="frmMod.user_tag")
  
    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="isLoading")
        | {{ $t('save') }}
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
        message: this.$t('tegi-dolzhny-soderzhat-tolko-bukvy-cifry-i-znak-podchyorkivaniya')
      }
    ]
  }

  created() {
    this.loadFieldTypeChoices()
    this.onChangedField(this.$store.state.dynamicfield)
  }
}
</script>
