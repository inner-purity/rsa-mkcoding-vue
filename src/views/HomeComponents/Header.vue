<script setup>
import { computed, ref, watch } from "vue";
import { useRsaHistoryStore } from "../../stores/rsaHistory";
import { NNumberAnimation, NDialog, NDialogProvider } from "naive-ui";
import { onMounted } from "vue";
import handleScroll from "../../hooks/handleScroll";
import { useRsaUserInfoStore } from "../../stores/rsaUserInfo";
import { ElNotification,ElIcon } from "element-plus";
const rsaUserInfoStore = useRsaUserInfoStore();
const rsaHistoryStore = useRsaHistoryStore();
onMounted(() => {
  numberActive.value = true;
});

const numberActive = ref(false);
watch(numberActive, (newValue, oldValue) => {
  if (newValue === true) {
    ///axios请求，获取用户数据信息
  }
});

const quikemakeCountActiveTo = computed(() => {
  if (localStorage.getItem("axiosRequestCountStorage") === null) {
    return 0;
  } else {
    return JSON.parse(localStorage.getItem("axiosRequestCountStorage"));
  }
});
const cryptionActiveTo = computed(() => {
  if (localStorage.getItem("cryptionCountStorage") === null) {
    return 0;
  } else {
    return JSON.parse(localStorage.getItem("cryptionCountStorage"));
  }
});
const historyKeyActiveTo = computed(() => {
  if (localStorage.getItem("keyHistoryStorage") === null) {
    return 0;
  } else {
    return JSON.parse(localStorage.getItem("keyHistoryStorage")).length;
  }
});

const checkHistoryData = () => {
  if (rsaUserInfoStore.userLoginInfo.id != null) {
    rsaHistoryStore.drawerShow = true;
  } else {
    ElNotification.info({
    title: '登录获取储存权限',
    message: '为保证用户数据安全，存储功能登录后才能使用',
    offset: 50,
  })
  }
};

////////////////////////////////////////////////////////////////////////////
</script>

<template>
  <div class="header-bg">
    <div class="headerTextContainer">
      <span class="header-font-rsa">KEY&nbsp;<el-icon size="62" color="#88016D"><Connection /></el-icon>&nbsp;mkCoding</span>
      <hr class="header-hr-rsa-bottom" />
      <p class="header-p-rsa">
        生成密钥&nbsp;&nbsp;&nbsp;加密解密&nbsp;&nbsp;&nbsp;的<span
          class="header-p-rsa-important"
          >简约</span
        >平台
      </p>
      <p class="header-p-rsa">
        仅需几步，<span class="header-p-rsa-important">快速</span
        >提高您的网络流通信息安全水平
      </p>

      <div class="number-active-container">
        <div class="header-left-container">
          <!-- <span class="number-paragraph-left-active"
          >您已使用本网站生成&nbsp;&nbsp;
          <span class="number-active-style">
            <n-number-animation
              ref="numberAnimationInstRef"
              show-separator
              :from="0"
              :to="quikemakeCountActiveTo"
              :active="numberActive"
              :duration="3000"
            /> </span
          >&nbsp;&nbsp;条密钥
        </span> -->
          <button class="btn-header">
            <a @click.prevent="handleScroll('keyCodeMaking')">
              <span class="header-p-quikmake">生成密钥</span>
              <el-icon color="#fff" size="18px" class="header-icon-key"
                ><Key
              /></el-icon>
            </a>
          </button>
        </div>

        <div class="header-middle-container">
          <!-- <span class="number-paragraph-middle-active"
          >已加密/解密&nbsp;&nbsp;
          <span class="number-active-style">
            <n-number-animation
              ref="numberAnimationInstRef"
              show-separator
              :from="0"
              :to="cryptionActiveTo"
              :active="numberActive"
              :duration="3000"
            /> </span
          >&nbsp;&nbsp;条信息
        </span> -->
          <button class="btn-header">
            <a @click.prevent="handleScroll('Cryption')">
              <span class="header-p-quikmake">加密/解密</span>
              <el-icon color="#fff" size="18px" class="header-icon-key"
                ><Switch
              /></el-icon>
            </a>
          </button>
        </div>

        <div class="header-left-container">
          <!-- <span class="number-paragraph-right-active"
          >个人账户数据记录:&nbsp;&nbsp;
          <span class="number-active-style">
            <n-number-animation
              ref="numberAnimationInstRef"
              show-separator
              :from="0"
              :to="historyKeyActiveTo"
              :active="numberActive"
              :duration="3000"
            /> </span
          >&nbsp;&nbsp;条
        </span> -->
          <button
            class="btn-header btn-header-history"
            @click="checkHistoryData"
          >
            <span class="header-p-history">查看账户数据</span>
            <el-icon color="#fff" size="18px" class="header-icon-key"
              ><Box
            /></el-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-bg {
  overflow: hidden;
  width: 100%;
  background-image: url("https://innerpurity-bucket.oss-cn-hangzhou.aliyuncs.com/6DC3D2BD69BB6E1F5C6C2FBE2249E9DD.jpg");
  /* 可选：设置背景图片的重复方式 */
  background-repeat: no-repeat;
  /* 可选：设置背景图片的位置 */
  background-position: center;
  /* 可选：设置背景图片的大小 */
  background-size: cover;
  border-radius: 0 0 10% 10%;
  height: 600px;
}

