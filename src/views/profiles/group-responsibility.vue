<template lang="pug">
  div
    el-checkbox(
      v-for="grp in groups"
      :key="grp.pk"
      :label="grp.title"
      v-model="grp.state"
    )
    br
    el-button(
      type='primary' size='mini'
      @click="saveResp"
      :loading="loading"
    ) Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IGroup } from '@/api/groups/types'
import { getResponsibilityGroups, setResponsibilityGroups } from '@/api/profiles/req'
import { getGroups } from '@/api/groups/req'

interface IGroupWState extends IGroup {
  state: boolean
}

@Component({
  name: 'GroupResponsibility'
})
export default class extends Vue {
  @Prop({ default: '' }) private profileUname!: string
  private groups: IGroupWState[] = []
  private loading = false

  async loadChackedRespGroups() {
    const { data } = await getResponsibilityGroups(this.profileUname)
    return data
  }

  async loadGroups() {
    this.loading = true
    const { data } = await getGroups({
      page: 1,
      page_size: 1000,
      fields: 'pk,title'
    })
    if (data.results.length < 1) {
      this.loading = false
      this.$message.error('Не удалось получить группы')
      return
    }
    const checkedGroups = await this.loadChackedRespGroups()
    for (const grp of data.results) {
      let state = checkedGroups.includes(grp.pk)
      this.groups.push(Object.assign({ state }, grp))
    }
    this.loading = false
  }

  created() {
    this.loadGroups()
  }

  async saveResp() {
    this.loading = true
    let res: number[] = []
    for (const v of this.groups) {
      if (v.state) {
        res.push(v.pk)
      }
    }
    await setResponsibilityGroups(this.profileUname, res)
    this.$message.success('Ответственность за группы сохранена')
    this.loading = false
    this.$emit('done')
  }
}
</script>