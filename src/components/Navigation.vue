<script setup>
import { ref, onMounted, computed, onBeforeMount, watch } from "vue";

import {
  NSwitch,
  NAvatar,
  NDropdown,
  NButton,
  NDrawer,
  NDrawerContent,
  NInput,
  NTag,
  NImage,
} from "naive-ui";
import { ElNotification, ElMessageBox, ElIcon } from "element-plus";

import { useTipsVisibleStore } from "../stores/tipsVisible";
import { useIsTypecodingStore } from "../stores/isTypeCoding";
import { useRsaUserInfoStore } from "../stores/rsaUserInfo";

import { useRoute, useRouter } from "vue-router";
import axios from "../axios/axios";

import { copyUserInfo } from "../hooks/getAndStoreUserInfo";
import responseDataMessage from "../hooks/reponseDataMessage";
import { getAndStoreUserInfo } from "../hooks/getAndStoreUserInfo";
import clearUserInfo from "../hooks/clearUserInfo";
////////////////////////////////////////////////////////////////////////////////////////////
const route = useRoute();
const router = useRouter();
////////////////////////////////////////////////////////////////////////////////////////////
const useTipsVisible = useTipsVisibleStore();
const useIsTypecoding = useIsTypecodingStore();
const rsaUserInfoStore = useRsaUserInfoStore();
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
const dialogVisible = ref(true);
const versionDialogNotVisible = ref(false);
////////////////////////////////////////////////////////////////////////////////////////////
onMounted(() => {
  if (JSON.parse(localStorage.getItem("versionDialogNotVisible")) === true)
    dialogVisible.value = false;

  if (localStorage.getItem("rsaUserInfo")) {
    userLogoUrl.value = JSON.parse(
      localStorage.getItem("rsaUserInfo")
    ).userLogo;
    getAndStoreUserInfo();
  }
});
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
  "https://innerpurity-bucket.oss-cn-hangzhou.aliyuncs.com/userlogo.jpg"
);
////////////////////////////////////////////////////////////////////////////////////////////
const handleRouterGuide = () => {
  router.push({ name: "guide" });
};

const handleRouterLogin = () => {
  if (rsaUserInfoStore.userLoginInfo.username === null) {
    router.push("login");
    userLogoUrl.value =
      "https://innerpurity-bucket.oss-cn-hangzhou.aliyuncs.com/userlogo.jpg";
    localStorage.removeItem("rsaUserInfo");
    clearUserInfo();
  }
};
////////////////////////////////////////////////////////////////////////////////////////////
const toUserPlacement = () => {
  try {
    getAndStoreUserInfo().then(() => {
      userLogoUrl.value = rsaUserInfoStore.userLoginInfo.userLogo;
      userInfoCard.value = true;
    });
  } catch {
    ElNotification({
      title: "出错了！请稍候再试",
      type: "error",
      offset: 50,
    });
  }
};

const toProductorPlacement = () => {
  if (
    rsaUserInfoStore.userLoginInfo.validate >= 1 &&
    rsaUserInfoStore.userLoginInfo.deleting === 0
  ) {
    router.push({ name: "productorplacement" });
  } else {
    ElNotification({
      title: "暂无权限访问",
      message: "开发者出现此消息请尝试刷新页面获得权限",
      type: "error",
      offset: 50,
    });
  }
};

const toExit = () => {
  axios.put("/users/exit").then((res) => {
    ElNotification({
      title: "感谢使用！Bye~",
      type: "info",
      offset: 50,
    });
    userLogoUrl.value =
      "https://innerpurity-bucket.oss-cn-hangzhou.aliyuncs.com/userlogo.jpg";
    localStorage.removeItem("rsaUserInfo");
    clearUserInfo();
    loginOrUsername.value = "登录->";
  });
};

const handleSelect = (key) => {
  if (String(key) === "userPlacement") {
    toUserPlacement();
  } else if (String(key) === "productorPlacement") {
    toProductorPlacement();
  } else if (String(key) === "exit") {
    toExit();
  }
};
////////////////////////////////////////////////////////////////////////////////////////////

