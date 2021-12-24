<template lang="pug">
  .navbar
    hamburger.hamburger-container(:is-active="$store.state.app.sidebar.opened", @toggleClick="toggleSideBar")
  
    form.center-header(@submit.prevent="doSearch")
      el-input(
        v-model="searchStr"
        placeholder="Поиск"
        prefix-icon="el-icon-search")
        template(v-slot:append)
          el-button(icon="el-icon-search", @click="doSearch")
  
    .right-menu
      el-dropdown.avatar-container.right-menu-item.hover-effect(trigger="click")
        .avatar-wrapper
          img.user-avatar(v-if="$store.getters.isAvatar", :src="avatar")
            span(v-else)
              | {{ profileUname }}
          
            i.el-icon-caret-bottom
        
          template(v-slot:dropdown)
            el-dropdown-menu
              router-link(to="/customers")
                el-dropdown-item
                  | Домашняя
            
              router-link(to="/reports")
                el-dropdown-item
                  | Отчёты
            
              router-link(to="/sites", v-if="$perms.is_superuser")
                el-dropdown-item
                  | Домены
            
              router-link(to="/messenger")
                el-dropdown-item
                  | Мессенжеры
            
              router-link(:to="{name: 'profileDetail', params:{ profileUname: $store.state.currentuserprofile.username }}")
                el-dropdown-item
                  | Настройки
            
              el-dropdown-item(divided)
                span(style="display:block;", @click="logout")
                  | Выйти
</template>