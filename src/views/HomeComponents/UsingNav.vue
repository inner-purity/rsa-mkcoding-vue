<script setup>
import { NCard, NTabs, NTabPane } from "naive-ui";
import "animate.css";
import { ref } from "vue";
import { useUsingNavVisibleStore } from "../../stores/UsingNavVisible.js";
////////////////////////////////////////////////////////////////////////////////////////////
const UsingNavVisible = useUsingNavVisibleStore();
////////////////////////////////////////////////////////////////////////////////////////////
const UsingNavList = ref([
  {
    name: "begin",
    tab: "开始",
  },
  {
    name: "Intro",
    tab: "加密算法简介",
  },
  {
    name: "CodingMake",
    tab: "生成密钥",
  },
  {
    name: "Cryption",
    tab: "加密/解密",
  },
  {
    name: "storage",
    tab: "本地记录",
  },
  {
    name: "download",
    tab: "下载文件",
  },
  {
    name: "Tips",
    tab: "提示",
  },
]);
</script>

<template>
  <n-card
    title="使用指南"
    style="
      margin: 15px auto;
      border: 1.6px solid #18a058;
      width: 50%;
      border-radius: 10px;
    "
    v-show="UsingNavVisible.usingNavshow"
    class="animate__animated animate__fadeInLeft animate__faster"
  >
    <n-tabs type="bar" animated>
      <n-tab-pane :name="UsingNavList[0].name" :tab="UsingNavList[0].tab"
        ><p>如果您对本网站操作流程已经熟悉,可快速跳转至指定模块进行使用。</p>
        <br />
        <p>
          如果您初来乍到但想追求效率快速上手，或者您长时间未使用已经忘记相关操作,<br />
          <strong
            >不必担心,您仍然可以直接跳转至指定模块进行使用。每一模块都有Tips指引。按照指引即可顺利完成操作!</strong
          >
        </p>
        <br />
        <p>
          如果您想全面了解网站操作与加密算法流程的细节，参阅该指南！该指南将会介绍各个模块的使用流程及注意事项，并介绍涉及到的相关技术点。
        </p>
        <br />
        <p>
          点击顶部固定栏开关
          <strong>"隐藏/参考 使用指南"</strong> 来显示/隐藏该指南!
        </p>
      </n-tab-pane>
      <n-tab-pane :name="UsingNavList[1].name" :tab="UsingNavList[1].tab"
        ><p><strong>RSA</strong
          >(Rivest-Shamir-Adleman)是一种非对称加密算法,用于安全地传输和保护敏感信息。
          它基于两个主要原理:公钥和私钥。<strong>公钥用于加密数据,而私钥用于解密数据。</strong>被广泛应用于数字签名、安全通信以及数据加密等领域。</p></n-tab-pane
      >
      <n-tab-pane :name="UsingNavList[2].name" :tab="UsingNavList[2].tab">
        <p>你可以点击上方大屏中的 "<strong>生成密钥</strong>" 按钮来快速跳转至生成密钥模块 进行密钥生成。<br>
        该模块主要用于在线生成不同类型的密钥，以下是关于 <pre>[生成密钥]</pre> 模块的具体介绍：<br><br>
        <strong>1.密钥类型</strong>：<br>
        目前网站支持的加密算法有：RSA<br>
        (你可以按照自己的需求或参考 <pre>[加密算法简介]</pre> 来选择加密算法)<br><br>
        <strong>2.密钥强度</strong>：<br>
        目前网站支持的密钥强度有：512 、 1024 、 2048<br>
        (数字代表加密长度，数字越大加密效果越强，越难被破译)<br><br>
        <strong>3.私钥密码</strong>：<br>
        准备私钥密码一般是为了二次加强信息的保密程度，这样通过自定义方式来在配对验证加一层保险。不过需要说明的是，私钥密码的设定不会影响私钥的生成，完全是算法外的附加产物，用于增强加密效果。所以设定后请牢记。<br>
        (如果没有特别需求，其实并不一定要设置私钥密码👍)<br><br>
        <strong>4.生成密钥</strong>：<br>
        根据你前几步选择的加密类型，页面会生成相应的公钥私钥。下面具体讲解公私钥的使用方法。<br><br>
        <strong>#公钥</strong>：每当你需要加密一段文字时，公钥是必不可少的。使用公钥加密字段会得到加密后的密文，这样信息就完成了加密操作。<br><br>
        <strong>#私钥</strong>：当你使用公钥加密一段字段获得密文后，就可以拿私钥来解密密文(这不是自娱自乐，这仅仅是举个例子，一会儿会介绍如何派发公钥私钥)。私钥不能随便使用一个无关密钥，该私钥必须与公钥是密钥对。本站生成的密钥也是公钥私钥成对生成。这样一组公私密钥称作 <strong>"密钥对"</strong> !<br><br>
        <strong>#密钥的分配处理</strong>:有了密钥对，我们就可以更放心的使用加密过的信息进行信息传输了!以RSA为例,(其他密钥类似)。
        在实际使用过程中，你可以执行以下操作达到信息加密传输的目的。
        (1)
      </p>
      </n-tab-pane>
      <n-tab-pane :name="UsingNavList[3].name" :tab="UsingNavList[3].tab"
        >打开我们的网站,并导航到RSA加密解密页面。
        在该页面,您将看到两个输入框,一个用于输入待加密的信息,另一个用于输入待解密的密文。
        加密：若要加密信息,请在相应输入框中输入明文,并选择合适的公钥。点击加密按钮,系统将使用选定的公钥加密您的信息,并生成相应的密文。
        解密：若要解密信息,请在相应输入框中输入密文,并使用相应的私钥。点击解密按钮,系统将使用私钥来解密您的密文,并还原为明文。(--ai生成，测试文段，未修改--)</n-tab-pane
      >
      <n-tab-pane :name="UsingNavList[4].name" :tab="UsingNavList[4].tab">
      </n-tab-pane>
      <n-tab-pane :name="UsingNavList[5].name" :tab="UsingNavList[5].tab">
        
      </n-tab-pane>
      <n-tab-pane :name="UsingNavList[6].name" :tab="UsingNavList[6].tab">
        在每次操作后,请确保清除敏感信息,以免被他人获取。
        始终保持私钥的保密性,不要与他人共享。
        请妥善保存您的密钥对,并定期备份。(--ai生成，测试文段，未修改--)
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style scoped>
pre {
  display: inline-block;
  margin: 0;
  padding: 0;
}
p {
  font-size: 14px;
  line-height: 1.8em;
}
</style>