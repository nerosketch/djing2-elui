<template>
  <div>
    <el-table
      v-loading="intLoading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      v-bind="$attrs"
      :height="tblHeight"
      border fit
      v-on="listeners"
    >
      <slot name="columns">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :sortable="column.sortable ? 'custom' : false"
          :align="column.align"
          :width="column.width"
          v-bind="column"
        >
          <template v-slot:default="{row}">
            <slot
              :name="column.prop"
              :row="row"
            >
              {{ row[column.prop] }}
            </slot>
          </template>
        </el-table-column>
      </slot>
    </el-table>
    <slot
      name="pagination"
      :page="page"
      :total="total"
    >
      <pagination
        :total="total"
        :page.sync="page"
        :limit.sync="pageSize"
        @pagination="GetTableData"
      />
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { IDRFAxiosResponsePromise, IDRFListResponse, IDRFRequestListParameters, IDRFAxiosResponseListPromise } from '@/api/types'
import { getDefaultPageSize } from '@/utils/cookies'

export enum DataTableColumnAlign {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right'
}

export interface IDataTableColumn {
  sortable?: boolean
  prop: string
  label: string
  align?: DataTableColumnAlign
  width?: number
}

export class DataTableColumn implements IDataTableColumn {
  sortable = false
  prop = 'Prop'
  label = 'Label'
  align = DataTableColumnAlign.LEFT
}

interface getTableDataParam {
  page: number
  limit: number
}

@Component({
  components: { Pagination }
})
export default class <T> extends Vue {
  @Prop({ default: () => [] }) private columns!: IDataTableColumn[]
  @Prop({ default: () => Promise.resolve([]) }) private getData!: (params: IDRFRequestListParameters) => IDRFAxiosResponseListPromise<T>
  @Prop({ default: null }) private fields!: string | null
  @Prop({ default: false }) private loading!: boolean
  @Prop({ default: (r: object) => ('') }) private tableRowClassName!: (r: object) => string
  @Prop({ default: 218 }) private heightDiff!: number

  @Watch('loading')
  private onChangeLoading(l: boolean) {
    this.intLoading = l
  }

  private responseData: IDRFListResponse<T> = {
    count: getDefaultPageSize(),
    next: null,
    previous: null,
    results: []
  }
  private tableData: T[] = []
  private page = 1
  private pageSize = getDefaultPageSize()
  private orderField: string | null = null
  private intLoading = true
  private tblHeight = 0

  get listeners() {
    return {
      ...this.$listeners,
      'sort-change': this.onSortChange
    }
  }

  get total() {
    return this.responseData.count
  }

  public async GetTableData(params: getTableDataParam = { page: 1, limit: 20 }, otherParams: object = {}) {
    this.intLoading = true
    const { page, limit } = params
    const reqPage = page || this.page
    const allParams = Object.assign(otherParams, {
      page: reqPage,
      page_size: this.pageSize,
      ordering: this.orderField,
      fields: this.fields
    })
    try {
      let response = await this.getData(allParams)
      this.responseData = response.data
      this.tableData = this.responseData.results
    } finally {
      this.intLoading = false
    }
  }

  private onSortChange(data: any) {
    const { prop, order } = data
    if (prop !== null) {
      const dir = order === 'ascending' ? '' : '-'
      this.orderField = `${dir}${prop}`
    } else {
      this.orderField = null
    }
    this.GetTableData()
  }

  created() {
    this.GetTableData()
    window.addEventListener('resize', this.onWinResize)
    this.onWinResize()
  }
  beforeDestroy() {
    window.removeEventListener('resize', this.onWinResize)
  }

  private onWinResize() {
    this.tblHeight = window.innerHeight - this.heightDiff
  }
}
</script>
