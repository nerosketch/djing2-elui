<template>
  <div>
    <el-checkbox v-for="grp in groups" :key="grp.id" :label="grp.title" v-model="grp.state"></el-checkbox><br>
    <el-button icon="el-icon-upload" type="primary" @click="saveResp" :loading="loading" :disabled="!$perms.is_superuser">{{ $t('save') }}</el-button>
  </div>
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

  async loadGroups() {
    this.loading = true
    const { data } = await getGroups({
      page: 1,
      page_size: 0,
      fields: 'id,title'
    }) as any
    if (data.length < 1) {
      this.loading = false
      this.$message.error(this.$t('ne-udalos-poluchit-gruppy'))
      return
    }
    try {
      const checkedGroups = await getResponsibilityGroups(this.profileUname)
      this.groups = data.map((grp: IGroup) => Object.assign({
        state: checkedGroups.data.includes(grp.id)
      }, grp))
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadGroups()
  }

  async saveResp() {
    this.loading = true
    const filtered = this.groups.filter(v => v.state)
    const res = filtered.map(v => v.id)
    await setResponsibilityGroups(this.profileUname, res)
    this.$message.success(this.$t('otvetstvennost-za-gruppy-sokhranena'))
    this.loading = false
    this.$emit('done')
  }
}
</script>
