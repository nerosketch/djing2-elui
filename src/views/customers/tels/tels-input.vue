<template lang="pug">
div
  el-input(v-model="myTel")
    template(#append)
      el-button(
        icon='el-icon-phone'
        circle
        @click="doCall"
      )
      el-button(
        @click="openTelsDlg=true"
        :disabled="!$perms.customers.view_additionaltelephone"
        circle icon='el-icon-s-order'
      )
      el-button(
        @click="openAddTels"
        :disabled="!$perms.customers.add_additionaltelephone"
        circle icon='el-icon-plus'
      )
  el-dialog(
    title="Дополнительные телефоны"
    :visible.sync="openTelsDlg"
    :close-on-click-modal="false"
  )
    additional-tels(ref="additionaltels")
  el-dialog(
    title="Добавить телефон"
    :visible.sync="openAddTelsDlg"
    :close-on-click-modal="false"
  )
    tel-form(
      :customer="$store.state.customer.id"
      v-on:done="telsFormDone"
    )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import AdditionalTels from './additional-tels.vue'
import TelForm from './tel-form.vue'
import { AdditionalTelephoneModule } from '@/store/modules/customers/telephones'

@Component({
  name: 'TelsInput',
  components: {
    AdditionalTels,
    TelForm
  }
})
export default class extends Vue {
  @Prop({ default: '' }) private value!: string
  public readonly $refs!: {
    additionaltels: AdditionalTels
  }

  private myTel = ''
  private openTelsDlg = false
  private openAddTelsDlg = false

  @Watch('myTel')
  private onChMyTel(tel: string) {
    this.$emit('input', tel)
  }

  @Watch('value')
  protected onChOrigTel(tel: string) {
    this.myTel = tel
  }

  created() {
    this.myTel = this.value
  }

  private doCall() {
    window.location.href = `tel:${this.value}`
  }

  private openAddTels() {
    AdditionalTelephoneModule.RESET_ALL_TEL()
    this.openAddTelsDlg = true
  }

  private telsFormDone() {
    this.openAddTelsDlg = false
    this.$refs.additionaltels.loadTels()
  }
}
</script>
