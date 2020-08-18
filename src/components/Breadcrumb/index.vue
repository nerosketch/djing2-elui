<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator="/"
  >
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbs"
      :key="index"
    >
      <span
        v-if="item.redirect === 'noredirect' || index === breadcrumbs.length-1"
        class="no-redirect"
      >{{ item.meta.title }}</span>
      <a
        v-else
        @click.prevent="handleLink(item)"
      >{{ item.meta.title }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import pathToRegexp from 'path-to-regexp'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteRecord, Route } from 'vue-router'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

@Component({
  name: 'Breadcrumb'
})
export default class extends Vue {
  private breadcrumbs: RouteRecord[] = [];

  @Watch('$route')
  private onRouteChange(route: Route) {
    // if you go to the redirect page, do not update the breadcrumbs
    if (route.path.startsWith('/redirect/')) {
      return
    }
    this.getBreadcrumb()
  }

  created() {
    this.getBreadcrumb()
  }

  private getBreadcrumb() {
    this.breadcrumbs = [
      {
        path: '/',
        meta: {
          hidden: true,
          title: '/'
        }
      }
    ] as RouteRecord[]
  }

  get onCumbsCh() {
    return BreadcrumbsModule.breadcrumbs
  }
  @Watch('onCumbsCh')
  private onChangeCrumbs(crumbs: RouteRecord[]) {
    this.breadcrumbs = crumbs
  }

  private pathCompile(path: string | object) {
    // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
    if (path instanceof Object) {
      return path
    }
    const { params } = this.$route
    const toPath = pathToRegexp.compile(path)
    return toPath(params)
  }

  private handleLink(item: any) {
    const { redirect, path } = item
    if (redirect) {
      this.$router.push(redirect)
      return
    }
    this.$router.push(this.pathCompile(path))
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
