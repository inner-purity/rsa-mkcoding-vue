<script setup>
import { NCard, NTabs, NTabPane, NResult, NButton } from "naive-ui";
import "animate.css";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
////////////////////////////////////////////////////////////////////////////////////////////
const returnHome = () => {
  router.push({ name: "home" });
};
</script>

<template>
  <div class="result">
    <n-result
      status="403"
      title="暂无权限 禁止访问"
      description="总有些平台是对您关闭的,请谅解~"
      size="huge"
    >
      <template #footer>
        <n-button type="primary" ghost @click="returnHome"> 返回首页 </n-button>
      </template>
    </n-result>
  </div>
</template>

<style scoped>
.result {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}
</style>