<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      :unique-opened="false"
      :collapse-transition="false"
      mode="vertical"
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
        :is-collapse="isCollapse"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/_variables.scss'
import { IWsMessage, IWsMessageEventTypeEnum } from '@/layout/mixin/ws'
import { TaskModule } from '@/store/modules/tasks/tasks'

interface IHightPriorityTaskEventData {
  recipients: number[]
  author?: number
}

@Component({
  name: 'SideBar',
  components: {
    SidebarItem
  }
})
export default class extends Vue {
  get routes() {
    return (this.$router as any).options.routes
  }

  get variables() {
    return variables
  }

  get isCollapse() {
    return !this.$store.state.app.sidebar.opened
  }

  created() {
    this.$eventHub.$on(IWsMessageEventTypeEnum.UPDATETASK, this.onUpdateTask)
    TaskModule.FetchTaskCount()
  }

  beforeDestroy() {
    this.$eventHub.$off(IWsMessageEventTypeEnum.UPDATETASK, this.onUpdateTask)
  }

  private onUpdateTask(msg: IWsMessage) {
    if (msg.data) {
      let hightPriorityTaskEventData = msg.data as IHightPriorityTaskEventData
      let profiles = hightPriorityTaskEventData.recipients
      if (hightPriorityTaskEventData.author) {
        profiles.push(hightPriorityTaskEventData.author)
      }
      if (profiles.includes(this.$store.state.currentuserprofile.id)) {
        this.$eventHub.$emit('dilim')
        this.$message.info({
          message: msg.text || 'Изменения в высокоприоритетной задаче, в которой вы учавствуете',
          duration: 300000,
          showClose: true
        })
      }
    }
    TaskModule.FetchTaskCount()
  }
}
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
