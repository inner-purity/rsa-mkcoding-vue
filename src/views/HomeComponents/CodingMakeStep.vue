<script setup>
import { computed, ref } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { useTipsVisibleStore } from "../../stores/tipsVisible";
import { useIsTypecodingStore } from "../../stores/isTypeCoding";
import {
  NCard,
  NModal,
  NTooltip,
  NInputNumber,
  NButton,
  NSkeleton,
} from "naive-ui";
////////////////////////////////////////////////////////////////////////////////////////////
import axios from "axios";
import instance from "../../axios/axios";
////////////////////////////////////////////////////////////////////////////////////////////
import responseDataMessage from "../../hooks/reponseDataMessage";
////////////////////////////////////////////////////////////////
const useTipsVisible = useTipsVisibleStore();
const useIsTypecoding = useIsTypecodingStore();
////////////////////////////////////////////////////////////////
const active = ref(0);
const nextButtonFlag = ref(true);
const fowardButtonFlag = ref(true);
const remakeFlag = ref(false);
const canRestart = ref(false);
const noKeyFormMessage = () => {
  ElMessage({
    message: "请选择密钥类型！",
    grouping: true,
    center: true,
    type: "warning",
  });
};
const noKeyForceMessage = () => {
  ElMessage({
    message: "请选择密钥强度!",
    grouping: true,
    center: true,
    type: "warning",
  });
};
const failRestartMessage = () => {
  ElMessage({
    message: "请稍候...",
    grouping: true,
    center: true,
    type: "warning",
  });
};
const next = () => {
  if (active.value === 0 && keyFormCheck.value === false) {
    noKeyFormMessage();
    return;
  } else if (active.value === 1 && keyForceCheck.value === false) {
    noKeyForceMessage();
    return;
  } else {
    {
      if (active.value === 0) {
        active.value++;
        return;
      }
      if (active.value === 1) {
        active.value++;
        return;
      }
      if (active.value === 2) {
        active.value = 4;
      }
      if (active.value >= 3) {
        httpRequestKeyCode();
        nextButtonFlag.value = false;
        fowardButtonFlag.value = false;
      }
    }
  }
};
const foward = () => {
  if (active.value-- === 0) active.value = 0;
};
const remake = () => {
  keyForm.value.form = null;
  keyForceData.value.data = undefined;
  privateKeyPassword.value = "";
  publicKeyCode.value = "";
  privateKeyCode.value = "";
  active.value = 0;
  nextButtonFlag.value = true;
  fowardButtonFlag.value = true;
  remakeFlag.value = false;
  publicKeyCodeLoding.value = true;
  privateKeyCodeLoding.value = true;
  publicLodingIcon.value = true;
  privateLodingIcon.value = true;
  canRestart.value = false;
  publicPercentage.value = 0;
  privatePercentage.value = 0;
  privatePercentageShow.value = true;
  publicPercentageShow.value = true;
  canStorageFlag.value = true;
  showQrCodeContent.value = 0;
};
const restart = () => {
  publicKeyCodeLoding.value = true;
  privateKeyCodeLoding.value = true;
  if (active.value === 4 && canRestart.value === true) {
    publicKeyCode.value = "";
    privateKeyCode.value = "";
    httpRequestKeyCode();
    canRestart.value = false;
  } else {
    failRestartMessage();
  }
};
const nextBtnTitle = computed(() => {
  if (active.value < 2) return "下一步";
  else return "生成密钥";
});
////////////////////////////////////////////////////////////////
const keyForm = ref({
  form: null,
});
const keyForceData = ref({
  data: undefined,
});
const privateKeyPassword = ref("");

const keyFormCheck = computed(() => {
  if (keyForm.value.form === null) return false;
  else return true;
});
const keyForceCheck = computed(() => {
  if (keyForceData.value.data === undefined) return false;
  else return true;
});
////////////////////////////////////////////////////////////////
const storageCount = ref();
const axiosRequestCountStorage = () => {
  if (localStorage.getItem("axiosRequestCountStorage") === null) {
    localStorage.setItem("axiosRequestCountStorage", "0");
  }
  storageCount.value = JSON.parse(
    localStorage.getItem("axiosRequestCountStorage")
  );
  storageCount.value++;
  localStorage.setItem(
    "axiosRequestCountStorage",
    JSON.stringify(storageCount.value)
  );
};
////////////////////////////////////////////////////////////////
const publicKeyCode = ref("");
const publicKeyCodeLoding = ref(true);
const publicLodingIcon = ref(true);
const privateKeyCode = ref("");
const privateKeyCodeLoding = ref(true);
const privateLodingIcon = ref(true);

