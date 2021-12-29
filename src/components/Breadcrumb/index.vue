<template lang="pug">
  el-breadcrumb.app-breadcrumb(separator="/")
    el-breadcrumb-item
      i.el-icon-s-home

    el-breadcrumb-item(v-for="(item, index) in breadcrumbs", :key="index")
      span.no-redirect(v-if="item.redirect === 'noredirect' || index === breadcrumbs.length-1")
        | {{ item.meta.title }}

      a(v-else, @click.prevent="handleLink(item)")
        | {{ item.meta.title }}
</template>

<script lang="ts">
import { compile } from 'path-to-regexp'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteRecord } from 'vue-router'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

@Component({
  name: 'Breadcrumb'
})
export default class extends Vue {
  private breadcrumbs: RouteRecord[] = this.crumbsGetter

  get crumbsGetter(): RouteRecord[] {
    return BreadcrumbsModule.breadcrumbs || [
      {
        path: '/',
        meta: {
          hidden: true,
          title: '/'
        }
      }
    ] as any
  }

  @Watch('crumbsGetter')
  private onChangeCrumbs(crumbs: RouteRecord[]) {
    this.breadcrumbs = crumbs
  }

  private pathCompile(path: string | object) {
    // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
    if (path instanceof Object) {
      return path
    }
    const { params } = this.$route
    const toPath = compile(path)
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
  margin-left: 12px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
