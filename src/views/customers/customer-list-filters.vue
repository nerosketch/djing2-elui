<template lang="pug">
  el-form(inline)
    el-form-item(
      label="Улицы"
    )
      locality-street-choice(
        :localityId='localityId'
        v-model='streetVal'
      )
    el-form-item(
      label="Группы"
    )
      groups-choice(v-model="groupVal")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import LocalityStreetChoice from '@/components/Locality/street-choice.vue'
import GroupsChoice from '@/views/groups/groups-choice.vue'

@Component({
  name: 'CustomerListFilters',
  components: {
    LocalityStreetChoice,
    GroupsChoice
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private localityId!: number
  @Prop({ required: true }) private street!: number
  @Prop({ required: true }) private group!: number

  private streetVal = this.street
  private groupVal = this.group

  @Watch('streetVal')
  private onChStreetVal(v: number) {
    this.$emit('update:street', v)
  }

  @Watch('groupVal')
  private onChGroupVal(v: number) {
    this.$emit('update:group', v)
  }
}
</script>
