<template lang="pug">
  .app-container
    el-card(shadow="never" :loading='loading')
      template(v-slot:header)
        .clearfix
          | {{ $t('poisk-po-searchtextgetter', [searchTextGetter]) }}
    
      el-row(:gutter="5")
        el-col(:sm="24", :md="12")
          template(v-if="customers.length > 0")
            el-card(
              shadow="hover"
              :body-style="defCardStyle"
              v-for="(c, i) in customers"
              :key="i"
            )
              div
                i.el-icon-s-custom
                router-link(:to="{ name: 'customerDetails', params: {uid: c.id } }")
                  el-link(type="primary") {{ c.username }}
              span {{ c.fio }}, {{ c.group_title }}.
              br
              i {{ c.telephone }}
              br
              small {{ c.ips }}

          el-card(
            v-else
            shadow="hover"
            :body-style="defCardStyle"
          )
            h3 {{ $t('abonenty-ne-naideny') }}


        el-col(:sm='24' :md='12')
          template(v-if="devices.length > 0")
            el-card(
              shadow="hover"
              :body-style="defCardStyle"
              v-for="(d, i) in devices"
              :key="i"
            )
              div
                i.el-icon-cpu
                router-link(:to="{name: 'device-view', params: { devId: d.id.toString()}}")
                  el-link(type="primary") {{ d.ip_address }} {{ d.mac_addr}} {{ d.dev_type_str }}
              p {{ d.comment }}
          el-card(
            v-else
            shadow="hover"
            :body-style="defCardStyle"
          )
            h3 {{ $t('oborudovanie-ne-naideno') }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SearchModule } from '@/store/modules/search'

@Component({
  name: 'SearchPlace'
})
export default class extends Vue {
  private loading = false

  private defCardStyle = { padding: '10px 13px' }

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
