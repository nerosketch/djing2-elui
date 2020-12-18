<template lang="pug">
div
  el-input(v-model="myTel")
    template(v-slot:append)
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
  el-dialog(
    title="Дополнительные телефоны"
    :visible.sync="openTelsDlg"
  )
    additional-tels
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import AdditionalTels from './customers-details/additional-tels.vue'

@Component({
  name: 'TelsInput',
  components: {
    AdditionalTels
  }
})
export default class extends Vue {
  @Prop({ default: '' }) private value!: string
  private myTel = ''
  private openTelsDlg = false

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
}
</script>
