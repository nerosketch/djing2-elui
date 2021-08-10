<template lang="pug">
el-card(shadow="hover" :body-style="{ padding: '10px 20px' }")
  template(v-slot:header) Панель инструментов
  el-button-group
    el-button(
      icon='el-icon-s-finance'
    ) Save
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'BotPanel'
})
export default class extends Vue {}
</script>
