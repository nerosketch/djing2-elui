<template>
  <div
    :class="{'hidden': hidden}"
    class="pagination-container"
  >
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <slot name="default"/>
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { scrollTo } from '@/utils/scroll-to'
import { setDefaultPageSize } from '@/utils/cookies'

@Component({
  name: 'Pagination'
})
export default class extends Vue {
  @Prop({ required: true }) private total!: number
  @Prop({ default: 1 }) private page!: number
  @Prop({ default: 20 }) private limit!: number
  @Prop({ default: () => [20, 40, 60, 80] }) private pageSizes!: number[]
  @Prop({ default: 'sizes, prev, pager, next, slot' }) private layout!: string
  @Prop({ default: true }) private background!: boolean
  @Prop({ default: false }) private autoScroll!: boolean
  @Prop({ default: false }) private hidden!: boolean

  get currentPage() {
    return this.page
  }

  set currentPage(value) {
    this.$emit('update:page', value)
  }

  get pageSize() {
    return this.limit
  }

  set pageSize(value) {
    this.$emit('update:limit', value)
  }

  handleSizeChange(value: number) {
    this.$emit('pagination', { page: this.currentPage, limit: value })
    if (this.autoScroll) {
      scrollTo(0, 800)
    }
    setDefaultPageSize(value)
  }

  handleCurrentChange(value: number) {
    this.$emit('pagination', { page: value, limit: this.pageSize })
    if (this.autoScroll) {
      scrollTo(0, 800)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  padding: 5px 0;
}

.pagination-container.hidden {
  display: none;
}
</style>