const KeyErrorMessage = (error) => {
  ElMessage({
    message: "密钥生成失败" + "   " + error,
    grouping: true,
    center: true,
    type: "warning",
  });
};
const KeyAbortMessage = (error) => {
  ElMessage({
    message: "请求取消" + "   " + error,
    grouping: true,
    center: true,
    type: "message",
  });
};
const KeySuccessMessage = () => {
  ElMessage({
    message: "密钥生成完毕!",
    grouping: true,
    center: true,
    type: "success",
  });
};

const cancelToken = ref(null);
const httpRequestKeyCode = async () => {
  try {
    // 取消上一次请求
    if (cancelToken.value) {
      cancelToken.value.cancel();
    }
    cancelToken.value = axios.CancelToken.source();
    var options = null;
    if (keyForm.value.form === "RSA" && keyForceData.value.data === "512")
      options = "fiveRsa";
    if (keyForm.value.form === "RSA" && keyForceData.value.data === "1024")
      options = "oneRsa";
    if (keyForm.value.form === "RSA" && keyForceData.value.data === "2048")
      options = "twoRsa";
    // console.log(options);
    await axios
      .get(
        `https://infinitypoint.top:2333/${options}` +
          `?mima=${
            privateKeyPassword.value === "" ? "0" : privateKeyPassword.value
          }`,
        {
          cancelToken: cancelToken.token,
        }
      )
      .then((response) => {
        publicKeyCodeLoding.value = false;
        privateKeyCodeLoding.value = false;
        publicKeyCodeResponse.value = response.data.PublicKey;
        publicInitKeyCopy.value = publicKeyCodeResponse.value;
        publicKeyCodeResponse.value =
          "-------------------公钥体 BEGIN-------------------\n" +
          publicKeyCodeResponse.value +
          "\n-------------------公钥体 END-------------------\n" +
          "(公钥使用方法：在加密信息时，提供原文和公钥，可生成加密密文。加密后的密文用配套私钥解密可获得原文。)";
        privateKeyCodeResponse.value = response.data.PrivateKey;
        privateInitKeyCopy.value = privateKeyCodeResponse.value;
        privateKeyCodeResponse.value =
          "-------------------私钥体 BEGIN-------------------\n" +
          privateKeyCodeResponse.value +
          "\n-------------------私钥体 END-------------------\n" +
          "(私钥使用方法：在解密信息时，提供加密过的密文，通过输入与加密者持有的公钥相匹配的私钥，可破译密文生成原文。)";
      });

    if (useIsTypecoding.TypeCodingOnOff) {
      const publicPromise = publicTypeOnCoding();
      const privatePromise = privateTypeOnCoding();
      Promise.all([publicPromise, privatePromise]).then(() => {
        KeySuccessMessage();
        axiosRequestCountStorage();
        publicCharIndex.value = 0;
        privateCharIndex.value = 0;
        remakeFlag.value = true;
      });
    } else {
      publicKeyCode.value = publicKeyCodeResponse.value;
      privateKeyCode.value = privateKeyCodeResponse.value;
      KeySuccessMessage();
      axiosRequestCountStorage();
      publicLodingIcon.value = false;
      publicPercentageShow.value = false;
      privateLodingIcon.value = false;
      privatePercentageShow.value = false;
      remakeFlag.value = true;
    }
  } catch (error) {
    publicKeyCodeLoding.value = false;
    privateKeyCodeLoding.value = false;
    publicLodingIcon.value = false;
    privateLodingIcon.value = false;
    canRestart.value = true;
    remakeFlag.value = true;
    if (axios.isCancel(error)) {
      // 上一次请求被取消了
      KeyAbortMessage(error);
    } else {
      // 其他错误处理
      KeyErrorMessage(error);
    }
  }
};
////////////////////////////////////////////////////////////////
const publicCharIndex = ref(0);
const publicKeyCodeResponse = ref("");
const publicIntervalSpeed = ref(1);
const publicTypeOnCoding = () => {
  return new Promise((res) => {
    {
      const publicInterval = setInterval(() => {
        if (publicCharIndex.value < publicKeyCodeResponse.value.length) {
          publicKeyCode.value +=
            publicKeyCodeResponse.value[publicCharIndex.value];
          publicCharIndex.value++;
          publicPercentage.value = Math.ceil(
            (publicCharIndex.value / publicKeyCodeResponse.value.length) * 100
          );
        } else {
          clearInterval(publicInterval);
          publicLodingIcon.value = false;
          publicPercentageShow.value = false;
          res();
        }
      }, publicIntervalSpeed);
    }
  });
};
////////////////////////////////////////////////////////////////
const privateCharIndex = ref(0);
const privateKeyCodeResponse = ref("");
const privateIntervalSpeed = ref(1);
const privateTypeOnCoding = () => {
  return new Promise((res) => {
    const privateInterval = setInterval(() => {
      if (privateCharIndex.value < privateKeyCodeResponse.value.length) {
        privateKeyCode.value +=
          privateKeyCodeResponse.value[privateCharIndex.value];
        privateCharIndex.value++;
        privatePercentage.value = Math.ceil(
          (privateCharIndex.value / privateKeyCodeResponse.value.length) * 100
        );
      } else {
        clearInterval(privateInterval);
        privateLodingIcon.value = false;
        privatePercentageShow.value = false;
        res();
      }
    }, privateIntervalSpeed);
  });
};
////////////////////////////////////////////////////////////////
const publicPercentage = ref();
const privatePercentage = ref();
const publicPercentageShow = ref(true);
const privatePercentageShow = ref(true);
const customColors = [
  { color: "#f56c6c", percentage: 20 },
  { color: "#e6a23c", percentage: 85 },
  { color: "rgb(82, 89, 195)", percentage: 100 },
];
////////////////////////////////////////////////////////////////
const publicCopyTitle = ref(false);
const privateCopyTitle = ref(false);
const publicInitKeyCopy = ref("");
const privateInitKeyCopy = ref("");
const copyCode = (text) => {
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
////////////////////////////////////////////////////////////////
const canStorageFlag = ref(true);
const historyStorageTableShow = ref(false);
const cannotStorageMessage = () => {
  ElMessage({
    message: "已保存成功,请勿重复操作!",
    grouping: true,
    center: true,
    type: "warning",
  });
}
const storageSettingForm = ref({
  isUserPrivatePasswordStore: "false",
});
const storageSettingFormList = ref([]);
const storageButtonHandle = () => {
  if (canStorageFlag.value === false) {
    cannotStorageMessage();
  } else {
    historyStorageTableShow.value = true;
    axiosStorageSettingForm.value.storeTime = dateToStr();
    axiosStorageSettingForm.value.keyType = keyForm.value.form;
    axiosStorageSettingForm.value.keyForce = keyForceData.value.data;
    axiosStorageSettingForm.value.privateKey = privateInitKeyCopy.value;
    axiosStorageSettingForm.value.publicKey = publicInitKeyCopy.value;
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const axiosStorageSettingForm = ref({
  id: null,
  userId: null,
  storeTime: "",
  keyType: "",
  keyForce: "",
  note: "",
  privateKey: "",
  publicKey: "",
  privatePassword: "",
});
const historyStorageHandle = () => {
  if (storageSettingForm.value.isUserPrivatePasswordStore === true) {
    axiosStorageSettingForm.value.privatePassword = privateKeyPassword.value;
  }
  try {
    const formData1 = new FormData();
    formData1.append("text", axiosStorageSettingForm.value.privateKey);
    instance
      .post("/users/common/uploadText", formData1, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const responseData = res.data;
        if (responseData.code === 0) {
          Promise.reject();
        }
        axiosStorageSettingForm.value.privateKey = responseData.data;

        const formData2 = new FormData();
        formData2.append("text", axiosStorageSettingForm.value.publicKey);
        instance
          .post("/users/common/uploadText", formData2, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            const responseData = res.data;
            if (responseData.code === 0) {
              Promise.reject();
            }
            axiosStorageSettingForm.value.publicKey = responseData.data;

            axiosStorageSettingForm.value.storeTime = "";
            instance
              .post("/users/rsaKey/upload", axiosStorageSettingForm.value)
              .then((res) => {
                const responseData = res.data;
                responseDataMessage(
                  responseData,
                  "点击'查看账户数据'查看已保存的数据记录"
                );
                if (responseData.code === 1) {
                  canStorageFlag.value = false;
                  historyStorageTableShow.value = false;
                }
              });
          });
      });
  } catch (error) {
    console.log(error);
    ElNotification({
      title: `${error.message}`,
      type: "error",
    });
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//日期转字符串格式
const dateToStr = () => {
  let date = new Date();
  var year = date.getFullYear(); //年
  var month = date.getMonth(); //月
  var day = date.getDate(); //日
  return (
    year +
    "-" +
    (month + 1 > 9 ? month + 1 : "0" + (month + 1)) +
    "-" +
    (day > 9 ? day : "0" + day)
  );
};
////////////////////////////////////////////////////////////////
const downLoadSuccessMessage = () => {
  ElMessage({
    message: "已添加至下载队列，请注意查看!",
    grouping: true,
    center: true,
    type: "success",
  });
};
const downloadKeyCodeHandle = () => {
  const blob = new Blob(
    [
      "--以下是 公钥 --：",
      "\n\n",
      publicKeyCodeResponse.value,
      "\n\n\n\n",
      "--以下是 私钥 --：",
      "\n\n",
      privateKeyCodeResponse.value,
      "\n\n\n",
      "--------------------------------------------------------------------------------",
      "\n",
      `***${dateToStr()} RSA-mkCoding 网 生成***`,
      "\n\n",
      "相关贡献者(GitHub用户名)：inner-purity, brokenstring314",
    ],
    {
      type: "text/plain",
    }
  );
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${"公私钥生成-" + dateToStr()}.txt`;
  link.click();
  downLoadSuccessMessage();
};
////////////////////////////////////////////////////////////////
const codingMakeGuideActiveName = ref("1");
////////////////////////////////////////////////////////////////
const qrcodeShow = ref(false);
const qrcodeCanvasRef = ref(null);
const qrCodeSize = ref(250);
const dowloadChange = async (refModel, string) => {
  const url = await refModel.toDataURL();
  const a = document.createElement("a");
  a.download = `${string}二维码(${keyForm.value.form}_${keyForceData.value.data}).png`;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  downLoadSuccessMessage();
};
////////////////////////////////////////////////////////////////
const qrCodeParams = ref({
  keyType: null,
  keyForce: null,
  publicKey: null,
  privateKey: null,
  password: null,
});
const qrCodeOptions = ref({
  publicKey: false,
  privateKey: false,
  password: false,
});
const qrCodeValue = ref("");
const currentUnicode = ref("");
const showQrCodeContent = ref(0);
const qrCodeStatus = ref("loading");
const cangetQrCode = ref(true);
const getQrCode = () => {
  if (cangetQrCode.value === true) {
    if (
      qrCodeOptions.value.password === false &&
      qrCodeOptions.value.privateKey === false &&
      qrCodeOptions.value.publicKey === false
    ) {
      ElNotification({
        title: "请选择至少一项要携带的数据",
        type: "info",
      });
    } else {
      qrCodeParams.value.publicKey = null;
      qrCodeParams.value.privateKey = null;
      qrCodeParams.value.password = null;
      cangetQrCode.value = false;
      showQrCodeContent.value = 1;
      qrCodeStatus.value = "loading";
      if (qrCodeOptions.value.publicKey === true) {
        qrCodeParams.value.publicKey = publicInitKeyCopy.value;
      }
      if (qrCodeOptions.value.privateKey === true) {
        qrCodeParams.value.privateKey = privateInitKeyCopy.value;
      }
      if (qrCodeOptions.value.password === true) {
        qrCodeParams.value.password = privateKeyPassword.value;
      }
      qrCodeParams.value.keyType = keyForm.value.form;
      qrCodeParams.value.keyForce = keyForceData.value.data;
      setTimeout(() => {
        instance
          .post("/users/common/getUnicode", qrCodeParams.value)
          .then(
            (res) => {
              const responseData = res.data;
              currentUnicode.value = responseData.data;
              qrCodeValue.value =
                "http://localhost:2599/users/common/getQrData/" +
                currentUnicode.value;
                //此处前缀为本地地址，但app端会截取后半部分有效接口路径，并拼接成真实服务器端接口路径。
              qrCodeStatus.value = "active";
              cangetQrCode.value = true;
            },
            (rej) => {
              console.log(rej);
              cangetQrCode.value = true;
            }
          )
          .catch((error) => {
            console.log(error);
            cangetQrCode.value = true;
            ElNotification({
              title: `${error.message}`,
              type: "error",
            });
          });
      }, 650);
    }
  }
};
////////////////////////////////////////////////////////////////
</script>

<template>
  <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
  <el-dialog
    v-model="historyStorageTableShow"
    title="储存设置"
    draggable="true"
    center="true"
    width="400px"
    :show-close="false"
  >
    <el-form
      :model="axiosStorageSettingForm"
      :label-position="left"
      size="default"
      label-width="auto"
    >
      <el-form-item label="生成时间"
        ><input
          class="el-from-item-input"
          type="text"
          v-model="axiosStorageSettingForm.storeTime"
          disabled
      /></el-form-item>
      <el-form-item label="密钥类型"
        ><input
          type="text"
          class="el-from-item-input"
          v-model="axiosStorageSettingForm.keyType"
          disabled
      /></el-form-item>
      <el-form-item label="密钥强度"
        ><input
          type="text"
          class="el-from-item-input"
          v-model="axiosStorageSettingForm.keyForce"
          disabled
      /></el-form-item>
      <el-form-item label="是否记录密钥密码">
        <el-switch
          v-model="storageSettingForm.isUserPrivatePasswordStore"
          style="
            --el-switch-on-color: rgb(82, 89, 195);
            --el-switch-off-color: #ff4949;
          "
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="axiosStorageSettingForm.note"
          autosize
          resize="none"
          type="textarea"
          style="width: 60%"
          maxlength="80"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="storage-dialog-footer">
        <el-button @click="historyStorageTableShow = false">取消保存</el-button>
        <el-button type="primary" @click="historyStorageHandle">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->

  <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
  <el-steps
    :active="active"
    finish-status="success"
    align-center="true"
    space="800px"
  >
    <el-step title="选择密钥类型" description="(*必选)" />
    <el-step title="选择密钥强度" description="(*必选，影响密码生成)" />
    <el-step title="私钥密码" description="(可选，相当于提供额外防护)" />
    <el-step title="生成密钥" description="生成您的专属密钥!" />
  </el-steps>
  <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
  <el-select
    v-model="keyForm.form"
    placeholder="--请选择密钥类型--"
    class="codeMaking-el-select-style"
    v-show="active === 0"
  >
    <el-option label="RSA" value="RSA" />
  </el-select>
  <el-select
    v-model="keyForceData.data"
    placeholder="--请选择密钥强度--"
    class="codeMaking-el-select-style"
    v-show="active === 1 && keyForm.form !== ''"
  >
    <el-option label="512(3-10s生成)" value="512" />
    <el-option label="1024(6-15s生成)" value="1024" />
    <el-option label="2048(高强)*(30s-5min生成)" value="2048" />
  </el-select>

  <el-input
    v-model="privateKeyPassword"
    type="password"
    placeholder="如有需要,输入私钥密码,额外加密"
    show-password
    clearable
    autocomplete
    class="codeMaking-el-input-style"
    v-show="active === 2"
  />
  <div class="codeMaking-el-button-container">
    <el-button
      color="#626aef"
      @click="foward"
      size="default"
      v-show="fowardButtonFlag"
      class="codeMaking-el-button-style"
    >
      上一步
    </el-button>
    <el-button
      color="#626aef"
      @click="
        () => {
          next();
        }
      "
      size="default"
      v-show="nextButtonFlag"
      class="codeMaking-el-button-style"
    >
      {{ nextBtnTitle }}
    </el-button>

    <el-button
      color="#626aef"
      size="default"
      v-show="remakeFlag"
      @click="remake"
      class="codeMaking-el-button-style"
    >
      重新生成密钥
    </el-button>
    <el-button
      color="#626aef"
      size="default"
      v-show="canRestart"
      @click="restart"
      class="codeMaking-el-button-style"
    >
      出错了？重新试试~
    </el-button>
    <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
    <el-button
      color="#626aef"
      size="default"
      v-show="remakeFlag && !canRestart"
      @click="storageButtonHandle"
      class="codeMaking-el-button-style"
    >
      保存记录<el-icon
        size="16px"
        color="#fff"
        style="margin-left: 8px; vertical-align: text-bottom"
        ><Box
      /></el-icon>
    </el-button>
    <el-button
      color="#626aef"
      size="default"
      v-show="remakeFlag && !canRestart"
      @click="downloadKeyCodeHandle"
      class="codeMaking-el-button-style"
    >
      下载为&nbsp;&nbsp;.txt&nbsp;&nbsp;文件<el-icon
        size="16px"
        color="#fff"
        style="margin-left: 8px; vertical-align: text-bottom"
        ><Download
      /></el-icon>
    </el-button>

    <n-tooltip trigger="hover">
      <template #trigger>
        <el-button
          color="#626aef"
          size="default"
          v-show="remakeFlag && !canRestart"
          @click="qrcodeShow = true"
          class="codeMaking-el-button-style"
        >
          生成密钥二维码<el-icon
            size="16px"
            color="#fff"
            style="margin-left: 8px; vertical-align: text-bottom"
            ><Grid
          /></el-icon>
        </el-button>
      </template>
      APP扫码快传密钥!
    </n-tooltip>
  </div>

  <h3 class="keyCode-h3" v-show="active === 4">
    公钥/非PEM格式<el-icon
      color="#626aef"
      size="20px"
      style="margin-left: 10px"
      class="is-loading"
      v-show="publicLodingIcon"
      ><Loading
    /></el-icon>
    <el-icon
      color="#626aef"
      size="20px"
      style="margin-left: 10px; cursor: pointer"
      title="复制代码"
      @mouseenter="publicCopyTitle = true"
      @mouseleave="publicCopyTitle = false"
      @click="copyCode(publicInitKeyCopy)"
      ><DocumentCopy
    /></el-icon>
    <span class="keyCodeLoadingTitle" v-show="publicLodingIcon"
      >正在全力加载中...(时间可能略长)</span
    >
    <span class="copy-title" v-show="publicCopyTitle">复制公钥</span>
  </h3>
  <el-progress
    :percentage="publicPercentage"
    :color="customColors"
    class="codeMaking-el-progress-style"
    v-show="active === 4 && publicPercentageShow"
  />
  <el-input
    v-loading="publicKeyCodeLoding"
    v-model="publicKeyCode"
    autosize
    readonly
    resize="none"
    type="textarea"
    class="codeMaking-el-txt-style"
    placeholder="生成中...长时间无反应请重新生成!"
    v-show="active === 4"
  />
  <div class="codeMaking-hr-div"></div>
  <h3 class="keyCode-h3" v-show="active === 4">
    私钥/非PEM格式<el-icon
      color="#626aef"
      size="20px"
      style="margin-left: 10px"
      class="is-loading"
      v-show="privateLodingIcon"
      ><Loading
    /></el-icon>
    <el-icon
      color="#626aef"
      size="20px"
      style="margin-left: 10px; cursor: pointer"
      title="复制代码"
      @mouseenter="privateCopyTitle = true"
      @mouseleave="privateCopyTitle = false"
      @click="copyCode(privateInitKeyCopy)"
      ><DocumentCopy
    /></el-icon>
    <span class="keyCodeLoadingTitle" v-show="privateLodingIcon"
      >正在全力加载中...(时间可能略长)</span
    >
    <span class="copy-title" v-show="privateCopyTitle">复制私钥</span>
  </h3>
  <el-progress
    :percentage="privatePercentage"
    :color="customColors"
    class="codeMaking-el-progress-style"
    v-show="active === 4 && privatePercentageShow"
  />
  <el-input
    v-loading="privateKeyCodeLoding"
    v-model="privateKeyCode"
    autosize
    readonly
    type="textarea"
    resize="none"
    class="codeMaking-el-txt-style"
    placeholder="生成中...长时间无反应请重新生成!"
    v-show="active === 4"
  />
  <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
  <n-modal v-model:show="qrcodeShow">
    <n-card
      style="width: 55%"
      title="密钥 二维码"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <strong>请选择二维码携带的数据:</strong><br /><br />
      <el-checkbox
        v-model="qrCodeOptions.publicKey"
        label="携带公钥"
        size="large"
        border
      />
      <el-checkbox
        v-model="qrCodeOptions.privateKey"
        label="携带私钥"
        size="large"
        border
      />
      <el-checkbox
        v-model="qrCodeOptions.password"
        label="携带额外密码"
        size="large"
        border
      />
      <br />
      <span
        style="color: red; margin: 8px 0 0; display: inline-block; height: 20px"
        >*注意：请按需选择指定部分数据进行快传，避免密钥数据泄露。</span
      >
      <br /><br />
      <n-button type="info" ghost @click="getQrCode">
        生成/刷新 快传二维码
      </n-button>
      <br /><br />
      <div class="qrCode-content" v-if="showQrCodeContent === 1">
        <p>
          <strong>移动端扫码步骤:</strong><br /><br />
          1.打开&nbsp;<strong>KMCoding&nbsp;APP</strong>
          点击首页“<strong>生成密钥</strong>”模块<br /><br />
          2.点击 "<strong>扫码快捷导入密钥</strong>" 按钮，扫码快传!
          <span
            style="
              color: red;
              margin: 8px 0 0;
              display: inline-block;
              height: 20px;
            "
            >*提示：当前二维码云端存储5分钟，任何更新二维码的操作或重新生成密钥二维码，都会导致上一次二维码失效，只保留最后一次记录。即用即取！</span
          >
        </p>
        <h3 style="display: inline-block">快传二维码：</h3>
        <a-button
          type="primary"
          @click="dowloadChange(qrcodeCanvasRef, '快传')"
          style="margin-top: 15px"
          >下载二维码.png</a-button
        >
        <a-qrcode
          ref="qrcodeCanvasRef"
          :value="qrCodeValue"
          icon="https://innerpurity-bucket.oss-cn-hangzhou.aliyuncs.com/58x58.png"
          iconSize="47"
          :size="qrCodeSize"
          :status="qrCodeStatus"
        />
        <div>
          <span>输入数值可调整二维码尺寸:</span>
          <n-input-number
            v-model:value="qrCodeSize"
            size="medium"
            style="width: 20%"
            placeholder="建议尺寸: 250"
            min="150"
            max="450"
          />
        </div>
      </div>
    </n-card>
  </n-modal>
  <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
  <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
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
  <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
</template>

<style scoped>
:deep().el-input {
  display: flex !important;
  --el-input-focus-border: #626aef;
  --el-input-border-color: #626aef;
  --el-input-focus-border-color: #626aef;
  --el-menu-active-color: #aaa !important;
  --el-menu-hover-text-color: #aaa !important;
  --el-color-primary: #626aef !important;
}
:deep().el-input--suffix {
  margin: 0 auto !important;
}
:deep().el-select {
  --el-select-input-focus-border-color: #626aef;
  --el-menu-active-color: #aaa !important;
  --el-menu-hover-text-color: #aaa !important;
  --el-color-primary: #626aef !important;
}
.el-from-item-input {
  width: 60%;
  height: 70%;
}
.storage-dialog-footer {
  display: block;
  margin: 20px auto 0;
  text-align: center;
}
.storage-el-form-h2 {
  text-align: center;
  margin: 20px auto;
}
.codeMaking-el-button-container {
  margin: 0 auto;
  text-align: center;
}
.codeMaking-el-button-style {
  margin-top: 20px;
}
.select-show-container {
  width: 35%;
  height: 20px;
  margin: 0 auto;
  border: 1px solid #626aef;
  border-radius: 5px;
}
.codeMaking-el-select-style {
  --el-input-focus-border: #626aef;
  --el-input-border-color: #626aef;
  --el-input-focus-border-color: #626aef;
  --el-menu-active-color: #aaa !important;
  --el-menu-hover-text-color: #aaa !important;
  --el-color-primary: #626aef !important;
  display: block;
  width: 35%;
  height: 20px;
  margin: 20px auto !important;
  margin-left: 20%;
}
.codeMaking-el-input-style {
  --el-input-focus-border: #626aef;
  --el-input-border-color: #626aef;
  --el-input-focus-border-color: #626aef;
  --el-menu-active-color: #aaa !important;
  --el-menu-hover-text-color: #aaa !important;
  --el-color-primary: #626aef !important;
  left: 30%;
  top: 20px;
  width: 40%;
  margin: 0 auto 20px;
  text-align: center;
}
.codeMaking-el-progress-style {
  width: 35%;
  top: 10px;
  margin: 0 auto;
  text-align: center;
}
:deep() .el-input__inner {
  width: 300px;
  height: 40px;
}
:deep() .el-input__wrapper {
  padding: 0;
}
:deep() .el-input {
  display: none;
}
.keyCode-h3 {
  position: relative;
  overflow: hidden;
  margin-left: 30%;
  margin-top: 20px;
}
.codeMaking-el-txt-style {
  left: 30%;
  top: 20px;
  width: 40%;
  margin: 0 auto;
  text-align: center;
}
.codeMaking-hr-div {
  width: 100%;
  height: 1px;
  margin-bottom: 100px;
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
  background-color: #626aef;
}

.qrcode-content {
  width: 100%;
}
.skeleton-content {
  width: 100%;
}
</style>