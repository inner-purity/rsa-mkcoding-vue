<script setup>
import Header from "./HomeComponents/Header.vue";
import historyStorage from "./HomeComponents/historyStorage.vue";
import CodingMakeSetup from "./HomeComponents/CodingMakeStep.vue";
import Cryption from "./HomeComponents/Cryption.vue";
import Introduce from "./HomeComponents/Introduce.vue";
import Footer from "../components/Footer.vue";
import { ref } from "vue";
const text = ref("");
</script>

<template>
  <Header />
  <historyStorage />
  <el-backtop :right="10" :bottom="600" :visibility-height="500">
    <div
      style="
        height: 100%;
        width: 100%;
        background-color: var(--el-bg-color-overlay);
        border: 2px solid #4015a2;
        text-align: center;
        line-height: 40px;
        color: #4015a2;
      "
    >
      UP
    </div>
  </el-backtop>

  <div
    id="keyCodeMaking"
    style="width: 100%; height: 1px; margin-top: 10px"
  ></div>
  <div class="html-href-rsa">
    <div class="title-column column-codingmake"></div>
    <h2>生成密钥</h2>
  </div>

  <div class="rsa-codeMaking">
    <CodingMakeSetup />
  </div>

  <div id="Cryption" style="width: 100%; height: 1px; margin-top: 10px"></div>
  <div class="html-href-rsa">
    <div class="title-column column-cryption"></div>
    <h2>加密/解密</h2>
  </div>

  <div class="rsa-cryption">
    <Cryption />
  </div>

  <div class="html-href-rsa">
    <div class="title-column column-intro"></div>
    <h2>RSA特点</h2>
  </div>
  <div class="bar-introduce">
    <Introduce />
  </div>
  <Footer />
</template>

<style>
.title-column {
  display: inline-block;
  height: 26px;
  width: 4px;
  font-size: 16px;
  font-weight: 900;
  text-align: center;
  line-height: 16px;
  margin-left: 10px;
  margin-bottom: 0.5em;
}
.column-codingmake {
  background-color: #626aef;
}
.column-cryption {
  background-color: #41a057;
}
.column-intro {
  background-color: #9307c2;
}

.html-href-rsa {
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  margin-top: 60px;
}

.html-href-rsa h2 {
  display: inline-block;
  margin-left: 10px;
}

.rsa-codeMaking {
  width: 100%;
  margin-top: 60px;
}
.rsa-cryption {
  width: 100%;
  margin-top: 60px;
}

.bar-introduce {
  width: 100%;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis; /* 显示省略号 */
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 20px;
}
</style>