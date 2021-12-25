<template lang="pug">
  .tab-container
    el-tabs(v-model="activeTabName", type="border-card")
      el-tab-pane(
        :label="$t('staff')"
        name="profiles"
        lazy)
        keep-alive
          profile-list
    
      el-tab-pane(
        :label="$t('staff')"
        name="profilegroups"
        lazy
        v-if="$perms.is_superuser")
        keep-alive
          group-list
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import TabMixin from '@/utils/tab-mixin'
import ProfileList from './profile-list.vue'
import GroupList from './group-list.vue'

@Component({
  name: 'ProfilesIndex',
  components: {
    ProfileList,
    GroupList
  }
})
export default class extends mixins(TabMixin) {
  protected activeTabName = 'profiles'
}
</script>
