<template lang="pug">
tabs(:tabs="tabItems")
  profile-list

  template(v-if="$perms.is_superuser" #profilegroups)
    group-list

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ProfileList from './profile-list.vue'
import GroupList from './group-list.vue'
import Tabs, { ICustomTabItem } from '@/components/tabs/tabs.vue'

@Component({
  name: 'ProfilesIndex',
  components: {
    ProfileList,
    Tabs,
    GroupList
  }
})
export default class extends Vue {
  private tabItems: ICustomTabItem[] = [
    { title: this.$t('route.staff') },
    { title: this.$t('profiles.profileGroups'), name: 'profilegroups' }
  ]
}
</script>
