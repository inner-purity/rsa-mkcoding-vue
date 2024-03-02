<script setup>
import { computed, ref } from "vue";
import axios from "axios";
import { ElMessage, ElNotification } from "element-plus";
import { NCard, NModal, NTooltip, NInputNumber } from "naive-ui";
import { useRsaHistoryStore } from "../../stores/rsaHistory";
import { useTipsVisibleStore } from "../../stores/tipsVisible";
import { useIsTypecodingStore } from "../../stores/isTypeCoding";
import { useRsaUserInfoStore } from "../../stores/rsaUserInfo";
import handelScroll from "../../hooks/handleScroll";
const rsaHistoryStore = useRsaHistoryStore();
const rsaUserInfoStore = useRsaUserInfoStore();
/////////////////////////////////////////////////////////////////////////////////////
const useTipsVisible = useTipsVisibleStore();
const useIsTypecoding = useIsTypecodingStore();
/////////////////////////////////////////////////////////////////////////////////////
const cryptionFormShow = ref(true);
const cryptionType = ref("");
const cryptionTypeShow = computed(() => {
  if (cryptionType.value === "加密明文") return "加密";
  else if (cryptionType.value === "解密密文") return "解密";
  else if (cryptionType.value === "") return "";
});
const buttonCryptionType = computed(() => {
  if (cryptionType.value === "加密明文") return "开始加密";
  else if (cryptionType.value === "解密密文") return "开始解密";
  else if (cryptionType.value === "") return "请选择处理类型";
});
const cryptionForm = ref({
  protoNews: "",
  cryptionNews: "",
  publicKey: "",
  privateKey: "",
  privateKeyPassword: "",
  privateKeyPasswordNext: "",
});
/////////////////////////////////////////////////////////////////////////////////////
const reCryptionShow = ref(false);
const reCryptionHandle = () => {
  httpRequestSuccess.value = false;
  reCryptionShow.value = false;
  resultShow.value = false;
  cryptionFormShow.value = true;
  cryptionForm.value.protoNews = "";
  cryptionForm.value.cryptionNews = "";
  cryptionForm.value.publicKey = "";
  cryptionForm.value.privateKey = "";
  cryptionForm.value.privateKeyPassword = "";
  cryptionForm.value.privateKeyPasswordNext = "";
  resendEnCryptionTypeOn.value = "";
  resendDeCryptionTypeOn.value = "";
  cryptionPercentage.value = 0;
  httpCryptionLoding.value = true;
  cryptionLodingIcon.value = true;
  progressShow.value = true;
};
/////////////////////////////////////////////////////////////////////////////////////
const httpRequestSuccess = ref(false);
const cannotHandleMessage = () => {
  ElMessage({
    message: "请完整填写",
    grouping: true,
    center: true,
    type: "warning",
  });
};
const enCryptionSuccessMessage = () => {
  ElMessage({
    message: "加密完成!",
    grouping: true,
    center: true,
    type: "success",
  });
};
const deCryptionSuccessMessage = () => {
  ElMessage({
    message: "解密完成!",
    grouping: true,
    center: true,
    type: "success",
  });
};
const cryptionErrorMessage = () => {
  ElMessage({
    message: "出错了!  请输入正确的信息或检查网络后重试",
    grouping: true,
    center: true,
    type: "error",
  });
};
const resendCryptionNews = ref("");
const resendProtoNews = ref("");
const httpCryptionLoding = ref(true);
const handleCryption = () => {
  if (
    cryptionType.value === "" ||
    (cryptionType.value === "加密明文" &&
      (cryptionForm.value.protoNews === "" ||
        cryptionForm.value.publicKey === "")) ||
    (cryptionType.value === "解密密文" &&
      (cryptionForm.value.cryptionNews === "" ||
        cryptionForm.value.privateKey === ""))
  ) {
    cannotHandleMessage();
  } else {
    resultShow.value = true;
    cryptionFormShow.value = false;
    if (cryptionType.value === "加密明文") {
      axios
        .get("https://infinitypoint.top:2333/enCryption", {
          params: {
            param1: cryptionForm.value.protoNews,
            param2: cryptionForm.value.publicKey,
            opt: `${
              cryptionForm.value.privateKeyPassword === ""
                ? 0
                : cryptionForm.value.privateKeyPassword
            }`,
          },
        })
        .then((response) => {
          resendCryptionNews.value = response.data;
          copyInitcryption.value = resendCryptionNews.value;
          resendCryptionNews.value =
            "-------------------密文体 BEGIN-------------------\n" +
            resendCryptionNews.value +
            "\n-------------------密文体 END-------------------\n" +
            "(密文解密方法：加密后的密文使用与加密者持有的公钥相匹配的私钥解密可破译出原文。)";
          httpCryptionLoding.value = false;
          if (useIsTypecoding.TypeCodingOnOff) {
            encryptionTypeOnCoding().then(() => {
              enCryptionSuccessMessage();
              reCryptionShow.value = true;
              httpRequestSuccess.value = true;
              cryptionCountStorage();
            });
          } else {
            cryptionLodingIcon.value = false;
            progressShow.value = false;
            resendEnCryptionTypeOn.value = resendCryptionNews.value;
            enCryptionSuccessMessage();
            reCryptionShow.value = true;
            httpRequestSuccess.value = true;
            cryptionCountStorage();
          }
        })
        .catch(() => {
          cryptionErrorMessage();
          httpCryptionLoding.value = false;
          cryptionLodingIcon.value = false;
          reCryptionShow.value = true;
        });
    } else if (cryptionType.value === "解密密文") {
      axios
        .get("https://infinitypoint.top:2333/deCryption", {
          params: {
            param1: cryptionForm.value.cryptionNews,
            param2: cryptionForm.value.privateKey,
            opt: `${
              cryptionForm.value.privateKeyPasswordNext === ""
                ? 0
                : cryptionForm.value.privateKeyPasswordNext
            }`,
          },
        })
        .then((response) => {
          resendProtoNews.value = response.data;
          httpCryptionLoding.value = false;
          if (useIsTypecoding.TypeCodingOnOff) {
            decryptionTypeOnCoding().then(() => {
              deCryptionSuccessMessage();
              reCryptionShow.value = true;
              httpRequestSuccess.value = true;
              cryptionCountStorage();
            });
          } else {
            cryptionLodingIcon.value = false;
            progressShow.value = false;
            resendDeCryptionTypeOn.value = resendProtoNews.value;
            deCryptionSuccessMessage();
            reCryptionShow.value = true;
            httpRequestSuccess.value = true;
            cryptionCountStorage();
          }
        })
        .catch(() => {
          cryptionErrorMessage();
          httpCryptionLoding.value = false;
          cryptionLodingIcon.value = false;
          reCryptionShow.value = true;
        });
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////
const resultShow = ref(false);
const resultTitle = computed(() => {
  if (cryptionType.value === "加密明文") return "密文生成区";
  else if (cryptionType.value === "解密密文") return "明文生成区";
});
const resultLodingSpan = computed(() => {
  if (cryptionType.value === "加密明文") return "全力加密";
  else if (cryptionType.value === "解密密文") return "全力破译";
});
/////////////////////////////////////////////////////////////////////////////////////
const copyCryptionParam = computed(() => {
  if (cryptionType.value === "加密明文") return copyInitcryption.value;
  else if (cryptionType.value === "解密密文") return resendProtoNews.value;
});
const copyInitcryption = ref("");
const copyCryption = (text) => {
  var input = document.createElement("input"); // 创建input对象
  input.value = text; // 设置复制内容
  document.body.appendChild(input); // 添加临时实例
  input.select(); // 选择实例内容
  document.execCommand("Copy"); // 执行复制
  document.body.removeChild(input); // 删除临时实例
  copyRightMessage();
};
const copyRightMessage = () => {
  ElMessage({
    message: "已复制到剪切板",
    grouping: true,
    center: true,
    type: "success",
  });
};
const cryptionCopyTitle = ref(false);
/////////////////////////////////////////////////////////////////////////////////////
const cryptionPercentage = ref(0);
const customColors = [
  { color: "#f56c6c", percentage: 20 },
  { color: "#e6a23c", percentage: 85 },
  { color: "#41a057", percentage: 100 },
];
/////////////////////////////////////////////////////////////////////////////////////
const CharIndex = ref(0);
const cryptionLodingIcon = ref(true);
const resendEnCryptionTypeOn = ref("");
const resendDeCryptionTypeOn = ref("");
const progressShow = ref(true);
const DecideresendCryptionTypeOn = computed(() => {
  if (cryptionType.value === "加密明文") return resendEnCryptionTypeOn.value;
  else if (cryptionType.value === "解密密文")
    return resendDeCryptionTypeOn.value;
});
const encryptionTypeOnCoding = () => {
  return new Promise((res) => {
    {
      const Interval = setInterval(() => {
        if (CharIndex.value < resendCryptionNews.value.length) {
          resendEnCryptionTypeOn.value +=
            resendCryptionNews.value[CharIndex.value];
          cryptionPercentage.value = Math.ceil(
            (CharIndex.value / resendCryptionNews.value.length) * 100
          );
          CharIndex.value++;
        } else {
          clearInterval(Interval);
          CharIndex.value = 0;
          cryptionLodingIcon.value = false;
          progressShow.value = false;
          res();
        }
      }, 1);
    }
  });
};
const decryptionTypeOnCoding = () => {
  return new Promise((res) => {
    {
      const Interval = setInterval(() => {
        if (CharIndex.value < resendProtoNews.value.length) {
          resendDeCryptionTypeOn.value +=
            resendProtoNews.value[CharIndex.value];
          cryptionPercentage.value = Math.ceil(
            (CharIndex.value / resendProtoNews.value.length) * 100
          );
          CharIndex.value++;
        } else {
          clearInterval(Interval);
          CharIndex.value = 0;
          cryptionLodingIcon.value = false;
          progressShow.value = false;
          res();
        }
      }, 1);
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////////
const storageCount = ref();
const cryptionCountStorage = () => {
  if (localStorage.getItem("cryptionCountStorage") === null) {
    localStorage.setItem("cryptionCountStorage", "0");
  }
  storageCount.value = JSON.parse(localStorage.getItem("cryptionCountStorage"));
  storageCount.value++;
  localStorage.setItem(
    "cryptionCountStorage",
    JSON.stringify(storageCount.value)
  );
};
/////////////////////////////////////////////////////////////////////////////////////
const dowloadCryptionParam = computed(() => {
  if (cryptionType.value === "加密明文") return resendCryptionNews.value;
  else if (cryptionType.value === "解密密文") return resendProtoNews.value;
});
const dowloadCryptionTitleParam = computed(() => {
  if (cryptionType.value === "加密明文") return "加密明文";
  else if (cryptionType.value === "解密密文") return "解密密文";
});
const dateToStr = () => {
  let date = new Date();
  var year = date.getFullYear(); //年
  var month = date.getMonth(); //月
  var day = date.getDate(); //日
  return (
    year +
    "_" +
    (month + 1 > 9 ? month + 1 : "0" + (month + 1)) +
    "_" +
    (day > 9 ? day : "0" + day)
  );
};
const downLoadSuccessMessage = () => {
  ElMessage({
    message: "已添加至下载队列，请注意查看!",
    grouping: true,
    center: true,
    type: "success",
  });
};
const downloadCryptionHandle = () => {
  const blob = new Blob(
    [
      dowloadCryptionParam.value,
      "\n\n",
      `---以上字段的加解密类型: ${dowloadCryptionTitleParam.value} ---`,
      "\n\n\n",
      "--------------------------------------------------------------------------------",
      "\n",
      `***${dateToStr()} RSA-mkCoding 网 生成***`,
      "\n\n",
      "相关贡献者(GitHub用户名)：inner-purity, brokenstring314",
    ],
    { type: "text/plain" }
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${dowloadCryptionTitleParam.value + "_" + dateToStr()}.txt`;
  link.click();
  downLoadSuccessMessage();
};
/////////////////////////////////////////////////////////////////////////////////////
const upLoadSuccessMessage = () => {
  ElMessage({
    message: "文字提取完毕!",
    grouping: true,
    center: true,
    type: "success",
  });
};
const txtOnloadeButtonText_1 = computed(() => {
  if (cryptionType.value === "加密明文") return "点此上传 明文.txt 文件";
  else if (cryptionType.value === "解密密文") return "点此上传 密文.txt 文件";
});
const txtOnloadeButtonText_2 = computed(() => {
  if (cryptionType.value === "加密明文") return "点此上传 公钥.txt 文件";
  else if (cryptionType.value === "解密密文") return "点此上传 私钥.txt 文件";
});
const newsFileUploadHandle = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      if (cryptionType.value === "加密明文") {
        cryptionForm.value.protoNews = reader.result;
      } else if (cryptionType.value === "解密密文") {
        cryptionForm.value.cryptionNews = reader.result;
      }
    };
    reader.readAsText(file);
    upLoadSuccessMessage();
  }
};
const keyFileUploadHandle = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      if (cryptionType.value === "加密明文") {
        cryptionForm.value.publicKey = reader.result;
      } else if (cryptionType.value === "解密密文") {
        cryptionForm.value.privateKey = reader.result;
      }
    };
    reader.readAsText(file);
    upLoadSuccessMessage();
  }
};
/////////////////////////////////////////////////////////////////////////////////////
const handleInputSuccessMessage = () => {
  ElMessage({
    dangerouslyUseHTMLString: true,
    grouping: true,
    center: true,
    duration: 1000,
    message: "<i >已自动为您规范格式~</i>",
  });
};
const handleInput = (event, textTarget) => {
  let text = event;
  // console.log(event)
  // 去除开头的回车、空行、空格
  text = text.replace(/^(?:\r\n|\r|\n|\s)+/, "");

  // 去除结尾的回车、空行、空格
  text = text.replace(/(?:\r\n|\r|\n|\s)+$/, "");

  cryptionForm.value[textTarget] = text; // 更新输入框的值
  handleInputSuccessMessage();
  console.log("去掉回车空格");
};
/////////////////////////////////////////////////////////////////////////////////////
const cryptionQrcodeShow = ref(false);
const qrCodeSize = ref(350);
const qrCodeTitle = computed(() => {
  if (cryptionType.value === "加密明文") {
    return "密文";
  } else if (cryptionType.value === "解密密文") {
    return "明文";
  }
});
const CryptionQrcodeCanvasRef = ref(null);
const dowloadChange = async (refModel, string) => {
  const url = await refModel.toDataURL();
  const a = document.createElement("a");
  a.download = `${string}二维码.png`;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  downLoadSuccessMessage();
};
/////////////////////////////////////////////////////////////////////////////////////
const checkHistoryData = () => {
  if (rsaUserInfoStore.userLoginInfo.id != null) {
    rsaHistoryStore.drawerShow = true;
  } else {
    ElNotification.info({
      title: "登录获取储存权限",
      message: "为保证用户数据安全，存储功能登录后才能使用",
      offset: 50,
    });
  }
};
</script>

<template>
  <!-- ////////////////////////////////////////////////////////////////////////////// -->
  <el-form
    class="cryption-form"
    :model="cryptionForm"
    label-width="120px"
    size="default"
    status-icon
    v-show="cryptionFormShow"
  >
    <el-form-item label="处理类型">
      <el-select
        v-model="cryptionType"
        placeholder="--选择处理类型*(必选)--"
        size="large"
      >
        <el-option label="加密明文" value="加密明文" />
        <el-option label="解密密文" value="解密密文" />
      </el-select>
    </el-form-item>
    <el-form-item label="明文" v-show="cryptionTypeShow === '加密'">
      <el-input
        type="textarea"
        autosize
        resize="none"
        placeholder="输入要加密的字段"
        v-model="cryptionForm.protoNews"
        @input="handleInput($event, 'protoNews')"
        maxlength="510"
      />
      <!--  -->
      <label for="uploadBtn1">{{ txtOnloadeButtonText_1 }}</label>
      <input
        type="file"
        id="uploadBtn1"
        style="display: none"
        @change="newsFileUploadHandle"
        accept=".txt"
      />
      <!--  -->
    </el-form-item>

    <el-form-item label="公钥加密" v-show="cryptionTypeShow === '加密'">
      <el-input
        type="textarea"
        autosize
        resize="none"
        placeholder="输入加密该字段的公钥"
        v-model="cryptionForm.publicKey"
        @input="handleInput($event, 'publicKey')"
      />
      <!--  -->
      <label for="uploadBtn2">{{ txtOnloadeButtonText_2 }}</label>
      <input
        type="file"
        id="uploadBtn2"
        style="display: none"
        @change="keyFileUploadHandle"
        accept=".txt"
      />
      <!--  -->
    </el-form-item>

    <el-form-item label="额外密码" v-show="cryptionTypeShow === '加密'">
      <el-input
        v-model="cryptionForm.privateKeyPassword"
        type="password"
        placeholder="如果当初额外设置了密码，则输入，否则不必填写"
        show-password
        clearable
        autocomplete
        class="codeMaking-el-input-style"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        class="cryption-form-edit-button"
        color="#41a057"
        type="primary"
        v-show="cryptionTypeShow === '加密'"
        @click="checkHistoryData"
      >
        查看账户公钥/密码
      </el-button>

      <el-button
        color="#41a057"
        type="primary"
        class="cryption-form-edit-button"
        v-show="cryptionTypeShow === '加密'"
      >
        <span class="p-quikmake" @click="handelScroll('keyCodeMaking')">
          在线生成密钥
        </span>
      </el-button>
    </el-form-item>
    <el-form-item label="密文" v-show="cryptionTypeShow === '解密'">
      <el-input
        type="textarea"
        autosize
        resize="none"
        placeholder="输入要解密的字段"
        v-model="cryptionForm.cryptionNews"
        @input="handleInput($event, 'cryptionNews')"
      />
      <!--  -->
      <label for="uploadBtn3">{{ txtOnloadeButtonText_1 }}</label>
      <input
        type="file"
        id="uploadBtn3"
        style="display: none"
        @change="newsFileUploadHandle"
        accept=".txt"
      />
      <!--  -->
    </el-form-item>
    <el-form-item label="私钥解密" v-show="cryptionTypeShow === '解密'">
      <el-input
        type="textarea"
        autosize
        resize="none"
        placeholder="输入对应的解密私钥"
        v-model="cryptionForm.privateKey"
        @input="handleInput($event, 'privateKey')"
      />
      <!--  -->
      <label for="uploadBtn4">{{ txtOnloadeButtonText_2 }}</label>
      <input
        type="file"
        id="uploadBtn4"
        style="display: none"
        @change="keyFileUploadHandle"
        accept=".txt"
      />
      <!--  -->
    </el-form-item>
    <el-form-item label="额外密码" v-show="cryptionTypeShow === '解密'">
      <el-input
        v-model="cryptionForm.privateKeyPasswordNext"
        type="password"
        placeholder="如果当初额外设置了密码，则输入，否则不必填写"
        show-password
        clearable
        autocomplete
        class="codeMaking-el-input-style"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        class="cryption-form-edit-button"
        color="#41a057"
        type="primary"
        v-show="cryptionTypeShow === '解密'"
        @click="checkHistoryData"
      >
        查看账户私钥/密码
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        color="#41a057"
        type="primary"
        @click="handleCryption"
        size="large"
      >
        {{ buttonCryptionType }}
      </el-button>
    </el-form-item>
  </el-form>
  <!-- ////////////////////////////////////////////////////////////////////////////// -->
  <div v-show="resultShow">
    <div class="recryption-button-container" v-show="reCryptionShow">
      <button class="recryption-button" @click="reCryptionHandle">
        重新加密/解密
      </button>
      <button
        class="recryption-button"
        @click="downloadCryptionHandle"
        v-show="httpRequestSuccess"
      >
        下载&nbsp;&nbsp;.txt&nbsp;&nbsp;文件<el-icon
          size="16px"
          color="#fff"
          style="margin-left: 8px; vertical-align: text-bottom"
          ><Download
        /></el-icon>
      </button>
      <!-- ////////////////////////////////////////////////////////////////////////////// -->
      <n-tooltip trigger="hover">
        <template #trigger>
          <el-button
            v-show="httpRequestSuccess"
            @click="cryptionQrcodeShow = true"
            class="recryption-button"
          >
            查看{{ qrCodeTitle }}二维码<el-icon
              size="16px"
              color="#fff"
              style="margin-left: 8px; vertical-align: text-bottom"
              ><Grid
            /></el-icon>
          </el-button> </template
        >点此查看对应二维码，手机扫码立即获取！
      </n-tooltip>
      <!-- ////////////////////////////////////////////////////////////////////////////// -->
    </div>
    <h3 class="keyCode-h3">
      {{ resultTitle
      }}<el-icon
        color="#41a057"
        size="20px"
        style="margin-left: 10px"
        class="is-loading"
        v-show="cryptionLodingIcon"
        ><Loading
      /></el-icon>
      <el-icon
        color="#41a057"
        size="20px"
        style="margin-left: 10px; cursor: pointer"
        title="复制代码"
        @mouseenter="cryptionCopyTitle = true"
        @mouseleave="cryptionCopyTitle = false"
        @click="copyCryption(copyCryptionParam)"
        ><DocumentCopy
      /></el-icon>
      <span class="keyCodeLoadingTitle" v-show="cryptionLodingIcon"
        >正在{{ resultLodingSpan }},请稍等......</span
      >
      <span class="copy-title" v-show="cryptionCopyTitle">复制文本</span>
    </h3>
    <el-progress
      :percentage="cryptionPercentage"
      :color="customColors"
      class="codeMaking-el-progress-style"
      v-show="progressShow"
    />
    <el-input
      v-loading="httpCryptionLoding"
      v-model="DecideresendCryptionTypeOn"
      autosize
      readonly
      type="textarea"
      resize="none"
      class="codeMaking-el-txt-style"
      placeholder="试试重新生成，输入正确信息!"
    />
    <!-- ////////////////////////////////////////////////////////////////////////////// -->
    <n-modal v-model:show="cryptionQrcodeShow">
      <n-card
        style="width: 75%"
        title="加密/解密 二维码"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <p>
          <span style="font-style: italic"
            >团队分发字段，复制黏贴传递太累？电脑生成字段，复制到手机太麻烦？一键扫码立得源字段!</span
          ><br /><br />
          <strong>移动端扫码方法:</strong><br /><br />
          1.<strong>微信</strong>：打开手机微信，点击扫一扫，扫码识别，全选复制源码。<span
            style="color: red"
            >(若结果提示文字无法显示请尝试浏览器扫码，QQ扫码无效)</span
          ><br /><br />
          2.<strong>浏览器</strong>(推荐):以<strong>百度</strong>为例，打开百度浏览器，点击首页输入框旁
          <el-icon size="16px" color="#aaa" style="vertical-align: text-bottom"
            ><CameraFilled /></el-icon
          >&nbsp;图标，选择扫码。扫描即可提取并复制密钥源码，方便快捷。<br /><span
            style="color: red"
            >(注意有些浏览器可能不支持扫码获取文字！推荐使用百度浏览器或手机内置浏览器)</span
          >
        </p>
        <p style="color: #41a057">
          以下是这次{{
            cryptionType
          }}对应的二维码。打开手机扫码直接获取源字段，更加便捷！<span
            style="font-style: italic"
            >(滑动下拉，底部可调节二维码尺寸~)</span
          >
        </p>
        <div class="CryptionQrcode">
          <h3 style="display: inline-block">{{ qrCodeTitle }}二维码：</h3>
          <a-button
            type="primary"
            @click="dowloadChange(CryptionQrcodeCanvasRef, qrCodeTitle)"
            style="margin-top: 15px"
            >下载{{ qrCodeTitle }}二维码</a-button
          >
          <a-qrcode
            ref="CryptionQrcodeCanvasRef"
            :value="DecideresendCryptionTypeOn"
            :size="qrCodeSize"
            status="active"
          />
        </div>
        <div>
          <span>输入数值可调整二维码尺寸:</span>
          <n-input-number
            v-model:value="qrCodeSize"
            size="medium"
            style="width: 20%"
            placeholder="建议尺寸  300~450"
            min="200"
            max="600"
          />
        </div>
      </n-card>
    </n-modal>
    <!-- ////////////////////////////////////////////////////////////////////////////// -->
  </div>
  <!-- ////////////////////////////////////////////////////////////////////////////// -->
  <div
    class="animate__animated animate__fadeInLeft animate__faster GuideStyle"
    v-show="useTipsVisible.tipsShow"
  >
    <h3>
      <div class="title-column column-codingmake"></div>
      Tips指引:
    </h3>
    <el-collapse v-model="codingMakeGuideActiveName" accordion>
      <el-collapse-item title="Consistency" name="1">
        <div></div>
        <div></div>
      </el-collapse-item>
      <el-collapse-item title="Feedback" name="2">
        <div></div>
        <div></div>
      </el-collapse-item>
      <el-collapse-item title="Efficiency" name="3">
        <div></div>
        <div></div>
        <div></div>
      </el-collapse-item>
      <el-collapse-item title="Controllability" name="4">
        <div></div>
        <div></div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <!-- ////////////////////////////////////////////////////////////////////////////// -->
</template>

<style scoped>
:deep().el-input {
  --el-input-focus-border: #41a057;
  --el-input-border-color: #41a057;
  --el-input-focus-border-color: #41a057;
  --el-menu-active-color: #aaa !important;
  --el-menu-hover-text-color: #aaa !important;
  --el-color-primary: #41a057 !important;
}
:deep().el-select {
  --el-select-input-focus-border-color: #41a057;
  --el-menu-active-color: #aaa !important;
  --el-menu-hover-text-color: #aaa !important;
  --el-color-primary: #41a057 !important;
}
:deep().el-textarea {
  --el-input-focus-border: #41a057;
  --el-input-border-color: #41a057;
  --el-input-focus-border-color: #41a057;
  --el-menu-active-color: #aaa !important;
  --el-menu-hover-text-color: #aaa !important;
  --el-color-primary: #41a057 !important;
}

label {
  vertical-align: center;
  cursor: pointer;
  text-align: center;
}
label:hover {
  color: #41a057;
  text-decoration: underline;
}
.cryption-form {
  margin: 0 auto;
  width: 70%;
}
.cryption-form-edit-button {
  margin-top: 20px;
  margin-right: 20px;
}
.p-quikmake {
  display: inline-block;
  height: 100%;
  line-height: 48px;
  color: #fff;
  font-size: 14px;
}
.keyCode-h3 {
  position: relative;
  overflow: hidden;
  margin-left: 30%;
  margin-top: 20px;
}
.copy-title {
  position: absolute;
  width: 60px;
  height: 20px;
  background-color: #0a0a0a;
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
  margin-left: 10px;
  margin-top: 5px;
  border-radius: 5px;
}
.keyCodeLoadingTitle {
  font-size: 12px;
  font-weight: normal;
  display: inline-block;
  margin-left: 20px;
  color: #aaa;
}
.codeMaking-el-progress-style {
  width: 35%;
  top: 10px;
  margin: 0 auto;
  text-align: center;
}
.codeMaking-el-txt-style {
  left: 30%;
  top: 20px;
  width: 40%;
  margin: 0 auto;
  text-align: center;
}
.recryption-button-container {
  display: flex;
  justify-content: center;
}
.recryption-button {
  color: #fff;
  font-size: 14px;
  text-align: center;
  margin: 0 20px 20px 20px;
  width: 125px;
  height: 35px;
  background-color: #41a057;
  border: none;
  border-radius: 5px;
}
.recryption-button:hover {
  cursor: pointer;
  background-color: rgb(122, 189, 137);
}

.GuideStyle {
  overflow: hidden;
  border: 1px solid #aaa;
  border-radius: 6px;
  width: 50%;
  text-align: center;
  margin: 60px auto 0;
  padding: 10px;
}
.GuideStyle h3 {
  text-align: left;
}
.title-column {
  display: inline-block;
  height: 16px;
  width: 3px;
  font-size: 16px;
  font-weight: 900;
  text-align: center;
  line-height: 16px;
  margin: auto 10px;
  margin-top: 1em;
}
.column-codingmake {
  background-color: #41a057;
}

.CryptionQrcode {
  margin: 20px auto;
}
</style>