<template lang="pug">
el-collapse
  el-collapse-item
    template(slot="title") {{ $t('customers.addressFitlers') }}
      //- span(v-if="streetLabelVal") {{ $t('customers.street') }}: {{ streetLabelVal }}.&nbsp;
      //- span(v-if="houseLabelVal") {{ $t('customers.house') }}: {{ houseLabelVal }}.&nbsp;
      //- span(v-if="groupLabelVal") {{ $t('groups.group') }}: {{ groupLabelVal }}.

    el-form(inline)
      el-form-item(:label="$t('customers.streets')")
        addr-children-choice(
          :parentAddrId="addrId"
          :addrType="streetAddrType"
          :parentAddrType="streetParentAddrType"
          v-model="streetVal"
        )

      el-form-item(:label="$t('customers.houses')")
        addr-children-choice(
          :parentAddrId="streetVal"
          :addrType="houseAddrType"
          :parentAddrType="streetAddrType"
          v-model="houseVal"
        )

      el-form-item(:label="$t('route.groups')")
        groups-choice(
          v-model="groupVal"
          :fetchFunction="fetchGroups"
        )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import AddrChildrenChoice from '@/components/Address/addr-children-choice.vue'
import GroupsChoice from '@/components/Groups/groups-choice.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { IAddressEnumTypes } from '@/api/addresses/types'

@Component({
  name: 'ListFilters',
  components: {
    AddrChildrenChoice,
    GroupsChoice
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private addrId!: number
  @Prop({ required: true }) private street!: number
  @Prop({ required: true }) private group!: number
  @Prop({ default: 0 }) private house!: number
  @Prop({ required: true })
  private fetchGroups!: (params: IDRFRequestListParameters) => void

  private streetVal = this.street
  // private streetLabelVal = ''
  private groupVal = this.group
  // private groupLabelVal = ''
  private houseVal = this.house
  // private houseLabelVal = ''

  private streetAddrType = IAddressEnumTypes.STREET
  private streetParentAddrType = IAddressEnumTypes.LOCALITY
  private houseAddrType = IAddressEnumTypes.HOUSE

  @Watch('streetVal')
  private onChStreetVal(v: number) {
    this.$emit('update:street', v)
  }

  @Watch('groupVal')
  private onChGroupVal(v: number) {
    this.$emit('update:group', v)
  }

  @Watch('houseVal')
  private onChHouse(v: number) {
    this.$emit('update:house', v)
  }

  // private onStreetSelect(addr: IAddressModel) {
  //   this.streetLabelVal = addr.title
  // }
  // private onHouseSelect(addr: IAddressModel) {
  //   this.houseLabelVal = addr.title
  // }
  // private onGroupSelect(grp: IGroup) {
  //   this.groupLabelVal = grp.title
  // }
}
</script>
