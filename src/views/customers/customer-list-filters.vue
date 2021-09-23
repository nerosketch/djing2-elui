<template lang="pug">
  el-form(inline)
    el-form-item(
      label="Группы"
    )
      groups-choice(v-model="groupVal")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import GroupsChoice from '@/views/groups/groups-choice.vue'

@Component({
  name: 'CustomerListFilters',
  components: {
    GroupsChoice
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private localityId!: number
  @Prop({ required: true }) private group!: number

  private groupVal = this.group

  @Watch('groupVal')
  private onChGroupVal(v: number) {
    this.$emit('update:group', v)
  }
}
</script>
