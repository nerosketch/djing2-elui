<template>  
  <div class="tab-container">
    <el-tabs v-model="activeTabName" type="border-card">
      <el-tab-pane label="Новые задачи" name="tnew" lazy>
        <keep-alive>
          <task-list tabUrl="get_new"></task-list>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="Выполненные задачи" name="tfin" lazy>
        <keep-alive>
          <task-list tabUrl="get_finished"></task-list>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="Проваленные задачи" name="tf" lazy>
        <keep-alive>
          <task-list tabUrl="get_failed"></task-list>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="Все задачи" name="tall" lazy>
        <keep-alive>
          <task-list tabUrl="get_all"></task-list>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="Все незавершённые" name="tallnew" lazy>
        <keep-alive>
          <task-list tabUrl="get_all_new"></task-list>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
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
