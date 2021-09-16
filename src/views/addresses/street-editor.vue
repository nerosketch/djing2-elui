<template lang="pug">
  el-form(
    v-loading='streetsLoading'
    label-width="0"
  )
    el-form-item(
      v-for="(str, i) in streets"
      :key="i"
    )
      el-input(v-model="str.name" maxlength='64')
        template(v-slot:append)
          el-button(
            v-if="str.id > 0"
            type='danger' icon='el-icon-close'
            @click="delStreet(str)"
            :disabled="!$perms.addresses.delete_streetmodel"
          )
    el-form-item
      el-button-group
        el-button(
          icon='el-icon-upload'
          type="primary" @click="onSubmit"
          :disabled="!$perms.addresses.change_streetmodel"
        ) Сохранить
        el-button(
          icon='el-icon-plus'
          type='success'
          @click='addStreet'
          :disabled="!$perms.addresses.add_streetmodel"
        ) Добавить

</template>

<script lang="ts">
import { changeStreet, getStreets, addStreet } from '@/api/addresses/req'
import { IStreetModel } from '@/api/addresses/types'
import { StreetModule } from '@/store/modules/addresses/street'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'StreetEditor'
})
export default class extends Vue {
  @Prop({ required: true }) private localityId!: number

  private streetsLoading = false

  private streets: IStreetModel[] = []

  private async loadStreets() {
    this.streetsLoading = true
    try {
      const { data } = await getStreets({
        page: 1,
        page_size: 0,
        locality: this.localityId,
        fields: 'id,name'
      } as any) as any
      this.streets = data
    } finally {
      this.streetsLoading = false
    }
  }

  created() {
    this.loadStreets()
  }

  @Watch('localityId')
  private onChLocId() {
    this.loadStreets()
  }

  private delStreet(street: IStreetModel) {
    this.$confirm(`Удалить улицу "${street.name}?"`).then(async() => {
      this.streetsLoading = true
      await StreetModule.DelStreet(street.id)
      this.streetsLoading = false
      this.$message.success(`Улица "${street.name} удалена`)
      this.streets = this.streets.filter(s => s.id !== street.id)
    })
  }

  private async onSubmit() {
    this.streetsLoading = true
    for (const st of this.streets) {
      if (st.id > 0) {
        changeStreet(st.id, st)
      } else {
        addStreet(st)
      }
    }
    this.streetsLoading = false
    this.$message.success('Улицы изменены')
    this.$emit('done')
  }

  private addStreet() {
    this.streets.push({
      id: 0,
      name: '',
      locality: this.localityId
    })
  }
}
</script>
