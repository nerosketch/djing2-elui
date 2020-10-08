<template lang="pug">
  el-form(
    ref='form'
    label-width="115px"
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
      label="название в url"
      prop='slug'
    )
      el-input(v-model="frmMod.slug")
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading" :disabled="frmMod.bot_type===0") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'ViberMessengerDetails'
})
export default class extends Vue {
  @Prop({ required: true }) private mId!: number
}
</script>
