<template lang="pug">
  el-form(
    v-loading='loading'
    label-width="0"
  )
    el-form-item(
      v-for="(str, i) in streets"
      :key="i"
    )
      el-input(v-model="str.name" maxlength='64')
        template(v-slot:append)
          el-button(
            type='danger' icon='el-icon-close'
            @click="delStreet(str)"
            :disabled="!$perms.customers.delete_customerstreet"
          )
    el-form-item
      el-button(
        icon='el-icon-upload'
        type="primary" @click="onSubmit"
        :disabled="!$perms.customers.change_customerstreet"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { StreetModule } from '@/store/modules/addresses/street'
import { IStreetModel } from '@/api/addresses/types'


@Component({
  name: 'EditStreets'
})
export default class extends Vue {
  @Prop({ default: () => ([]) }) private extStreets!: []
  @Prop({ default: 0 }) private localityId!: number

  private loading = false
  private streets: IStreetModel[] = []

  @Watch('extStreets')
  private extStrChan(strs: IStreetModel[]) {
    this.streets = strs.map(x => Object.assign({}, x))
  }

  created() {
    this.extStrChan(this.extStreets)
  }

  private async onSubmit() {
    this.loading = true
    for (const st of this.streets) {
      StreetModule.SET_PK(st.id)
      await StreetModule.PatchStreet(st)
    }
    this.loading = false
    this.$message.success('Улицы изменены')
    this.$emit('done')
  }

  private delStreet(street: IStreetModel) {
    this.$confirm(`Удалить улицу "${street.name}?"`).then(async() => {
      this.loading = true
      await StreetModule.DelStreet(street.id)
      this.loading = false
      this.$message.success(`Улица "${street.name} удалена`)
      this.$emit('done')
    })
  }
}
</script>
