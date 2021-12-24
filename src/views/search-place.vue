<template>
  <div class="app-container">
    <el-card shadow="never" :loading="loading">
      <template v-slot:header>
        <div class="clearfix">{{ $t('poisk-po-searchtextgetter', [searchTextGetter]) }}</div>
      </template>
      <el-row :gutter="5">
        <el-col :sm="24" :md="12">
          <template v-if="customers.length > 0">
            <el-card shadow="hover" :body-style="defCardStyle" v-for="(c, i) in customers" :key="i">
              <div><i class="el-icon-s-custom"></i>
                <router-link class="el-link el-link--primary is-underline" :to="{ name: 'customerDetails', params: {uid: c.id } }">{{ c.username }}</router-link>
              </div><span>{{ $t('c-fio-c-group_title', [c.fio, c.group_title]) }}</span><br><i>{{ c.telephone }}</i><br><small>{{ c.ips }}</small>
            </el-card>
          </template>
          <el-card v-else shadow="hover" :body-style="defCardStyle">
            <h3>{{ $t('abonenty-ne-naideny') }}</h3>
          </el-card>
        </el-col>
        <el-col :sm="24" :md="12">
          <template v-if="devices.length > 0">
            <el-card shadow="hover" :body-style="defCardStyle" v-for="(d, i) in devices" :key="i">
              <div><i class="el-icon-cpu"></i>
                <router-link class="el-link el-link--primary is-underline" :to="{name: 'device-view', params: { devId: d.id.toString()}}">{{ d.ip_address }} {{ d.mac_addr}} {{ d.dev_type_str }}</router-link>
              </div>
              <p>{{ d.comment }}</p>
            </el-card>
          </template>
          <el-card v-else shadow="hover" :body-style="defCardStyle">
            <h3>{{ $t('oborudovanie-ne-naideno') }}</h3>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SearchModule } from '@/store/modules/search'

@Component({
  name: 'SearchPlace'
})
export default class extends Vue {
  private loading = false

  private defCardStyle = { padding: this.$t('10px-13px') }

  get searchTextGetter() {
    return SearchModule.searchStr
  }

  get customers() {
    return SearchModule.accounts
  }

  get devices() {
    return SearchModule.devices
  }

  @Watch('searchTextGetter')
  private async doSearch() {
    SearchModule.DoSearch()
  }
}
</script>
