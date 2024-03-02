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
  <h1>
    发布消息,预期结合社区邮箱系统开发社区系统及社区公告，项目展板。由于和登陆状态实时展示一样，需要webSocket技术，奈何本人及开发队友暂未学习，无法为开发者们及用户提供更好的体验，在此深表歉意，还请开发者们敬请期待！
  </h1>
</template>

<style scoped>
</style>