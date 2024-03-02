<script setup>
import Navigation from "../components/Navigation.vue";
</script>

<template>
  <Navigation />
  <router-view v-slot="{ Component }">
    <transition name="fade-right">
      <component :is="Component"/>
    </transition>
  </router-view>
</template>

<style>
</style>