.headerTextContainer {
  width: 100%;
  height: 360px;
  overflow: hidden;
  margin-top: 100px;
  background-color: rgba(88, 88, 88, 0.1);
  border-radius: 0 0 10% 10%;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
}

.header-font-rsa {
  display: block;
  font-size: 80px;
  font-weight: 500;
  background: linear-gradient(to top left, blue, 60%, red);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  text-align: center;
  margin: 0 auto;
}
.header-hr-rsa-bottom {
  border: none;
  position: relative;
  width: 50%;
  height: 1px;
  margin: 10px auto;
}
.header-hr-rsa-bottom::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top left, red, 50%, blue);
}
.header-p-rsa {
  margin: 10px auto;
  text-align: center;
  font-size: 22px;
  font-weight: 300;
  color: #c6c6c6;
  height: 30px;
  line-height: 30px;
}
.header-p-rsa-important {
  margin: 10px 4px;
  text-align: center;
  font-size: 23px;
  font-weight: 300;
  color: #fff;
  height: 30px;
  line-height: 30px;
}
.number-active-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
.header-left-container {
  text-align: right;
  display: flex;
  flex-direction: column; /* 设置主轴为纵向（y 轴） */
  justify-content: center; /* 垂直居中对齐 */
  margin: 30px;
  margin-right: 80px;
}
.header-middle-container {
  text-align: center;
  display: flex;
  flex-direction: column; /* 设置主轴为纵向（y 轴） */
  justify-content: center; /* 垂直居中对齐 */
  margin: 30px;
  margin-right: 80px;
}
.header-right-container {
  text-align: left;
  display: flex;
  flex-direction: column; /* 设置主轴为纵向（y 轴） */
  justify-content: center; /* 垂直居中对齐 */
  margin: 30px;
}

.number-active-style {
  text-align: center;
  font-size: 30px;
  background: linear-gradient(to top left, blue, 60%, red);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
.number-paragraph-left-active {
  display: block;
  text-align: right;
  font-size: 18px;
  right: 0;
  color: #fff;
}
.number-paragraph-middle-active {
  display: block;
  text-align: center;
  font-size: 18px;
  right: 0;
  color: #fff;
}
.number-paragraph-right-active {
  display: block;
  text-align: left;
  font-size: 18px;
  left: 0;
  color: #fff;
}
.btn-header {
  display: inline-block;
  width: 120px;
  height: 48px;
  border-radius: 10px;
  background-color: transparent;
  border: 1px solid #9307c2;
  margin-top: 10px;
  align-self: center; /* 子元素垂直居中 */
  font-weight: 300;
}
.btn-header:hover {
  cursor: pointer;
}
.btn-header:hover .header-p-quikmake {
  color: #ccc;
}
.btn-header:hover .header-icon-key {
  color: #ccc;
}
.btn-header:hover .header-p-history {
  color: #ccc;
}
.btn-header:hover .header-icon-key {
  color: #ccc;
}
.btn-header:hover {
  cursor: pointer;
}
.btn-header-history {
  width: 150px;
  border: 1px solid #626aef;
}
.header-p-quikmake {
  display: inline-block;
  height: 100%;
  width: 80%;
  line-height: 48px;
  color: #fff;
  font-size: 18px;
}
.header-p-history {
  display: inline-block;
  height: 100%;
  width: 80%;
  line-height: 48px;
  color: #fff;
  font-size: 18px;
}

.header-icon-key {
  display: inline-block;
  height: 100%;
  line-height: 48px;
  width: 20%;
  margin: auto 0;
  top: 3px;
}

html,
body {
  width: 100%;
  height: 100%;
  background: #111;
}

html {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

body {
  font: normal 75% Arial, Helvetica, sans-serif;
}

canvas {
  display: block;
  vertical-align: bottom;
}

/* ---- stats.js ---- */

.count-particles {
  background: #000022;
  position: absolute;
  top: 48px;
  left: 0;
  width: 80px;
  color: #13e8e9;
  font-size: 0.8em;
  text-align: left;
  text-indent: 4px;
  line-height: 14px;
  padding-bottom: 2px;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
}

.js-count-particles {
  font-size: 1.1em;
}

#stats,
.count-particles {
  -webkit-user-select: none;
  margin-top: 5px;
  margin-left: 5px;
}

#stats {
  border-radius: 3px 3px 0 0;
  overflow: hidden;
}

.count-particles {
  border-radius: 0 0 3px 3px;
}

/* ---- particles.js container ---- */

#particles-js {
  width: 100%;
  height: 100%;
  background-color: #000000;
  background-image: url("");
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
}
</style>
