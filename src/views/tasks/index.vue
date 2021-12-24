<template lang="pug">
  .tab-container
    el-tabs(v-model="activeTabName", type="border-card")
      el-tab-pane(
        :label="$t('novye-zadachi')"
        name="tnew"
        lazy)
        keep-alive
          task-list(tabUrl="get_new")
    
      el-tab-pane(
        :label="$t('vypolnennye-zadachi')"
        name="tfin"
        lazy)
        keep-alive
          task-list(tabUrl="get_finished")
    
      el-tab-pane(
        :label="$t('provalennye-zadachi')"
        name="tf"
        lazy)
        keep-alive
          task-list(tabUrl="get_failed")
    
      el-tab-pane(
        :label="$t('vse-zadachi')"
        name="tall"
        lazy)
        keep-alive
          task-list(tabUrl="get_all")
    
      el-tab-pane(
        :label="$t('vse-nezavershyonnye')"
        name="tallnew"
        lazy)
        keep-alive
          task-list(tabUrl="get_all_new")
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import TaskList from './task-list.vue'
import TabMixin from '@/utils/tab-mixin'

@Component({
  name: 'TasksIndex',
  components: { TaskList }
})
export default class extends mixins(TabMixin) {
  protected activeTabName = 'tnew'
}
</script>