const loginAvatarOptions = [
  {
    label: "个人信息",
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
////////////////////////////////////////////////////////////////////////////////////////////
const userInfoCard = ref(false);
////////////////////////////////////////////////////////////////////////////////////////////
const loginStatusColor = computed(() => {
  if (rsaUserInfoStore.userLoginInfo.status === 1) {
    return {
      color: "#fff",
      textColor: "rgb(119,194,53)",
      borderColor: "rgb(119,194,53)",
    };
  } else if (rsaUserInfoStore.userLoginInfo.status === 0) {
    return {
      color: "#fff",
      textColor: "rgb(145.147.153)",
      borderColor: "rgb(145.147.153)",
    };
  }
});
const loginDeletingColor = computed(() => {
  if (rsaUserInfoStore.userLoginInfo.deleting === 2) {
    return {
      color: "#fff",
      textColor: "rgb(231,107,106)",
      borderColor: "rgb(231,107,106)",
    };
  } else if (rsaUserInfoStore.userLoginInfo.deleting === 0) {
    return {
      color: "#fff",
      textColor: "rgb(119,194,53)",
      borderColor: "rgb(119,194,53)",
    };
  }
});
////////////////////////////////////////////////////////////////////////////////////////////
const validatePasswordForce = () => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
  return regex.test(newPassword.value.newPassword);
};
////////////////////////////////////////////////////////////////////////////////////////////
const newUserInfo = ref({
  username: null,
  userLogo: null,
});
const newPassword = ref({
  originPassword: null,
  newPassword: null,
});
////////////////////////////////////////////////////////////////////////////////////////////
const isChanging = ref(false);
const isChangingBaseInfo = ref(false);
const isChangingPassword = ref(false);
const changeBaseInfo = () => {
  isChanging.value = true;
  isChangingBaseInfo.value = true;
};
const cancelChangeBaseInfo = () => {
  isChanging.value = false;
  isChangingBaseInfo.value = false;
};
const cleanBaseInfo = () => {
  newUserInfo.value.userLogo = null;
  newUserInfo.value.username = null;
};
const handleChangeBaseInfo = () => {
  if (newUserInfo.value.userLogo || newUserInfo.value.username) {
    if (newUserInfo.value.username === "") {
      newUserInfo.value.username = null;
    } else {
      try {
        ElMessageBox.confirm("确定现在更新信息并重新登录？", "更新个人信息", {
          confirmButtonText: "重新登录",
          cancelButtonText: "撤销更新",
          type: "warning",
          closeOnClickModal: false,
          closeOnPressEscape: false,
        })
          .then(() => {
            axios
              .put("/users/updateUserBaseInfo", newUserInfo.value)
              .then((res) => {
                const responseData = res.data;
                if (responseData.code === 1) {
                  responseDataMessage(
                    responseData,
                    "(如更改用户名,则输入新用户名登录)"
                  );
                  userLogoUrl.value = rsaUserInfoStore.userLoginInfo.userLogo;
                  router.push("login");
                  userLogoUrl.value =
                    "https://innerpurity-bucket.oss-cn-hangzhou.aliyuncs.com/userlogo.jpg";
                  localStorage.removeItem("rsaUserInfo");
                } else {
                  responseDataMessage(responseData);
                }
              });
          })
          .catch(() => {});
      } catch (error) {
        console.log(error);
        ElNotification({
          title: `${error.message}`,
          type: "error",
        });
      }
    }
  } else {
    ElNotification({
      title: "请填写信息",
      type: "info",
    });
  }
};

const changePassword = () => {
  isChanging.value = true;
  isChangingPassword.value = true;
};
const cancelChangePassword = () => {
  isChanging.value = false;
  isChangingPassword.value = false;
};
const cleanPassword = () => {
  newPassword.value.originPassword = null;
  newPassword.value.newPassword = null;
};
const handleChangePassword = () => {
  if (newPassword.value.originPassword && newPassword.value.newPassword) {
    if (validatePasswordForce()) {
      if (newPassword.value.originPassword != newPassword.value.newPassword) {
        try {
          ElMessageBox.confirm("确定现在更改密码并重新登录？", "更改密码", {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消更改",
            type: "warning",
            closeOnClickModal: false,
            closeOnPressEscape: false,
          })
            .then(() => {
              const formData = new FormData();
              formData.append(
                "originPassword",
                newPassword.value.originPassword
              );
              formData.append("newPassword", newPassword.value.newPassword);
              axios
                .put("/users/updateUserPassword", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then((res) => {
                  const responseData = res.data;
                  if (responseData.code === 1) {
                    responseDataMessage(responseData, "输入新密码登录");
                    userLogoUrl.value = rsaUserInfoStore.userLoginInfo.userLogo;
                    router.push("login");
                    userLogoUrl.value =
                      "https://innerpurity-bucket.oss-cn-hangzhou.aliyuncs.com/userlogo.jpg";
                    localStorage.removeItem("rsaUserInfo");
                  } else {
                    responseDataMessage(responseData);
                  }
                });
            })
            .catch(() => {});
        } catch (error) {
          console.log(error);
          ElNotification({
            title: `${error.message}`,
            type: "error",
          });
        }
      } else {
        ElNotification({
          title: "新旧密码相同",
          type: "info",
        });
      }
    } else {
      ElNotification({
        title: "密码格式不规范",
        message: "密码只能且必须包含数字字母,长度8~18位,不允许空格",
        type: "info",
      });
    }
  } else {
    ElNotification({
      title: "请完整填写",
      type: "info",
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////
// 典型代码---可复制重复利用=====对接后端文件上传---图片格式数据
////////////////////////////////////////////////////////////////////////////////////////////
const fileInput = ref(null);

const uploadImage = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const selectedImage = event.target.files[0];
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedTypes.includes(selectedImage.type)) {
    ElNotification({
      title: "图片上传失败",
      message: "图像格式只能为jpg,jpeg,png",
      type: "error",
    });
    event.target.value = ""; // 清空文件选择，让用户重新选择
  } else if (selectedImage.size > 800 * 1024) {
    // 图片大小超过800KB，给出提示或者进行其他处理
    ElNotification({
      title: "图片上传失败",
      message: "图片大小不能超过800kb",
      type: "error",
    });
    event.target.value = ""; // 清空文件选择，让用户重新选择
  } else {
    uploadToServer(selectedImage);
  }
};

const uploadToServer = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    axios
      .post("/users/common/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const responseData = res.data;
        console.log(responseData);
        newUserInfo.value.userLogo = responseData.data;
      });
  } catch (error) {
    ElNotification({
      title: "图片上传失败",
      type: "error",
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////
const loginOrUsername = computed(() => {
  if (rsaUserInfoStore.userLoginInfo.username != null) {
    return rsaUserInfoStore.userLoginInfo.username;
  } else {
    return "登录->";
  }
});

watch(rsaUserInfoStore.userLoginInfo.username, (newValue) => {
  if (newValue === null) {
    loginOrUsername.value = "登录->";
  } else if (newValue != null) {
    loginOrUsername.value = rsaUserInfoStore.userLoginInfo.username;
  }
});

const ValidateShow = computed(() => {
  if (rsaUserInfoStore.userLoginInfo.validate === 0) {
    return "个人用户";
  } else if (rsaUserInfoStore.userLoginInfo.validate === 1) {
    return "平台测试员";
  } else if (rsaUserInfoStore.userLoginInfo.validate === 2) {
    return "平台开发者";
  }
});
</script>

<template>
  <el-affix :position="bottom">
    <div class="nav-bar">
      <div class="left_main">
        <a class="nav-rsa-logo" href="javascript:;"><h1 @click="router.push({name:'home'})">KEY&nbsp;<el-icon size="12" ><Connection /></el-icon>&nbsp;mkCoding</h1></a>
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
      <span class="loginTitle" @click="handleRouterLogin" :v-show="loginStatus">{{ loginOrUsername }}</span>
      </div>
    </div>
  </el-affix>
      <!-- /////////////////////////////////////////////////////////////////////////// -->
  <n-drawer
  v-model:show="userInfoCard"
  :default-width="860"
  :placement="right"
  resizable
>
  <n-drawer-content title="个人信息">

    <div class="userInfoAllContainer">
      <!-- /////////////////////////////////////////////////////////////////////////// -->

      <div class="userInfoLeftContainer" v-show="!isChanging">
        <div class="userInfoTitle">
          <div class="title-column column-codingmake"></div>
          <h3>用户名</h3>
        </div>
        <div class="userInfoContainer">{{ rsaUserInfoStore.userLoginInfo.username }}</div>
    
        <div class="userInfoTitle">
          <div class="title-column column-codingmake"></div>
          <h3>头像</h3>
        </div>
        <div class="userInfoLogoContainer">
          <n-image
              width="170"
              height="170"
              :src="rsaUserInfoStore.userLoginInfo.userLogo"
              class="userInfoLogo"
            />
        </div>

        <n-button ghost color="#626aef" class="userInfoChangeButton" @click="changeBaseInfo">
          更改基础信息
        </n-button>
        <n-button ghost color="rgb(195,47,79)" class="userInfoChangeButton" @click="changePassword">
          更改密码
        </n-button>
      </div>
      <!-- /////////////////////////////////////////////////////////////////////////// -->
      
      <div class="userInfoRightContainer" v-show="!isChanging">
        <div class="userInfoTitle">
          <div class="title-column column-codingmake"></div>
          <h3>个人权限</h3>
        </div>
        <div class="userInfoContainer">{{ ValidateShow }}</div>
    
        <div class="userInfoTitle">
          <div class="title-column column-codingmake"></div>
          <h3>上次登录时间</h3>
        </div>
        <div class="userInfoContainer">{{ rsaUserInfoStore.userLoginInfo.lastLoginTime }}</div>
    
        <div class="userInfoTitle">
          <div class="title-column column-codingmake"></div>
          <h3>注册时间</h3>
        </div>
        <div class="userInfoContainer">{{ rsaUserInfoStore.userLoginInfo.createTime }}</div>
    
        <div class="userInfoTitle">
          <div class="title-column column-codingmake"></div>
          <h3>登录状态</h3>
        </div>
        <div>
          <n-tag :color="loginStatusColor" round style="margin-left: 25px; margin-top: 6px; margin-bottom: 8px">
            {{ rsaUserInfoStore.userLoginInfo.status === 1 ? "已登录" : "已下线" }}
          </n-tag>
        </div>
    
        <div class="userInfoTitle">
          <div class="title-column column-codingmake"></div>
          <h3>账号状态</h3>
        </div>
        <div>
          <n-tag :color="loginDeletingColor" round style="margin-left: 25px; margin-top: 6px; margin-bottom: 8px">
            {{ rsaUserInfoStore.userLoginInfo.deleting === 2 ? "已被禁用" : "许可使用" }}
          </n-tag>
        </div>
      </div>
      <!-- /////////////////////////////////////////////////////////////////////////// -->
      <div class="changeBaseInfoContainer" v-show="isChangingBaseInfo">
        <div>
          <div class="userInfoTitle" style="margin-bottom: 15px;">
            <div class="title-column column-codingmake"></div>
            <h3>更改用户名&nbsp;&nbsp;<span style="font-size: 14px; color: #5c5c5c;">(*登录时所用的用户名)</span></h3>
          </div>
          <input placeholder="起个独一无二的好名~" v-model="newUserInfo.username" class="newUsernameInput" maxlength="16"/>
      
          <div class="userInfoTitle">
            <div class="title-column column-codingmake"></div>
            <h3>更换头像</h3>
          </div>
          <div class="userInfoLogoContainer" @click="uploadImage">
            <img v-if="newUserInfo.userLogo" :src="newUserInfo.userLogo" class="userInfoLogo">
            <el-icon v-if="!newUserInfo.userLogo" size="40" color="#ccc"><Plus /></el-icon>
          </div>
          <input type="file" ref="fileInput" accept=".jpg, .jpeg, .png" style="display: none" @change="handleFileChange">
        </div>

        <div style="display: flex; margin-left: -25px;justify-content: space-evenly;align-items:center;">
          <n-button ghost color="#303133" class="userInfoChangeButton" @click="cancelChangeBaseInfo">
            返回
          </n-button>
          <n-button ghost color="#f89898" class="userInfoChangeButton" @click="cleanBaseInfo">
            清空
          </n-button>
          <n-button ghost color="#7879fa" class="userInfoChangeButton" @click="handleChangeBaseInfo">
            提交信息
          </n-button>
        </div>
      </div>
      <!-- /////////////////////////////////////////////////////////////////////////// -->
      <div class="changeBaseInfoContainer" v-show="isChangingPassword">
        <div>
          <div class="userInfoTitle">
            <div class="title-column column-codingmake"></div>
            <h3>原密码</h3>
          </div>
          <input type="password" placeholder="输入原密码" v-model="newPassword.originPassword" class="newUsernameInput"/>
          
          <div class="userInfoTitle">
            <div class="title-column column-codingmake"></div>
            <h3>新密码</h3>
          </div>
          <input type="password" placeholder="设置新密码" v-model="newPassword.newPassword" class="newUsernameInput" maxlength="18"/>
        </div>

        <div style="display: flex; margin-left: -25px;justify-content: space-evenly;align-items:center;">
          <n-button ghost color="#303133" class="userInfoChangeButton" @click="cancelChangePassword">
            返回
          </n-button>
          <n-button ghost color="#f89898" class="userInfoChangeButton" @click="cleanPassword">
            清空
          </n-button>
          <n-button ghost color="#7879fa" class="userInfoChangeButton" @click="handleChangePassword">
            更改密码
          </n-button>
        </div>
      </div>
      <!-- /////////////////////////////////////////////////////////////////////////// -->

    </div>
  </n-drawer-content>
</n-drawer>
      <!-- /////////////////////////////////////////////////////////////////////////// -->
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
  background-color: rgba(0, 0, 0, 1);
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

.userInfoAllContainer {
  width: 90%;
  margin: 20px auto;
  display: flex;
  justify-content: space-around;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
}

.userInfoLogoContainer {
  width: 180px;
  height: 180px;
  border: 2px dotted #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 25px;
}
.userInfoLogoContainer:hover {
  border: 2px dotted #626aef;
  cursor: pointer;
}
:deep().userInfoLogo {
  width: 170px;
  height: 170px;
  object-fit: cover; /* 让图像按比例铺满容器 */
  object-position: center; /* 将图像置中 */
}

.title-column {
  display: inline-block;
  height: 26px;
  width: 4px;
  font-size: 16px;
  font-weight: 900;
  text-align: center;
  line-height: 16px;
  margin-bottom: 0.5em;
}
.title-column-color {
  background-color: #626aef;
}
.userInfoTitle {
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  margin-top: 10px;
}

.userInfoTitle h3 {
  display: inline-block;
  margin-left: 10px;
}
.userInfoContainer {
  margin-left: 25px;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 200px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.userInfoContainer:hover {
  border: 1px solid #626aef;
  cursor: default;
}

.userInfoRightContainer {
  overflow: hidden;
  margin-left: 30px;
}

.userInfoChangeButton {
  margin-left: 25px;
  margin-top: 40px;
}

.newUsernameInput {
  width: 180px;
  height: 36px;
  border-radius: 8px;
  border: 1.5px solid #aaa;
  padding-left: 10px;
  margin-left: 25px;
  outline: none;
}

.newUsernameInput:hover {
  border: 1.5px solid #626aef;
}

.newUsernameInput:focus {
  border: 1.5px solid #626aef;
}

.changeBaseInfoContainer {
  margin: 0 auto;
}
</style>
