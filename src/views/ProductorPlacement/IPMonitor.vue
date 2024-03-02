<script setup>
import {
  onBeforeMount,
  ref,
  watch,
  watchEffect,
  onMounted,
  computed,
} from "vue";
import { ElMessage, ElNotification, ElEmpty, ElLoading } from "element-plus";
import {
  NCard,
  NModal,
  NTooltip,
  NInputNumber,
  NButton,
  NInput,
} from "naive-ui";
///////////////////////////////////////////////////////////////////////////////////////////////////
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
///////////////////////////////////////////////////////////////////////////////////////////////////
import axios from "axios";
import instance from "../../axios/axios";
///////////////////////////////////////////////////////////////////////////////////////////////////

</script>

<template>
  <h1>来访IP监视，目前后端已经实现自动拦截设置为监视中的接口的来访IP，并设置了IP黑白名单，项目接口及数据展示交互正在筹备中......敬请期待</h1>
</template>

<style scoped>
</style>