<script setup>
</script>

<template>
  <footer>
    <h2>简约，致力于简单高效的服务</h2>
    <div class="netInfo">
      <a
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=14010702070894"
        target="_blank"
        ><img
          src="../assets/备案图标.png"
          style="vertical-align: middle"
        />晋公网安备 14010702070894号</a
      >
      <a href="https://beian.miit.gov.cn/" target="_blank"
        >晋ICP备2023019902号-1</a
      >
    </div>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 120px;
  background-color: #1e1e20;
  margin-top: 10px;
}
footer h2 {
  display: block;
  text-align: center;
  height: 50px;
  width: 500px;
  line-height: 50px;
  color: #fff;
  border: 2px solid #fff;
  border-bottom: none;
  border-top: none;
}
footer .netInfo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  margin-top: 2%;
}
footer .netInfo a {
  color: #aaa;
  display: inline-block;
  margin: 0 10px;
}
footer .netInfo a:hover {
  text-decoration: underline;
}
</style>