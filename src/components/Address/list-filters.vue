<template lang="pug">
el-collapse
  el-collapse-item
    template(slot="title") {{ $t('customers.addressFitlers') }}

    el-form(inline)
      el-form-item(:label="$t('customers.streets')")
        addr-children-choice(
          :parentAddrId="addrId"
          :addrType="streetAddrType"
          :parentAddrType="streetParentAddrType"
          v-model="streetVal"
          :disabled="!addrId"
        )

      el-form-item(:label="$t('customers.houses')")
        addr-children-choice(
          :parentAddrId="streetVal"
          :addrType="houseAddrType"
          :parentAddrType="streetAddrType"
          :disabled="!streetVal"
          v-model="houseVal"
        )

      el-form-item(:label="$t('route.groups')")
        groups-choice(
          v-model="groupVal"
          :fetchFunction="fetchGroups"
        )

      el-form-item(
        :label="$t('customers.showIsActive')"
      )
        el-select(
          v-model="localDisplayActive"
        )
          el-option(
            v-for="(v, i) in localDisplayVals"
            :key="i"
            :value="v.value"
            :label="v.title"
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
  @Prop({ default: null }) private displayActive!: boolean | null

  private streetVal = this.street
  // private streetLabelVal = ''
  private groupVal = this.group
  // private groupLabelVal = ''
  private houseVal = this.house
  // private houseLabelVal = ''

  private localDisplayActive = this.displayActive

  private streetAddrType = IAddressEnumTypes.STREET
  private streetParentAddrType = IAddressEnumTypes.LOCALITY
  private houseAddrType = IAddressEnumTypes.HOUSE

  private localDisplayVals = [
    {value: false, title: 'Отображать не активных'},
    {value: true, title: 'Отображать активных'},
    {value: null, title: 'Отображать всех'}
  ]

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

  @Watch('localDisplayActive')
  private onChangeDisplayActive(v: boolean | null) {
    this.$emit('update:displayActive', v)
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
