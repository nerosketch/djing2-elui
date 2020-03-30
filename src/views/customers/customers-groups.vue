<template lang="pug">
  .app-container
    el-table(
      v-loading='groupsLoading'
      :data="groupList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    )
      el-table-column(
        align="center"
        label="ID"
        width="95"
      )
        template(slot-scope="scope") {{ scope.$index }}
      el-table-column(label="Title")
        el-link(slot-scope="scope" type="primary")
          router-link(:to="{name: 'customersList', params:{groupId: scope.row.pk}}") {{ scope.row.title }}
      el-table-column(
        label="Code"
        width="140"
        align="center"
      )
        template(slot-scope="scope") {{ scope.row.code }}

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getCustomerGroups } from '@/api/customers'
import { ICustomerGroup } from '@/store/modules/customers/customer-groups'

@Component({
  name: 'CustomerGroupList'
})
export default class extends Vue {
  private groupsLoading = true
  private groupList: ICustomerGroup[] = []
  private groupsQuery = {
    page: 1,
    page_size: 20
  }

  created() {
    this.getGroups()
  }

  private async getGroups() {
    this.groupsLoading = true
    const { data } = await getCustomerGroups(this.groupsQuery)
    this.groupList = data.results
    this.groupsLoading = false
  }
}
</script>
