<template lang="pug">
  el-card(shadow='never')
    template(#header)
      .clearfix TaskAct
    act-frm
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ActFrm from './act_frm.vue'

@Component({
  name: 'FinishDocIndex',
  components: {
    ActFrm
  }
})
export default class extends Vue {}
</script>
