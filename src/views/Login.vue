<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  NTabs,
  NTabPane,
  NForm,
  NFormItemRow,
  NInput,
  NButton,
  NTooltip,
  useMessage,
} from "naive-ui";
import { ElNotification } from "element-plus";
import axios from "axios";
const route = useRoute();
const router = useRouter();
/////////////////////////////////////////////////////////////////////
const username = ref("");
const loginFormHttpRequest = async () => {
  console.log("正在发送post请求......");
  try {
    loginFormHttpValue.value.username = loginFormValue.value.loginName;
    loginFormHttpValue.value.password = loginFormValue.value.loginPassword;
    const response = await axios.post(
      "http://localhost:2599/users/login",
      loginFormHttpValue.value
    );
    const responseData = response.data;
    console.log("response:", response);
    console.log("responseData:", responseData);
    if (responseData.code % 10 === 1) {
      username.value = responseData.data.username;
      ElNotification({
        title: "登录成功!",
        message: username.value + ",欢迎您！",
        type: "success",
      });
      router.push({
        name: "home",
        params: {
          username: loginFormValue.value.loginName,
          userpassword: loginFormValue.value.loginPassword,
        },
      });
      canLogin.value = true;
      localStorage.setItem("rsaUserLoginId", responseData.data.id);
      localStorage.setItem("loginStatus", true);
    } else if (responseData.code % 10 === 0) {
      console.log();
      ElNotification({
        title: "登录失败！",
        message: responseData.msg,
        type: "error",
      });
      canLogin.value = true;
    }
  } catch (error) {
    ElNotification({
      title: "出错了，请稍后再试！",
      message: "",
      type: "error",
    });
    canLogin.value = true;
  }
};
/////////////////////////////////////////////////////////////////////
const setupFormHttpRequest = async () => {
  console.log("正在发送post请求......");
  try {
    setupFormHttpValue.value.username = setupFormValue.value.setupName;
    setupFormHttpValue.value.password = setupFormValue.value.setupPassword;
    setupFormHttpValue.value.inviteKey = setupFormValue.value.inviteKey === "" ? null : setupFormValue.value.inviteKey;
    const response = await axios.post(
      "http://localhost:2599/users/sign",
      setupFormHttpValue.value
    );
    const responseData = response.data;
    console.log("response:", response);
    console.log("responseData:", responseData);
    if (responseData.code % 10 === 1) {
      ElNotification({
        title: "注册成功!",
        message: responseData.msg,
        type: "success",
      });
      canSetup.value = true;
    } else if (responseData.code % 10 === 0) {
      console.log();
      ElNotification({
        title: "注册失败！",
        message: responseData.msg,
        type: "error",
      });
      canSetup.value = true;
    }
  } catch (error) {
    ElNotification({
      title: "出错了，请稍后再试！",
      message: error,
      type: "error",
    });
    canSetup.value = true;
  }
};
/////////////////////////////////////////////////////////////////////
const loginFormRef = ref(null);
const setupFormRef = ref(null);
const rPasswordFormItemRef = ref(null);
const loginFormValue = ref({
  loginName: null,
  loginPassword: null,
});
const loginFormHttpValue = ref({
  username: null,
  password: null,
});
const setupFormValue = ref({
  setupName: null,
  setupPassword: null,
  inviteKey: null,
});
const setupFormHttpValue = ref({
  username: null,
  password: null,
  inviteKey: null,
});
const loginRules = {
  loginName: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  loginPassword: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
};
const handlePasswordInput = () => {
  if (setupFormValue.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
  }
};
const validatePasswordStartWith = (rule, value) => {
  return (
    !!setupFormValue.value.setupPassword &&
    setupFormValue.value.setupPassword.startsWith(value) &&
    setupFormValue.value.setupPassword.length >= value.length
  );
};
const validatePasswordSame = (rule, value) => {
  return value === setupFormValue.value.setupPassword;
};
const validatePasswordForce = (rule, value) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
  return regex.test(setupFormValue.value.setupPassword);
};
const validateSetupName = (rule, value) => {
  const regex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
  return regex.test(setupFormValue.value.setupName);
};
const handleInput = (event, textTarget, formRef) => {
  let text = event;
  // 去除所有的回车、空格
  text = text.replace(/[\r\n\s]+/g, "");
  formRef.value[textTarget] = text; // 更新输入框的值
  // console.log("去掉全部空格和回车");
};
const setupRules = {
  setupName: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
    {
      validator: validateSetupName,
      message: "只能包含中英文、数字、下划线",
      trigger: "blur",
    },
  ],
  setupPassword: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      validator: validatePasswordForce,
      message: "密码只能且必须包含数字字母,长度8~18位,不允许空格",
      trigger: "blur",
    },
  ],
  reenteredPassword: [
    {
      required: true,
      message: "请再次输入密码",
      trigger: "blur",
    },
    {
      validator: validatePasswordStartWith,
      message: "两次密码输入不一致",
      trigger: "input",
    },
    {
      validator: validatePasswordSame,
      message: "两次密码输入不一致",
      trigger: ["blur", "password-input"],
    },
  ],
  inviteKey: [],
};
const canSetup = ref(true);
const canLogin = ref(true);
const loginHandleValidateButtonClick = (e) => {
  e.preventDefault();
  loginFormRef.value?.validate((errors) => {
    if (!errors) {
      canLogin.value = false;
      loginFormHttpRequest();
    } else {
      ElNotification({
        title: "格式错误!",
        message: "请检查校验您的格式~",
        type: "error",
      });
    }
  });
};
const setupHandleValidateButtonClick = (e) => {
  e.preventDefault();
  setupFormRef.value?.validate((errors) => {
    if (!errors) {
      ElNotification({
        title: "正在注册，请稍后......",
        message: "正在为您注册账户",
        type: "info",
      });
      canSetup.value = false;
      setupFormHttpRequest();
    } else {
      ElNotification({
        title: "格式错误!",
        message: "请检查校验您的格式~",
        type: "error",
      });
    }
  });
};
</script>

