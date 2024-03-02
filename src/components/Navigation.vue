<script setup>
import { ref, inject, onMounted, computed } from "vue";
import { NSwitch, NAvatar, NDropdown } from "naive-ui";
import { useTipsVisibleStore } from "../stores/tipsVisible";
import { useIsTypecodingStore } from "../stores/isTypeCoding";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { ElNotification } from "element-plus";
////////////////////////////////////////////////////////////////////////////////////////////
const route = useRoute();
const router = useRouter();
////////////////////////////////////////////////////////////////////////////////////////////
const useTipsVisible = useTipsVisibleStore();
const useIsTypecoding = useIsTypecodingStore();
////////////////////////////////////////////////////////////////////////////////////////////
const dialogVisible = ref(true);
const versionDialogNotVisible = ref(false);
////////////////////////////////////////////////////////////////////////////////////////////
const handleDialog = () => {
  if (versionDialogNotVisible.value === true) {
    if (localStorage.getItem("versionDialogNotVisible") === null) {
      localStorage.setItem(
        "versionDialogNotVisible",
        JSON.stringify(versionDialogNotVisible.value)
      );
    } else {
      localStorage.setItem(
        "versionDialogNotVisible",
        JSON.stringify(versionDialogNotVisible.value)
      );
    }
  }
  dialogVisible.value = false;
};
// const nowTime = ref("");
// const complement = (value) => {
//   return value < 10 ? `0${value}` : value;
// };
// const formateDate = (date) => {
//   const time = new Date(date);
//   const year = time.getFullYear();
//   const month = complement(time.getMonth() + 1);
//   const day = complement(time.getDate());
//   const hour = complement(time.getHours());
//   const minute = complement(time.getMinutes());
//   const second = complement(time.getSeconds());
//   const week = "星期" + "日一二三四五六".charAt(time.getDay());
//   return `${year}年${month}月${day}日 ${week} ${hour}:${minute}:${second}`;
// };
////////////////////////////////////////////////////////////////////////////////////////////
const railStyle = ({ focused, checked }) => {
  const style = {};
  if (checked) {
    style.background = "#626aef";
    if (focused) {
      style.boxShadow = "0 0 0 2px #d0305040";
    }
  } else {
    style.background = "#d03050";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};
////////////////////////////////////////////////////////////////////////////////////////////
const userLogoUrl = ref(
  "src/assets/userlogo.jpg"
);
////////////////////////////////////////////////////////////////////////////////////////////
const HttpRequestForUserMsg = () => {
  console.log("获取用户头像中......");
  try {
    axios
      .get(
        `http://localhost:2599/users/getuserlogo/${localStorage.getItem(
          "rsaUserLoginId"
        )}`
      )
      .then(
        (res) => {
          const responseData = res.data;
          console.log(responseData);
          if (responseData.code % 10 === 1) {
            userLogoUrl.value = responseData.data;
          } else if (responseData.code % 10 === 0) {
            ElNotification({
              title: "获取用户头像失败",
              message: responseData.msg,
              type: "error",
            });
          } else if (responseData.code === 59999) {
            userLogoUrl.value =
            "src/assets/userlogo.jpg"
          }
        },
        (err) => {
          userLogoUrl.value =
          "src/assets/userlogo.jpg"
        }
      );
  } catch (error) {
    userLogoUrl.value =
    "src/assets/userlogo.jpg"
  }
};
////////////////////////////////////////////////////////////////////////////////////////////
onMounted(() => {
  if (JSON.parse(localStorage.getItem("versionDialogNotVisible")) === true)
    dialogVisible.value = false;
  console.log("等待挂载...");
  HttpRequestForUserMsg();
});
////////////////////////////////////////////////////////////////////////////////////////////
const handleRouterGuide = () => {
  router.push({ name: "guide" });
};
////////////////////////////////////////////////////////////////////////////////////////////
const loginStatus = computed(() => {
  console.log(
    localStorage.getItem("loginStatus") + "***********************************"
  );
  if (
    localStorage.getItem("loginStatus") !== null &&
    localStorage.getItem("loginStatus") === true
  ) {
    return true;
  } else if (
    localStorage.getItem("loginStatus") === null ||
    localStorage.getItem("loginStatus") === false
  ) {
    return false;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////
const handleSelect = (key) => {
  if (String(key) === "userPlacement") {
    return null;
  } else if (String(key) === "productorPlacement") {
    return null;
  } else if (String(key) === "exit") {
    localStorage.setItem("loginStatus", false);
    localStorage.removeItem("rsaUserLoginId");
    HttpRequestForUserMsg();
  }
};
////////////////////////////////////////////////////////////////////////////////////////////
const loginAvatarOptions = [
  {
    label: "用户平台",
    key: "userPlacement",
  },
  {
    label: "开发者平台",
    key: "productorPlacement",
  },
  {
    label: "退出账号",
    key: "exit",
  },
];
</script>

<template>
  <el-affix :position="bottom">
    <div class="nav-bar">
      <div class="left_main">
        <a class="nav-rsa-logo" href="javascript:;"><h1 @click="router.push({name:'home'})">KEY-mkCoding</h1></a>
      </div>
      <!-- <span class="dateShow">{{ nowTime }}</span> -->
      <div class="right_main">
        <button class="guide-style" @click="handleRouterGuide">参考指南<el-icon size="16px" class="icon-promotion"><Promotion /></el-icon></button>
      <!-- /////////////////////////////////////////////////////////////////////////// -->
      <a-dropdown class="dropdown-style">
        <span class="dropdown-title">
          优化体验选项
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <div class="dropdown-item">
                <h3>打字机效果</h3>
              <n-switch :rail-style="railStyle" v-model:value="useIsTypecoding.TypeCodingOnOff">
              <template #icon>
                <span style="font-size: 14px;">✨</span>
              </template>
              <template #checked>
                关闭特效
              </template>
              <template #unchecked>
                开启特效
              </template>
            </n-switch>
              </div>
            </a-menu-item>
            <a-menu-item>
              <div class="dropdown-item">
                <h3>模块提示</h3>
                <n-switch :rail-style="railStyle" v-model:value="useTipsVisible.tipsShow">
                <template #icon>
                  <span style="font-size: 14px;">📍</span>
                </template>
                <template #checked>
                  隐藏Tips
                </template>
                <template #unchecked>
                  显示Tips
                </template>
              </n-switch>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <!-- /////////////////////////////////////////////////////////////////////////// -->
      <span class="avatarLogo">
        <n-dropdown trigger="hover" :options="loginAvatarOptions" @select="handleSelect">
          <n-avatar
          round
          size="medium"
          :src=userLogoUrl
        />
        </n-dropdown>
      </span>
      <span class="loginTitle" @click="router.push({name:'login'})" :v-show="loginStatus">登录/注册</span>
      </div>
    </div>
  </el-affix>
  <el-dialog
    v-model="dialogVisible"
    title="版本更新提示!"
    width="40%"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <h2>Key-mkCoding平台</h2>
    <br>
    <p class="dialog-p">本次更新版本：{{ versionData }}
      <br>
      <br>
      更新内容:
      <br>
      <br>
      <hr>
      模块架构：<br>
      1.新增加密解密模块!<br>
      2.加密解密现在可以通过直接上传txt文件自动识别填充了!更加方便！<br>
      3.新增文字生成模块区间提示,使用方法提示,新手不晕"码"!<br>
      4.支持打包下载密钥,密文,明文,的txt文件到本地,网站保存信息是一种方式,下载txt文件支持!<br>
      <br>
      细节：<br>
      1.不必担心复制问题,快捷复制依然支持,并且自动去除密钥体的前缀后缀。只复制密钥部分,足够简洁！<br>
      2.历史记录的密钥记录规则同样如上！存在历史记录中的只有密钥部分,方便直接查询以及复制。<br>
      3.下载的文档区域分明,不怕看不懂文档,内含具体操作解析,手把手教您提高信息安全！<br>
      4.新增顶栏时间显示部分<br>
      5.减少冗余代码,优化了网页界面体验。<br>
    </p>
    <template #footer>
        <el-button @click="handleDialog">
          开始使用!
        </el-button>
        <el-checkbox v-model="versionDialogNotVisible" style="margin-left:10px;">当前版本不再提示此消息</el-checkbox>
    </template>
  </el-dialog>
</template>

<style scoped>
.dropdown-style {
  --el-color-primary: #0e0e0e !important;
  --el-color-primary-light-3: #aaa !important;
  --el-color-primary-light-5: #aaa !important;
  --el-color-primary-light-7: #aaa !important;
  --el-color-primary-light-8: #aaa !important;
  --el-color-primary-light-9: #aaa !important;
}
.dialog-p {
  font-size: 14px;
  line-height: 20px;
}
.nav-bar {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.9);
  border-bottom: 2px solid rgba(84, 84, 84, 0.48);
}
.right_main {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-right: 10px;
}
.guide-style {
  border: none;
  color: #fff;
  height: 100%;
  background-color: transparent;
  cursor: pointer;
  margin-right: 35px;
}
.dropdown-title {
  height: 80%;
  line-height: 48px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  background-color: transparent;
  cursor: pointer;
  margin-right: 30px;
}
.icon-promotion {
  margin-left: 10px;
  top: 3px;
}
.dropdown-item {
  display: flex;
  justify-content: space-between;
  color: #000 !important;
}
.avatarLogo {
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 60px;
  text-align: center;
  cursor: pointer;
  margin-right: 20px;
}
.loginTitle {
  color: #fff;
  cursor: pointer;
}
.nav-rsa-logo {
  display: inline-block;
  height: 100%;
  text-align: center;
}
.nav-rsa-logo h1 {
  margin-left: 10px;
  display: inline-block;
  font-size: 18px;
  color: #9914f3;
  line-height: 60px;
  font-weight: 500;
  margin: 0;
  margin-left: 10px;
}
.nav-version {
  height: 100%;
  margin-right: 10px;
  display: inline-block;
  font-size: 14px;
  color: #fff;
  text-align: center;
  line-height: 60px;
}

:where(.css-hkh161) a {
  color: #fff;
}
</style>
