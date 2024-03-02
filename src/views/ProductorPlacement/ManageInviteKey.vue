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
    邀请码管理,预期：注册系统预计近期 半对外开放
    ，意为通过开发者们每日进行一定配额的邀请码发配，邀请码完全随机生成，每个密钥有过期时间和使用次数。在可使用的条件下，可以使用邀请码进行注册，也就是注册时邀请码为必填项。
    后期结合首页的社区公告系统，会定期展示近期的邀请码发布情况，用户可按需注册。如果是周围感兴趣的同学也可以联系平台开发者们直接进行用户添加。肥肠欢迎大家来体验。甚至倒贴金币:)
    不开放注册的原因是目前不太了解第三方注册登录，如果没有这些，注册系统很可能会遭到网络攻击。
    所以，有兴趣合作开发的同学，或者正愁项目练手的同学，可以来联系a~~~~一块开发共同成长，后期还可能有更多项目合作机会~
    平台开发者们也多宣传宣传啦~
  </h1>
</template>

<style scoped>
</style>