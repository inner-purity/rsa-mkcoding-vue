<script setup>
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-right">
      <component :is="Component"/>
    </transition>
  </router-view>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style: none;
}
a {
  text-decoration: none;
}
html {
  scroll-behavior: smooth;
}
h1 {
  margin: 0;
  padding: 0;
}
.fade-right-enter-to,
.fade-right-leave-from{
  opacity: 1;
  transform: none;
}
 
.fade-right-enter-active,
.fade-right-leave-active
{
  transition: all 0.25s;
}
 
.fade-right-enter-from,
.fade-right-leave-to{
  opacity: 0;
  transform: translateX(20px);
}
</style>
