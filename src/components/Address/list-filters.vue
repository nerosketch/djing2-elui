<template lang="pug">
  el-form(inline)
    el-form-item(:label="$t('customers.streets')")
      address-street-choice(:addrId="addrId" v-model="streetVal")

    el-form-item(:label="$t('route.groups')")
      groups-choice(v-model="groupVal" :fetchFunction="fetchGroups")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import AddressStreetChoice from '@/components/Address/street-choice.vue'
import GroupsChoice from '@/components/Groups/groups-choice.vue'
import { IDRFRequestListParameters } from '@/api/types'

@Component({
  name: 'ListFilters',
  components: {
    AddressStreetChoice,
    GroupsChoice
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private addrId!: number
  @Prop({ required: true }) private street!: number
  @Prop({ required: true }) private group!: number
  @Prop({ required: true })
  private fetchGroups!: (params: IDRFRequestListParameters) => void

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
