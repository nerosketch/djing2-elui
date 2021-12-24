<template>  
  <el-card shadow="never">
    <template v-slot:header>
      <div class="clearfix">Дополнительные данные</div>
    </template>
    <el-form>
      <template v-if="localContents.length > 0">
        <el-form-item v-for="(f, i) in localContents" :key="i" :label="f.title" prop="content">
          <el-input v-if="f.field_type == 1" v-model="f.content" type="number"></el-input>
          <el-input v-else-if="f.field_type == 2" v-model="f.content" placeholder="example@mail.com" type="email"></el-input>
          <el-date-picker v-else-if="f.field_type == 6" v-model="f.content" type="datetime" value-format="yyyy-MM-dd HH:mm" format="d.MM.yyyy HH:mm"></el-date-picker>
          <el-switch v-else-if="f.field_type == 7" v-model="f.content"></el-switch>
          <el-input v-else v-model="f.content"></el-input>
        </el-form-item>
      </template>
      <h3 v-else>Нет полей</h3>
      <el-form-item>
        <el-button icon="el-icon-upload" type="primary" @click="saveData">{{ $t('save') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IDynamicContentFieldList } from '@/api/dynamic-fields/types'

@Component({
  name: 'DynamicContentFields'
})
export default class extends Vue {
  @Prop({ required: true })
  private contents!: IDynamicContentFieldList

  @Watch('contents', { deep: true })
  private onChCont(cont: IDynamicContentFieldList) {
    this.localContents = cont
  }

  private localContents: IDynamicContentFieldList = this.contents

  private saveData() {
    this.$emit('save', this.localContents)
  }
}
</script>
