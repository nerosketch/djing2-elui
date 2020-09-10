<template lang="pug">
  .tab-container
    el-tabs(
      v-model="activeName"
      type="border-card"
    )
      el-tab-pane(
        label='Сотрудники'
        name='profiles'
        lazy
      )
        keep-alive
          profile-list
      el-tab-pane(
        label='Группы сотрудников'
        name='profilegroups'
        lazy
      )
        keep-alive
          group-list
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import ProfileList from './profile-list.vue'
import GroupList from './group-list.vue'

@Component({
  name: 'ProfilesIndex',
  components: {
    ProfileList,
    GroupList
  }
})
export default class extends Vue {
  private activeName = 'profiles'

  @Watch('activeName')
  private onActiveNameChange(value: string) {
    const newPath = `${this.$route.path}?tab=${value}`
    if (newPath !== this.$route.fullPath) {
      this.$router.push(newPath)
    }
  }

  created() {
    // Init the default selected tab
    const tab = this.$route.query.tab as string
    if (tab) {
      this.activeName = tab
    }
  }
}
</script>
