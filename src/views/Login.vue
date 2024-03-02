<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRsaUserInfoStore } from "../stores/rsaUserInfo";
import {
  NTabs,
  NTabPane,
  NForm,
  NFormItemRow,
  NInput,
  NButton,
  NTooltip,
  NImage,
  useMessage,
} from "naive-ui";
import { MailOutlined, QqOutlined } from "@ant-design/icons-vue";
import { ElNotification } from "element-plus";
import axios from "axios";
import instance from "../axios/axios";

import { copyUserInfo } from "../hooks/getAndStoreUserInfo";
import responseDataMessage from "../hooks/reponseDataMessage";
const route = useRoute();
const router = useRouter();
const rsaUserInfoStore = useRsaUserInfoStore();
/////////////////////////////////////////////////////////////////////
const loginFormHttpRequest = async () => {
  try {
    loginFormHttpValue.value.username = loginFormValue.value.loginName;
    loginFormHttpValue.value.password = loginFormValue.value.loginPassword;
    const response = await instance.post(
      "/users/login",
      loginFormHttpValue.value
    );
    const responseData = response.data;
    console.log(responseData);
    if (responseData.code === 1) {
      copyUserInfo(
        responseData.data.id,
        responseData.data.username,
        null,
        responseData.data.validate,
        responseData.data.userLogo,
        null,
        null,
        null,
        responseData.data.lastLoginTime,
        responseData.data.token
      );

      localStorage.setItem(
        "rsaUserInfo",
        JSON.stringify(rsaUserInfoStore.userLoginInfo)
      );
      ElNotification({
        title: "登录成功!",
        message: rsaUserInfoStore.userLoginInfo.username + ",欢迎您！",
        type: "success",
      });
      router.push("home");
      canLogin.value = true;
    } else if (responseData.code % 10 === 0) {
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
      type: "error",
    });
    console.log(error);
    canLogin.value = true;
  }
};
/////////////////////////////////////////////////////////////////////
const canGetEmailCode = ref(true);
///局部通用方法---获取邮箱验证码///
const getEmailCode = (email, type) => {
  ElNotification({
    title: "正在发送验证码......",
    type: "info",
  });
  canGetEmailCode.value = false;
  instance
    .get("/users/common/sendEmailCode/" + `${email}/` + `${type}`)
    .then((res) => {
      const responseData = res.data;
      responseDataMessage(responseData);
      canGetEmailCode.value = true;
    })
    .catch((error) => {
      ElNotification({
        title: "出错了，请稍后再试！",
        type: "error",
      });
      console.log(error);
      canGetEmailCode.value = true;
    });
};
/////////////////////////////////////////////////////////////////////
const getSignCode = () => {
  if (
    setupFormHttpValue.value.email === null ||
    setupFormHttpValue.value.email === ""
  ) {
    ElNotification({
      title: "请输入邮箱账号",
      type: "warning",
    });
  } else {
    getEmailCode(setupFormHttpValue.value.email, setupFormHttpValue.value.type);
  }
};
const setupFormHttpRequest = async () => {
  try {
    const response = await instance.post(
      "/users/sign",
      setupFormHttpValue.value
    );
    const responseData = response.data;
    responseDataMessage(responseData);
    canSetup.value = true;
    if (responseData.code === 1) {
      location.reload();
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
const loginFormValue = ref({
  loginName: null,
  loginPassword: null,
});
const loginFormHttpValue = ref({
  username: null,
  password: null,
});
const reenteredPassword = ref(null);
const setupFormHttpValue = ref({
  username: null,
  password: null,
  email: null,
  code: null,
  type: 1,
  //表示这是注册类型的邮箱验证
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
  if (reenteredPassword.value) {
    PasswordFormItemRef.value?.validate({ trigger: "password-input" });
  }
};
const validatePasswordForce = (rule, value) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,18}$/;
  return regex.test(setupFormHttpValue.value.password);
};
const validateSetupName = (rule, value) => {
  const regex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
  return regex.test(setupFormHttpValue.value.username);
};
const handleInput = (event, textTarget, formRef) => {
  let text = event;
  // 去除所有的回车、空格
  text = text.replace(/[\r\n\s]+/g, "");
  formRef.value[textTarget] = text; // 更新输入框的值
};
const validateEmail = (rule, value) => {
  const regex = /^[a-zA-Z0-9._%+-]+@(163|126|qq)\.com$/;
  return regex.test(setupFormHttpValue.value.email);
};
const checkPasswordSame = () => {
  if (setupFormHttpValue.value.password != reenteredPassword.value) {
    ElNotification({
      title: "两次密码不一致",
      type: "warning",
    });
  }
};
const setupRules = {
  username: [
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
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      validator: validatePasswordForce,
      message: "密码只能且必须包含数字字母,长度8~18位",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "请输入邮箱账号",
      trigger: "blur",
    },
    {
      validator: validateEmail,
      message: "请输入正确的邮箱账号",
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur",
    },
  ],
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
/////////////////////////////////////////////////////////////////////
const loginShow = ref(true);
const emailLoginShow = ref(false);
const changeLoginStyle = () => {
  loginShow.value = false;
  emailLoginShow.value = true;
};
const returnOriginLoginStyle = () => {
  loginShow.value = true;
  emailLoginShow.value = false;
};

const emailLoginRef = ref(null);
const emailLoginForm = ref({
  email: null,
  code: null,
  type: 2,
});
const validateLoginEmail = () => {
  let regex = /^[a-zA-Z0-9._%+-]+@(163|126|qq)\.com$/;
  return regex.test(emailLoginForm.value.email);
};
const emailLoginRules = {
  email: [
    {
      required: true,
      message: "请输入邮箱账号",
      trigger: "blur",
    },
    {
      validator: validateLoginEmail,
      message: "请输入正确的邮箱账号",
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur",
    },
  ],
};
const getLoginEmailCode = () => {
  if (
    emailLoginForm.value.email === null ||
    emailLoginForm.value.email === ""
  ) {
    ElNotification({
      title: "请输入邮箱账号",
      type: "warning",
    });
  } else {
    getEmailCode(emailLoginForm.value.email, emailLoginForm.value.type);
  }
};
const emailLoginHandleValidateButtonClick = (e) => {
  e.preventDefault();
  emailLoginRef.value?.validate((errors) => {
    if (!errors) {
      canLogin.value = false;
      handleEmailLogin();
    } else {
      ElNotification({
        title: "格式错误!",
        message: "请检查校验您的格式~",
        type: "error",
      });
    }
  });
};
const handleEmailLogin = async () => {
  try {
    const response = await instance.post(
      "/users/login/emailLogin",
      emailLoginForm.value
    );
    const responseData = response.data;
    console.log(responseData);
    if (responseData.code === 1) {
      instance.post("/users/removeValidation");
      copyUserInfo(
        responseData.data.id,
        responseData.data.username,
        null,
        responseData.data.validate,
        responseData.data.userLogo,
        null,
        null,
        null,
        responseData.data.lastLoginTime,
        responseData.data.token
      );

      localStorage.setItem(
        "rsaUserInfo",
        JSON.stringify(rsaUserInfoStore.userLoginInfo)
      );
      ElNotification({
        title: "登录成功!",
        message: rsaUserInfoStore.userLoginInfo.username + ",欢迎您！",
        type: "success",
      });
      router.push("home");
      canLogin.value = true;
    } else if (responseData.code % 10 === 0) {
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
      type: "error",
    });
    console.log(error);
    canLogin.value = true;
  }
};
</script>

<template>
  <div class="blur-background"></div>

  <el-form label-width="70px" :inline="true" class="login-container">
    <div class="login-title">
      <span @click="router.push({ name: 'home' })">返回首页</span>
      <h3>加入我们</h3>
      <n-tooltip placement="bottom" trigger="hover">
        <template #trigger>
          <span>详情提示</span>
        </template>
        <span style="display: block"
          ><div>
            2023-12-4<br />现已正式开放注册系统，并强制邮箱绑定，一号一箱制。<br />登录也可以支持普通登录和邮箱登录。
          </div></span
        >
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
        <template v-if="loginShow">
          <n-form
            :rules="loginRules"
            :model="loginFormValue"
            ref="loginFormRef"
          >
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
        </template>
        <template v-if="emailLoginShow">
          <n-form
            :rules="emailLoginRules"
            :model="emailLoginForm"
            ref="emailLoginRef"
          >
            <n-form-item-row label="邮箱账号" path="email">
              <n-input
                placeholder="输入您的邮箱账号"
                v-model:value="emailLoginForm.email"
                @keydown.enter.prevent
              />
            </n-form-item-row>
            <n-form-item-row label="验证码" path="code">
              <n-input
                placeholder="输入验证码"
                v-model:value="emailLoginForm.code"
                @keydown.enter.prevent
                style="width: 75%"
                maxlength="8"
              />
              <n-button
                type="success"
                ghost
                style="margin-left: 5%; width: 20%"
                @click="getLoginEmailCode"
                :disabled="!canGetEmailCode"
              >
                获取验证码
              </n-button>
            </n-form-item-row>
          </n-form>
          <n-button
            type="primary"
            block
            secondary
            strong
            @click="emailLoginHandleValidateButtonClick"
            :disabled="!canLogin"
          >
            登录
          </n-button>
          <div
            style="
              font-size: 16px;
              display: flex;
              align-items: center;
              justify-content: left;
              flex-wrap: wrap;
              margin-top: 15px;
            "
          >
            <n-tooltip :show-arrow="false" trigger="hover">
              <template #trigger>
                <QqOutlined
                  style="font-size: 18px; margin-right: 8px; color: #4e4e4e"
                />
              </template>
              qq邮箱登录(@qq.com)
            </n-tooltip>
            <n-tooltip :show-arrow="false" trigger="hover">
              <template #trigger>
                <n-image
                  width="20"
                  src="https://innerpurity-bucket.oss-cn-hangzhou.aliyuncs.com/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%9B%BE%E7%89%87.jpg"
                  preview-disabled
                />
              </template>
              网易邮箱登录(@163.com/@126.com)
            </n-tooltip>
          </div>
          <div
            style="text-align: right; cursor: pointer"
            @click="returnOriginLoginStyle"
          >
            切换为普通登录
          </div>
        </template>
        <hr style="color: #18a058; text-align: center; margin-top: 15px" />
        <div style="margin-top: 10px">
          <span>其他登录方式:</span><br />

          <n-tooltip :show-arrow="false" trigger="hover">
            <template #trigger>
              <MailOutlined style="font-size: 16px" @click="changeLoginStyle" />
            </template>
            邮箱登录
          </n-tooltip>
        </div>
        <!-- /////////////////////////////////////////////////////////////////////////////////// -->
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <!-- /////////////////////////////////////////////////////////////////////////////////// -->
        <n-form
          :rules="setupRules"
          :model="setupFormHttpValue"
          ref="setupFormRef"
        >
          <n-form-item-row label="用户名" path="username">
            <n-input
              placeholder="设置用户名"
              maxlength="16"
              show-count
              v-model:value="setupFormHttpValue.username"
              @keydown.enter.prevent
              @input="handleInput($event, 'username', setupFormHttpValue)"
            />
          </n-form-item-row>
          <n-form-item-row label="密码" path="password">
            <n-input
              placeholder="设置密码"
              maxlength="18"
              show-count
              type="password"
              show-password-on="click"
              v-model:value="setupFormHttpValue.password"
              @keydown.enter.prevent
              @input="handleInput($event, 'password'), handlePasswordInput"
            />
          </n-form-item-row>
          <n-form-item-row label="重复密码">
            <n-input
              placeholder="重复确认密码"
              maxlength="18"
              show-count
              type="password"
              show-password-on="click"
              v-model:value="reenteredPassword"
              @keydown.enter.prevent
              :disabled="!setupFormHttpValue.password"
              @blur="checkPasswordSame"
            />
          </n-form-item-row>
          <n-form-item-row
            label="绑定邮箱"
            path="email"
            style="margin-top: 10px"
          >
            <n-input
              placeholder="填写您的邮箱账号"
              v-model:value="setupFormHttpValue.email"
              @keydown.enter.prevent
              @input="handleInput($event, 'email')"
            />
          </n-form-item-row>
          <div
            style="
              font-size: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;
            "
          >
            <span style="color: red; font-size: 14px">@</span>支持: qq邮箱
            <n-tooltip :show-arrow="false" trigger="hover">
              <template #trigger>
                <QqOutlined
                  style="
                    font-size: 18px;
                    margin-right: 5px;
                    margin-left: 5px;
                    color: #4e4e4e;
                  "
                />
              </template>
              qq邮箱注册(@qq.com) </n-tooltip
            >、 <span style="margin-right: 5px">网易邮箱</span>
            <n-tooltip :show-arrow="false" trigger="hover">
              <template #trigger>
                <n-image
                  width="20"
                  src="https://innerpurity-bucket.oss-cn-hangzhou.aliyuncs.com/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%9B%BE%E7%89%87.jpg"
                  preview-disabled
                />
              </template>
              网易邮箱注册(@163.com/@126.com)
            </n-tooltip>
          </div>
          <n-form-item-row
            label="邮箱验证码"
            path="code"
            style="margin-top: 15px"
          >
            <n-input
              placeholder="输入验证码"
              v-model:value="setupFormHttpValue.code"
              @keydown.enter.prevent
              style="width: 75%"
              maxlength="8"
            />
            <n-button
              type="success"
              ghost
              style="margin-left: 5%; width: 20%"
              @click="getSignCode"
            >
              获取验证码
            </n-button>
          </n-form-item-row>
          <n-button
            type="primary"
            block
            secondary
            strong
            @keydown.enter="setupHandleValidateButtonClick"
            @click="setupHandleValidateButtonClick"
            :disabled="!canSetup"
          >
            注册
          </n-button>
        </n-form>
        <!-- /////////////////////////////////////////////////////////////////////////////////// -->
      </n-tab-pane>
    </n-tabs>
    <!-- ////////////////////////////////////////////////////////////////////////// -->
  </el-form>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.blur-background {
  /* 设置元素的宽度和高度为100%以覆盖整个页面 */
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;

  /* 设置背景图片 */
  background-image: url("https://innerpurity-bucket.oss-cn-hangzhou.aliyuncs.com/6DC3D2BD69BB6E1F5C6C2FBE2249E9DD.jpg");
  background-size: cover;

  /* 添加模糊效果 */
  backdrop-filter: blur(50px); /* 可以根据需要调整模糊程度 */
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
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 1em 2em -1em rgba(0, 0, 0, 0.5);
  padding: 1em 2em;
  line-height: 1.5;
  border-radius: 15px;
  width: 550px;
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
</style>