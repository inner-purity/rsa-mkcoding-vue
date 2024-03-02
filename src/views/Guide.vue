<script setup>
import { useRoute, useRouter } from "vue-router";
////////////////////////////////////////////////////////////////////////////////////////////
const route = useRoute();
const router = useRouter();
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
</script>

<template>
  <el-container>
    <el-aside width="21%">
      <el-menu
        style="min-height: 630px"
        unique-opened="true"
        class="el-menu-style"
      >
        <el-menu-item index="1" @click="router.push({ name: 'sumary' })">
          <template #title>
            <span>总述</span>
          </template>
        </el-menu-item>
        <el-menu-item index="2" @click="router.push({ name: 'rsaIntro' })">
          <template #title>
            <span>加密算法介绍</span>
          </template>
        </el-menu-item>
        <el-sub-menu index="3">
          <template #title>
            <span>功能使用指南</span>
          </template>
          <el-menu-item-group title="网站基础功能">
            <el-menu-item
              index="3-1"
              @click="router.push({ name: 'commonFunction' })"
              >功能使用介绍</el-menu-item
            >
          </el-menu-item-group>
          <el-menu-item-group title="注意事项">
            <el-menu-item
              index="3-4"
              @click="router.push({ name: 'commonAlert' })"
              >注意事项提醒</el-menu-item
            >
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <span>成为用户&登录/注册</span>
          </template>
          <el-menu-item-group title="登陆注册">
            <el-menu-item
              index="4-1"
              @click="router.push({ name: 'userLogin' })"
              >登录/注册</el-menu-item
            >
          </el-menu-item-group>
          <el-menu-item-group title="用户功能">
            <el-menu-item
              index="4-2"
              @click="router.push({ name: 'userFunction' })"
              >用户功能介绍</el-menu-item
            >
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item
          index="5"
          @click="router.push({ name: 'producterPlacement' })"
        >
          <template #title>
            <span>开发者平台</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="max-height: 630px"
      ><router-view v-slot="{ Component }">
        <transition name="fade-right" mode="out-in">
          <component :is="Component" />
        </transition> </router-view
    ></el-main>
  </el-container>
</template>

<style scoped>
span {
  font-weight: 500;
  font-size: 17px;
  font-family: "Open Sans", Arial, sans-serif;
}
:deep().el-menu-style {
  --el-menu-active-color: #7a68ef;
  background-color: #fff !important;
}
:deep().el-menu-style :hover {
  background-color: #fff !important;
}
</style>