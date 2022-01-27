<template lang="pug">
  el-select(
    v-model="localValue"
    :loading="loading"
    clearable)
    el-option(
      v-for="house in houses"
      :key="house.id"
      :label="house.fias_address_type_name ? `${house.fias_address_type_name} ${house.title}` : house.title"
      :value="house.id")
</template>

<script lang="ts">
import { getHouses } from '@/api/addresses/req'
import { IAddressModel } from '@/api/addresses/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'HouseChoice'
})
export default class extends Vue {
  @Prop({ required: true })
  private value!: number

  @Prop({ default: 0 })
  private streetId!: number

  private houses: IAddressModel[] = []

  private localValue = this.value || null
  private loading = false

  private async loadAddrHouse() {
    if (this.streetId > 0) {
			this.loading = true
			try {
				const { data } = await getHouses(this.streetId) as any
				this.houses = data
			} finally {
				this.loading = false
			}
		}
  }

	created() {
		this.loadAddrHouse()
	}

	@Watch('streetId')
	private onChStreetid() {
		this.loadAddrHouse()
	}
}
</script>
