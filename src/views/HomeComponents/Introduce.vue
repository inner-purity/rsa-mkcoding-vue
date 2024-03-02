<script setup>
import { ref } from "vue";
const introItems = ref([
  {
    id: "introItems1",
    title: "强安全性",
    pargraph:
      "RSA密钥是一把安全性极高的加密利器！其采用了数学上的难题，确保您的数据无法被未经授权的人读取。",
    english: "Public key encryption, private key decryption.",
  },
  {
    id: "introItems2",
    title: "公钥加密、私钥解密",
    pargraph:
      "RSA密钥不仅可以用来加密您的信息，还可以用于数字签名和身份验证。通过使用公钥加密，您可以放心地将敏感信息发送给他人。",
    english: "Digital signature and verification.",
  },
  {
    id: "introItems3",
    title: "数字签名与验证",
    pargraph:
      "RSA密钥为您提供了数字签名的能力，通过使用私钥对信息进行签名，确保信息的真实性和完整性。",
    english: "Convenient key distribution.",
  },
  {
    id: "introItems4",
    title: "密钥分发便捷",
    pargraph:
      "与传统加密方法相比，RSA密钥的分发更加方便快捷。您只需将公钥发送给需要加密的人，私钥由您保留，不需要在网络上传输私密信息。",
    english: "High security.",
  },
]);
</script>

<template>
  <div v-for="items in introItems" :key="items.id" class="intro_card">
    <div class="card-front">
      <h3 class="intro-card-back-h2">{{ items.title }}</h3>
      <h4 class="intro-card-back-h3">{{ items.english }}</h4>
    </div>
    <div class="card-back">
      <h4 class="intro-card-h3">{{ items.title }}</h4>
      <p class="intro-card-p">{{ items.pargraph }}</p>
    </div>
  </div>
</template>

<style scoped>
.intro_card {
  overflow: hidden;
  perspective: 3000px;
  position: relative;
  width: 20%;
  height: 140px;
  border: 0;
  margin-left: 1%;
  margin-top: 20px;
  text-overflow: ellipsis; /* 显示省略号 */
  overflow: hidden; /* 超出部分隐藏 */
}

.intro_card:hover .card-front {
  transform: rotateX(180deg);
}
.intro_card:hover .card-back {
  transform: rotateX(0deg);
  z-index: 1;
}
.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}
.card-front {
  transform: rotateY(0deg);
  transition: transform 1s ease;
}
.card-back {
  transform: rotateY(-180deg);
  transition: transform 1.2s ease;
}

.intro-card-h3 {
  width: 100%;
  text-align: left;
  margin-bottom: 10px;
  font-weight: 500;
}
.intro-card-p {
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  bottom: 10px;
  text-indent: 2em;
  height: 60%;
  line-height: 26px;
}
.intro-card-back-h2 {
  text-align: center;
}
.intro-card-back-h3 {
  text-align: center;
  margin-top: 20px;
  background: linear-gradient(to top right, blue, 15%, red);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
</style>