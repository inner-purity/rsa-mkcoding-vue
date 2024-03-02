<script setup>
import {
  onBeforeMount,
  onBeforeUnmount,
  ref,
  watch,
  watchEffect,
  onMounted,
  computed,
} from "vue";
import {
  ElMessage,
  ElNotification,
  ElEmpty,
  ElLoading,
  ElScrollbar,
} from "element-plus";
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
let timerId;
onMounted(() => {
  axiosGetExceptionData();
  timerId = setInterval(() => {
    axiosGetExceptionData();
  }, 6000);
});
onBeforeUnmount(() => {
  clearInterval(timerId);
});
const exceptionData = ref([]);

const LogExceptionDTO = ref({
  id: null,
  logTime: null,
  exceptionClass: null,
  requestIp: null,
  requestPath: null,
  className: null,
  methodName: null,
  exceptionMessage: null,
});

const axiosGetExceptionData = () => {
  instance.get("/logException/getAll").then((res) => {
    const responseData = res.data;
    exceptionData.value = responseData.data;
  });
};
</script>

<template>
  <div class="exceptionContainer">
    <el-scrollbar>
      <div
        :v-if="exceptionData.length > 0"
        v-for="item in exceptionData"
        :key="item.id"
        class="exceptionDataContainer"
      >
        <div class="exceptionData">
          <span class="exceptionTitle">异常序列号:</span>
          <span>{{ item.id }}</span>
          <span class="exceptionTitle" style="margin-left: 20px"
            >发生时间:</span
          >
          <span style="color: rgb(0, 150, 0)">{{ item.logTime }}</span>
          <span class="exceptionTitle" style="margin-left: 20px"
            >异常类别:</span
          >
          <span style="color: rgb(0, 207, 190); font-size: 14px">{{
            item.exceptionClass
          }}</span>
        </div>
        <div class="exceptionData">
          <span class="exceptionTitle">请求IP来源:</span>
          <span style="color: rgb(0, 207, 190)">{{ item.requestIp }}</span>
        </div>
        <div class="exceptionData">
          <span class="exceptionTitle">请求路径名:</span>
          <span style="color: #ebe22b">{{ item.requestPath }}</span>
        </div>
        <div class="exceptionData">
          <span class="exceptionTitle">定位异常所在类:</span>
          <span style="color: #ebe22b">{{ item.className }}</span>
        </div>
        <div class="exceptionData">
          <span class="exceptionTitle">定位异常所在方法:</span>
          <span style="color: #ebe22b">{{ item.methodName }}</span>
        </div>
        <div class="exceptionData">
          <span class="exceptionTitle">报错信息:</span>
          <span style="color: #dc2525">{{ item.exceptionMessage }}</span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.exceptionContainer {
  width: 100%;
  background-color: #000;
  height: 75vh;
  color: rgb(200, 200, 200);
  font-size: 16px;
}
.exceptionDataContainer {
  margin-bottom: 20px;
}

.exceptionData {
  margin-bottom: 5px;
}

.exceptionTitle {
  margin-right: 10px;
  font-weight: 600;
  font-size: 16px;
}
</style>