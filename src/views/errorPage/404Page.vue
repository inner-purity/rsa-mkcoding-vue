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
      status="404"
      title="404 资源不存在"
      description="找不到啊，这怎么办~还是先返回首页吧！嗯..."
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