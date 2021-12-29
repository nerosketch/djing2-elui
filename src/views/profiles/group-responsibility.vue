<template lang="pug">
  div
    el-checkbox(
      v-for="grp in groups"
      :key="grp.id"
      :label="grp.title"
      v-model="grp.state")

    br
    el-button(
      icon="el-icon-upload"
      type="primary"
      @click="saveResp"
      :loading="loading"
      :disabled="!$perms.is_superuser"
    ) {{ $t('save') }}
</template>