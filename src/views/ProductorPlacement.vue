<script setup>
import {
  onBeforeMount,
  h,
  ref,
  watch,
  watchEffect,
  onMounted,
  computed,
} from "vue";
import {
  TeamOutlined,
  CrownOutlined,
  ApiOutlined,
  MonitorOutlined,
  InsertRowLeftOutlined,
  NotificationOutlined,
  VerifiedOutlined,
  AlertOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";
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
import instance from "../axios/axios";
///////////////////////////////////////////////////////////////////////////////////////////////////
import { useRsaUserInfoStore } from "../stores/rsaUserInfo";
const userInfo = useRsaUserInfoStore();
import { copyUserInfo } from "../hooks/getAndStoreUserInfo";
///////////////////////////////////////////////////////////////////////////////////////////////////
onBeforeMount(() => {
  instance
    .get("users/getUserInfo")
    .then((res) => {
      const responseData = res.data;
      copyUserInfo(
        responseData.data.id,
        responseData.data.username,
        responseData.data.password,
        responseData.data.validate,
        responseData.data.userLogo,
        responseData.data.status,
        responseData.data.deleting,
        responseData.data.createTime,
        responseData.data.lastLoginTime
      );
      if (userInfo != null && userInfo.userLoginInfo.validate > 0) {
        router.push({ name: "usermanage" });
      } else {
        ////////noAuth页面
        router.push({ name: "noauthpage" });
      }
    })
    .catch(() => {
      if (userInfo != null && userInfo.userLoginInfo.validate > 0) {
        router.push({ name: "usermanage" });
      } else {
        ////////noAuth页面
        router.push({ name: "noauthpage" });
      }
    });
  ///注意catch要写在aioxs异步链上，
  //否则用try-catch包裹时=是达不到抛出异常的效果的，因为此处已经被axios自定义拦截器拦截过一番，
  //并且设置了Promise.reject()了，所以异常归属为了axios异步链，在其外不能捕获异常
});
const selectedKeys = ref(["1"]);
const sideMenuItems = ref([
  {
    key: "1",
    icon: () => h(TeamOutlined),
    label: "用户管理",
    title: "用户管理",
  },
  {
    key: "2",
    icon: () => h(CrownOutlined),
    label: "开发者管理",
    title: "开发者管理",
  },
  {
    key: "3",
    icon: () => h(ApiOutlined),
    label: "项目接口运维",
    title: "项目接口运维",
  },
  {
    key: "4",
    icon: () => h(AlertOutlined),
    label: "异常捕获日志",
    title: "异常捕获日志",
  },
  {
    key: "5",
    icon: () => h(MonitorOutlined),
    label: "来访IP监视",
    title: "来访IP监视",
  },
  {
    key: "6",
    icon: () => h(InsertRowLeftOutlined),
    label: "IP地址簿",
    title: "IP地址簿",
  },
  {
    key: "7",
    icon: () => h(NotificationOutlined),
    label: "发布消息",
    title: "发布消息",
  },
  {
    key: "8",
    icon: () => h(VerifiedOutlined),
    label: "邀请码发配",
    title: "邀请码发配",
  },
  {
    key: "9",
    icon: () => h(MessageOutlined),
    label: "在线聊天室",
    title: "在线聊天室",
  },
]);

const handleClickMenu = (params) => {
  switch (params.key) {
    case "1": {
      router.push("usermanage");
      break;
    }
    case "2": {
      router.push("productormanage");
      break;
    }
    case "3": {
      router.push("projectsocket");
      break;
    }
    case "4": {
      router.push("catchexception");
      break;
    }
    case "5": {
      router.push("ipmonitor");
      break;
    }
    case "6": {
      router.push("ipstorage");
      break;
    }
    case "7": {
      router.push("sendmessage");
      break;
    }
    case "8": {
      router.push("manageinvitekey");
      break;
    }
    case "9": {
      router.push("chatroom");
      break;
    }
  }
};
</script>

<template>
  <a-layout :style="{ minHeight: '100vh' }">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logoContainer" @click="router.push({ name: 'home' })">
        <span class="logoSpan"
          >Key&nbsp;<el-icon size="17"><Connection /></el-icon
          >&nbsp;mkCoding</span
        >
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        :items="sideMenuItems"
        @click="handleClickMenu"
        :style="{ marginTop: '3vh' }"
      >
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        :style="{ background: '#fff', padding: 0, maxHeight: '7vh' }"
      >
      <div class="header-container">
        <span style="font-size: 12px;font-weight: 400;margin-right: 10px">尊敬的开发者：<span style="font-size: 12px;font-weight: 600">{{ userInfo.userLoginInfo.username }}</span>,&nbsp;&nbsp;&nbsp;让我们共同开发，共同成长!</span>
        <el-avatar :size="30" :src="userInfo.userLoginInfo.userLogo" />
      </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div
          :style="{
            padding: '24px',
            background: '#fff',
            minHeight: '83vh',
          }"
        >
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center; max-height: 10vh">
        云道甄心 ♥ RSA-mkCoding | 开发者面板
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.logoContainer {
  text-align: center;
  height: 7vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #081f38;
}
.logoSpan {
  color: #4279ff;
  font-size: 20px;
  border-width: 2px;
  font-weight: 300;
  transition: all 0.3s;
}
.logoContainer:hover {
  background-color: #1e5dfb;
}
.logoContainer:hover .logoSpan {
  color: #fff;
}
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout-sub-header-background {
  background: #141414;
}

.header-container {
  width: 100%;
  height: 7vh;
  display: flex;
  justify-content: right;
  align-items: center;
  padding-right: 20px;
}
</style>
