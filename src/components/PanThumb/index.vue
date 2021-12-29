<template lang="pug">
 .pan-item(
    :style="{zIndex: zIndex, height: height, width: width}"
    @click="changeAva"
  )
    img.pan-thumb(
      :src="image"
      :height="height"
      ref="avaimg"
    )
    input(type='file' ref='avainput' hidden accept="image/png, image/jpeg, image/gif")
</template>

<script lang="ts">
import { CurrentUserProfileModule } from '@/store/modules/profiles/current-user-profile'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'PanThumb'
})
export default class extends Vue {
  public readonly $refs!: {
    avainput: HTMLInputElement,
    avaimg: HTMLImageElement
  }

  @Prop({ required: true }) private image!: string
  @Prop({ default: '150px' }) private width!: string
  @Prop({ default: '150px' }) private height!: string
  @Prop({ default: 1 }) private zIndex!: number

  private changeAva() {
    if (!this.isIam()) {
      return
    }
    this.$refs.avainput.onchange = (ev: any) => {
      const reader = new FileReader()
      const img = this.$refs.avaimg
      reader.onload = (e: any) => { // e: ProgressEvent<FileReader>
        img.src = e.target.result
        CurrentUserProfileModule.PatchAvatar(ev.target.files[0]).then(() => {
          this.$message.success('Аватар успешно сохранён')
        })
      }
      reader.readAsDataURL(ev.target.files[0])
    }
    this.$refs.avainput.click()
  }

  private isIam() {
    return this.$store.state.userprofile.id === CurrentUserProfileModule.id
  }
}
</script>

<style lang="scss" scoped>
.pan-item {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  cursor: default;
}

.pan-thumb {
  background-position: center center;
  background-size: cover;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 2px 2px 7px #6f6f6f;
}
</style>