<template>
  <!-- 文字区不需要请连css部分代码一并删除 -->
  <el-form label-width="70px" :inline="true" class="login-container">
    <div class="login-title">
      <span @click="router.push({ name: 'home' })">返回首页</span>
      <h3>加入我们</h3>
      <n-tooltip placement="bottom" trigger="hover">
        <template #trigger>
          <span>详情提示</span>
        </template>
        <span style="display: block"><div>it's promotion</div></span>
      </n-tooltip>
    </div>
    <!-- ////////////////////////////////////////////////////////////////////////// -->
    <n-tabs
      justify-content="space-evenly"
      class="card-tabs"
      default-value="signin"
      size="large"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
    >
      <n-tab-pane name="signin" tab="登录">
        <!-- /////////////////////////////////////////////////////////////////////////////////// -->
        <n-form :rules="loginRules" :model="loginFormValue" ref="loginFormRef">
          <n-form-item-row label="用户名" path="loginName">
            <n-input
              placeholder="输入用户名"
              v-model:value="loginFormValue.loginName"
              @keydown.enter.prevent
            />
          </n-form-item-row>
          <n-form-item-row label="密码" path="loginPassword">
            <n-input
              placeholder="输入密码"
              type="password"
              show-password-on="click"
              v-model:value="loginFormValue.loginPassword"
              @keydown.enter.prevent
            />
          </n-form-item-row>
        </n-form>
        <n-button
          type="primary"
          block
          secondary
          strong
          @click="loginHandleValidateButtonClick"
          :disabled="!canLogin"
        >
          登录
        </n-button>
        <!-- /////////////////////////////////////////////////////////////////////////////////// -->
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <!-- /////////////////////////////////////////////////////////////////////////////////// -->
        <n-form :rules="setupRules" :model="setupFormValue" ref="setupFormRef">
          <n-form-item-row label="用户名" path="setupName">
            <n-input
              placeholder="输入用户名"
              maxlength="16"
              show-count
              v-model:value="setupFormValue.setupName"
              @keydown.enter.prevent
              @input="handleInput($event, 'setupName', setupFormValue)"
            />
          </n-form-item-row>
          <n-form-item-row label="密码" path="setupPassword">
            <n-input
              placeholder="设置密码"
              maxlength="18"
              show-count
              type="password"
              show-password-on="click"
              v-model:value="setupFormValue.setupPassword"
              @keydown.enter.prevent
              @input="handleInput($event, 'setupPassword'), handlePasswordInput"
            />
          </n-form-item-row>
          <n-form-item-row
            label="重复密码"
            path="reenteredPassword"
            ref="rPasswordFormItemRef"
          >
            <n-input
              placeholder="再次输入"
              maxlength="18"
              show-count
              type="password"
              show-password-on="click"
              v-model:value="setupFormValue.reenteredPassword"
              @keydown.enter.prevent
              :disabled="!setupFormValue.setupPassword"
              @input="handleInput($event, 'reenteredPassword')"
            />
          </n-form-item-row>
          <n-button
            type="primary"
            block
            secondary
            strong
            @click="setupHandleValidateButtonClick"
            :disabled="!canSetup"
          >
            注册
          </n-button>
          <hr
            style="
              margin: 40px auto 0;
              width: 80%;
              border: none;
              background-color: #41a057;
              height: 1.5px;
            "
          />
          <n-form-item-row
            label="邀请码(非必需)"
            path="inviteKey"
            style="margin-top: 10px"
          >
            <n-input
              placeholder="普通用户无需填写直接注册即可"
              type="password"
              show-password-on="click"
              v-model:value="setupFormValue.inviteKey"
              @keydown.enter.prevent
              @input="handleInput($event, 'inviteKey')"
            />
          </n-form-item-row>
        </n-form>
        <!-- /////////////////////////////////////////////////////////////////////////////////// -->
      </n-tab-pane>
    </n-tabs>
    <!-- ////////////////////////////////////////////////////////////////////////// -->
  </el-form>
  <!-- 你可以添加个多“.slideshow-image”项目, 记得修改CSS -->
  <div class="slideshow">
    <div
      class="slideshow-image"
      style="background-image: url('img/1.jpg')"
    ></div>
    <div
      class="slideshow-image"
      style="background-image: url('img/2.jpg')"
    ></div>
    <div
      class="slideshow-image"
      style="background-image: url('img/3.jpg')"
    ></div>
    <div
      class="slideshow-image"
      style="background-image: url('img/4.jpg')"
    ></div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  z-index: 99;
  text-align: center;
  font-family: Raleway, sans-serif;
  font-weight: 300;
  text-transform: uppercase;
  background-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 1em 2em -1em rgba(0, 0, 0, 0.5);
  padding: 1em 2em;
  line-height: 1.5;
  border-radius: 15px;
  width: 35%;
}
.login-container .login-title {
  display: flex;
  text-align: center;
  color: #505458;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.login-container .login-title h3 {
  display: inline-block;
  cursor: default;
}
.login-container .login-title span {
  font-size: 13px;
  color: #41a057;
  cursor: pointer;
}
.login-container .el-input {
  width: 100%;
}

