<template lang="pug">
  .app-container
    el-card(
      shadow="never"
    )
      template(v-slot:header)
        .clearfix {{ $t('searchBy', [$store.state.search.searchStr]) }}
      el-row(:gutter='5')
        el-col(:sm='24' :md='12')
          template(v-if="$store.state.search.accounts && $store.state.search.accounts.length > 0")
            el-card(
              shadow="hover"
              :body-style="defCardStyle"
              v-for="(c, i) in $store.state.search.accounts"
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
            h3 {{ $t('noSubscribersFound') }}

        el-col(:sm='24' :md='12')
          template(v-if="$store.state.search.devices && $store.state.search.devices.length > 0")
            el-card(
              shadow="hover"
              :body-style="defCardStyle"
              v-for="(d, i) in $store.state.search.devices"
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
            h3 {{ $t('equipmentNotFound') }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'SearchPlace'
})
export default class extends Vue {
  private defCardStyle = { padding: '10px 13px' }
}
</script>
