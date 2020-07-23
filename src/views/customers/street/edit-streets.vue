<template lang="pug">
  el-form(
    v-loading='loading'
    label-width="0"
    size="mini"
  )
    el-form-item(
      v-for="(str, i) in streets"
      :key="i"
    )
      el-input(v-model="str.name" maxlength='64')
        template(v-slot:append)
          el-button(type='danger' icon='el-icon-close' @click="delStreet(str)")
    el-form-item
      el-button(type="primary" @click="onSubmit") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ICustomerStreet } from '@/api/customers/types'
import { CustomerStreetModule } from '@/store/modules/customers/street'

@Component({
  name: 'EditStreets'
})
export default class extends Vue {
  private loading = false
  private streets: ICustomerStreet[] = []
  @Prop({ default: () => ([]) }) private extStreets!: []
  @Prop({ default: 0 }) private groupId!: number

  @Watch('extStreets')
  private extStrChan(strs: ICustomerStreet[]) {
    this.streets = strs.map(x => Object.assign({}, x))
  }

  created() {
    this.extStrChan(this.extStreets)
  }

  private async onSubmit() {
    this.loading = true
    for (const st of this.streets) {
      await CustomerStreetModule.SET_PK(st.pk)
      await CustomerStreetModule.PatchStreet(st)
    }
    this.loading = false
    this.$message.success('Улицы изменены')
    this.$emit('done')
  }

  private delStreet(street: ICustomerStreet) {
    this.$confirm(`Удалить улицу "${street.name}?"`).then(async() => {
      this.loading = true
      await CustomerStreetModule.DelStreet(street.pk)
      this.loading = false
      this.$message.success(`Улица "${street.name} удалена`)
      this.$emit('done')
    })
  }
}
</script>