.slideshow {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.slideshow-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background: no-repeat 50% 50%;
  background-size: cover;
  -webkit-animation-name: kenburns;
  animation-name: kenburns;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-duration: 13.5s;
  animation-duration: 13.5s;
  opacity: 1;
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
}
.slideshow-image:nth-child(1) {
  -webkit-animation-name: kenburns-1;
  animation-name: kenburns-1;
  z-index: 3;
}
.slideshow-image:nth-child(2) {
  -webkit-animation-name: kenburns-2;
  animation-name: kenburns-2;
  z-index: 2;
}
.slideshow-image:nth-child(3) {
  -webkit-animation-name: kenburns-3;
  animation-name: kenburns-3;
  z-index: 1;
}
.slideshow-image:nth-child(4) {
  -webkit-animation-name: kenburns-4;
  animation-name: kenburns-4;
  z-index: 0;
}

@-webkit-keyframes kenburns-1 {
  0% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  1.5625% {
    opacity: 1;
  }
  23.4375% {
    opacity: 1;
  }
  26.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  98.4375% {
    opacity: 0;
    -webkit-transform: scale(1.21176);
    transform: scale(1.21176);
  }
  100% {
    opacity: 1;
  }
}

@keyframes kenburns-1 {
  0% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  1.5625% {
    opacity: 1;
  }
  23.4375% {
    opacity: 1;
  }
  26.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  98.4375% {
    opacity: 0;
    -webkit-transform: scale(1.21176);
    transform: scale(1.21176);
  }
  100% {
    opacity: 1;
  }
}
@-webkit-keyframes kenburns-2 {
  23.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  26.5625% {
    opacity: 1;
  }
  48.4375% {
    opacity: 1;
  }
  51.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
}
@keyframes kenburns-2 {
  23.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  26.5625% {
    opacity: 1;
  }
  48.4375% {
    opacity: 1;
  }
  51.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
}
@-webkit-keyframes kenburns-3 {
  48.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  51.5625% {
    opacity: 1;
  }
  73.4375% {
    opacity: 1;
  }
  76.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
}
@keyframes kenburns-3 {
  48.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  51.5625% {
    opacity: 1;
  }
  73.4375% {
    opacity: 1;
  }
  76.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
}
@-webkit-keyframes kenburns-4 {
  73.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  76.5625% {
    opacity: 1;
  }
  98.4375% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes kenburns-4 {
  73.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  76.5625% {
    opacity: 1;
  }
  98.4375% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>