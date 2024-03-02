<script setup>
import { useRsaHistoryStore } from "../../stores/rsaHistory";
import {
  onBeforeMount,
  ref,
  watch,
  watchEffect,
  onMounted,
  computed,
} from "vue";
import { ElMessage, ElNotification, ElEmpty, ElLoading } from "element-plus";
import {
  NCard,
  NModal,
  NTooltip,
  NInputNumber,
  NButton,
  NInput,
} from "naive-ui";
///////////////////////////////////////////////////////////////////////////////////////////////////
import axios from "axios";
import instance from "../../axios/axios";
///////////////////////////////////////////////////////////////////////////////////////////////////
import responseDataMessage from "../../hooks/reponseDataMessage";
const rsaHistoryStore = useRsaHistoryStore();
//////////////////////////////////////////////////////////////////////////////////
const functionLike = ref("");
const functionLikeOptions = ref([
  {
    label: "密钥生成",
    value: "密钥生成",
  },
  {
    label: "加密解密",
    value: "加密解密",
  },
  {
    label: "全部",
    value: "全部",
  },
]);
const keyTypeLike = ref("");
const keyTypeLikeOptions = ref([
  {
    label: "RSA",
    value: "RSA",
  },
  {
    label: "全部",
    value: "",
  },
]);
const keyForceLike = ref("");
const keyForceLikeOptions = ref([
  {
    label: "512",
    value: "512",
  },
  {
    label: "1024",
    value: "1024",
  },
  {
    label: "2048",
    value: "2048",
  },
  {
    label: "全部",
    value: "",
  },
]);
const selectDate = ref("");
//便捷选择日期选项
const shortcuts = ref([
  {
    text: "前一周内",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "前一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "前三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
]);
//////////////////////////////////////////////////////////////////////////////////
const historyData = ref([]);
const filterHistoryData = ref([]);
const nullfunctionLikeMessage = () => {
  ElMessage({
    message: "功能类型为必选项,请选择!",
    grouping: true,
    center: true,
    type: "warning",
  });
};
const handleSearch = () => {
  if (functionLike.value === "") {
    nullfunctionLikeMessage();
  } else {
    if (functionLike.value === "密钥生成") {
      if (
        keyForceLike.value === "" ||
        keyTypeLike.value === "" ||
        selectDate.value === ""
      ) {
        filterHistoryData.value = historyData.value;
        if (keyForceLike.value !== "") {
          filterHistoryData.value = filterHistoryData.value.filter((item) => {
            return item.keyForce === keyForceLike.value;
          });
        }
        if (keyTypeLike.value !== "") {
          filterHistoryData.value = filterHistoryData.value.filter((item) => {
            return item.keyType === keyTypeLike.value;
          });
        }
        if (selectDate.value !== "") {
          filterHistoryData.value = filterHistoryData.value.filter((item) => {
            return (
              selectDate.value[0] <= new Date(item.storeTime).getTime() &&
              new Date(item.storeTime).getTime() - 3600 * 1000 * 24 <=
                selectDate.value[1]
            );
          });
        }
      } else {
        filterHistoryData.value = historyData.value.filter((item) => {
          return (
            item.keyForce === keyForceLike.value &&
            item.keyType === keyTypeLike.value &&
            selectDate.value[0] <= new Date(item.storeTime).getTime() &&
            new Date(item.storeTime).getTime() - 3600 * 1000 * 24 <=
              selectDate.value[1]
          );
        });
      }
    } else if (functionLike.value === "加密解密") {
      /////////////////   待开发   //////////////////
      return;
    }
  }
};
// /////////////////////////////////////////*****************/////////////////////////////////////////////////////////////
const handleAllSearch = () => {
  filterHistoryData.value = historyData.value;
};
// /////////////////////////////////////////*****************/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
const detailShow = ref(false);
const detailPublicKey = ref("");
const detailPrivateKey = ref("");
const detailPrivatePassword = ref("");
// /////////////////////////////////////////*****************/////////////////////////////////////////////////////////////
const drawerQrcodeShow = ref(false);
const detailShowDrawerLoading = ref(false);

const handleDetail = (scopeRow) => {
  detailPrivateKey.value = "";
  detailPublicKey.value = "";
  drawerQrcodeShow.value = false;

  detailShow.value = true;
  detailShowDrawerLoading.value = true;
  const formData1 = new FormData();
  formData1.append("url", scopeRow.publicKey);
  instance
    .post("/users/common/downloadText", formData1, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      const responsePublicKey = res.data.data;
      detailPublicKey.value = responsePublicKey;
    });

  const formData2 = new FormData();
  formData2.append("url", scopeRow.privateKey);
  instance
    .post("/users/common/downloadText", formData2, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      const responsePrivateKey = res.data.data;
      detailPrivateKey.value = responsePrivateKey;

      detailShowDrawerLoading.value = false;
      drawerQrcodeShow.value = true;
    });

  detailPrivatePassword.value = scopeRow.privatePassword;
};

const handleDelete = (scopeRow) => {
  const formData = new FormData();
  formData.append("id", scopeRow.id);
  instance
    .post("/users/rsaKey/deleteUserRsaKey", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      const responseData = res.data;
      if (responseData.code != 1) {
        responseDataMessage(responseData, "出错了，请刷新重试");
      } else {
        responseDataMessage(responseData);
        detailShowDrawerLoading.value = true;
        axiosGetAllHistoryData().then((res) => {
          detailShowDrawerLoading.value = false;
        });
      }
    });
};
// /////////////////////////////////////////*****************/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
const publicCopyTitle = ref(false);
const privateCopyTitle = ref(false);
const passwordShowTitle = ref(false);
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
//////////////////////////////////////////////////////////////////////////////////
const passwordType = ref("password");
const showDetailPassword = () => {
  passwordType.value = "textarea";
};
const hideDetailPassword = () => {
  passwordType.value = "password";
};
//////////////////////////////////////////////////////////////////////////////////
const filterHistoryDataLoading = ref(false);

const axiosGetAllHistoryData = async () => {
  filterHistoryDataLoading.value = true;
  try {
    instance.get("/users/rsaKey/getUserRsaKey").then((res) => {
      const responseData = res.data;
      if (responseData.code != 1) {
        responseDataMessage(responseData, "用户数据加载失败");
      }
      historyData.value = responseData.data;
      filterHistoryData.value = responseData.data;
      filterHistoryDataLoading.value = false;
    });
  } catch {
    ElNotification({
      title: "网络异常",
      message: e,
      type: "error",
    });
  }
};

watch(
  () => rsaHistoryStore.drawerShow,
  (newValue, oldValue) => {
    if (newValue === true) {
      axiosGetAllHistoryData();
    }
  }
);
//////////////////////////////////////////////////////////////////////////////////
//执行批量删除数据的逻辑
//--获取数据，显示批量删除按钮

const selectedRows = ref([]);
const historyDataTableRef = ref();
const showDeleteBatchButton = ref(false);
const showBatch = ref(false);
const showLargeBatch = ref(false);

const canEscToExit = ref(true);

const identifyPassword = ref(null);
const identifyCalculate = ref(null);

const handleSelectionChange = (e) => {
  selectedRows.value = e;
  if (e.length <= 0) {
    showDeleteBatchButton.value = false;
  } else {
    showDeleteBatchButton.value = true;
  }
};

const preDeleteBatch = () => {
  if (selectedRows.value.length >= 10) {
    showLargeBatch.value = true;
    rsaHistoryStore.drawerShow = false;
  } else {
    showBatch.value = true;
  }
};

const axiosIdentifyByPasswordDeleteBatch = () => {
  if (identifyPassword.value != null && identifyCalculate.value != null) {
    if (checkResult()) {
      const formdata = new FormData();
      formdata.append("password", identifyPassword.value);
      instance
        .post("/users/identifyByPassword", formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const responseData = res.data;
          if (responseData.code != 1) {
            responseDataMessage(responseData);
          } else {
            axiosDeleteBatch();
          }
        });
    } else {
      randomCalculate.value = generateRandomOperation();
      ElNotification({
        title: "计算结果有误,请重新计算",
        type: "error",
        zIndex: 99999999,
      });
    }
  } else {
    ElNotification({
      title: "请完整填写后提交",
      type: "info",
      zIndex: 99999999,
    });
  }
};

const axiosDeleteBatch = () => {
  instance
    .post("/users/rsaKey/deleteUserRsaKeys", selectedRows.value)
    .then((res) => {
      const responseData = res.data;
      if (responseData.code != 1) {
        responseDataMessage(responseData, "出错了，请刷新重试");
        showBatch.value = false;
        showLargeBatch.value = false;
        rsaHistoryStore.drawerShow = true;
        showDeleteBatchButton.value = false;
      } else {
        responseDataMessage(responseData, "数据粉碎机: 嗝~");
        axiosGetAllHistoryData().then((res) => {
          showBatch.value = false;
          showLargeBatch.value = false;
          rsaHistoryStore.drawerShow = true;
          showDeleteBatchButton.value = false;
        });
      }
      identifyPassword.value = null;
      identifyCalculate.value = null;
    });
};

const cancelDeleteBatch = () => {
  showLargeBatch.value = false;
  rsaHistoryStore.drawerShow = true;
  identifyPassword.value = null;
  identifyCalculate.value = null;
};

const randomCalculate = ref("");
const generateRandomOperation = () => {
  var operators = ["+", "-", "*"];
  var operator = operators[Math.floor(Math.random() * operators.length)];
  var num1 = Math.floor(Math.random() * 100); // 生成两位数以内的随机数
  var num2 = Math.floor(Math.random() * (operator === "*" ? 10 : 100)); // 生成两位数或一位数的随机数，乘法时为一位数

  return num1 + " " + operator + " " + num2;
};

watch(showLargeBatch, (newValue, oldValue) => {
  if (newValue === true) {
    randomCalculate.value = generateRandomOperation();
    canEscToExit.value = false;
  } else if (newValue === false) {
    canEscToExit.value = true;
  }
});
watch(showBatch, (newValue, oldValue) => {
  if (newValue === true) {
    canEscToExit.value = false;
  } else if (newValue === false) {
    canEscToExit.value = true;
  }
});

const checkResult = () => {
  // 将用户输入的字符串转换成数字进行比较
  const userResult = parseFloat(identifyCalculate.value);
  // 将生成的计算式转换成真正的计算结果
  const realResult = eval(randomCalculate.value);
  // 比较结果
  return userResult === realResult;
};
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
watch(qrcodeShow, (newValue, oldValue) => {
  if (newValue === false) {
    rsaHistoryStore.drawerShow = true;
  }
});
//////////////////////////////////////////////////////////////////////////////////
const qrCodeParams = ref({
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
        qrCodeParams.value.publicKey = detailPublicKey.value;
      }
      if (qrCodeOptions.value.privateKey === true) {
        qrCodeParams.value.privateKey = detailPrivateKey.value;
      }
      if (qrCodeOptions.value.password === true) {
        qrCodeParams.value.password = detailPrivatePassword.value;
      }
      setTimeout(() => {
        instance
          .post("/users/common/getUnicode", qrCodeParams.value)
          .then(
            (res) => {
              const responseData = res.data;
              if (responseData.code % 10 === 0) {
                responseDataMessage(responseData);
              } else {
                currentUnicode.value = responseData.data;
                qrCodeValue.value =
                  "http://localhost:2599/users/common/getQrData/" +
                  currentUnicode.value;
              }
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
//////////////////////////////////////////////////////////////////////////////////
</script>

<template>
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
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
  <el-drawer
    v-model="detailShow"
    direction="rtl"
    size="42%"
    :with-header="false"
    :append-to-body="true"
  >
    <div v-loading="detailShowDrawerLoading">
      <div class="detail-h3-style">
        <n-button
          type="info"
          ghost
          @click="
            qrcodeShow = true;
            detailShow = false;
            rsaHistoryStore.drawerShow = false;
          "
          :block="true"
          style="width: 90%; margin: 10px auto 20px"
        >
          生成快传二维码
        </n-button>
      </div>
      <h3 class="detail-h3-style">
        私人密码&nbsp;记录
        <el-icon
          color="#626aef"
          size="20px"
          style="margin-left: 10px; cursor: pointer"
          @mouseenter="passwordShowTitle = true"
          @mouseleave="passwordShowTitle = false"
          @mousedown="showDetailPassword()"
          @mouseup="hideDetailPassword()"
          ><View
        /></el-icon>
        <span class="password-title" v-show="passwordShowTitle"
          >长按显示密码</span
        >
      </h3>
      <el-input
        v-model="detailPrivatePassword"
        autosize
        readonly
        resize="none"
        :type="passwordType"
        class="codeMaking-el-txt-style"
        placeholder="--没有设置或未保存--"
      />
      <h3 class="detail-h3-style">
        公钥/非PEM格式&nbsp;生成记录
        <el-icon
          color="#626aef"
          size="20px"
          style="margin-left: 10px; cursor: pointer"
          @mouseenter="publicCopyTitle = true"
          @mouseleave="publicCopyTitle = false"
          @click="copyCode(detailPublicKey)"
          ><DocumentCopy
        /></el-icon>
        <span class="copy-title" v-show="publicCopyTitle">复制公钥</span>
      </h3>
      <el-input
        v-model="detailPublicKey"
        autosize
        readonly
        resize="none"
        type="textarea"
        class="codeMaking-el-txt-style"
        placeholder="--没有设置或未保存--"
      />
      <h3 class="detail-h3-style">
        私钥/非PEM格式&nbsp;生成记录
        <el-icon
          color="#626aef"
          size="20px"
          style="margin-left: 10px; cursor: pointer"
          @mouseenter="privateCopyTitle = true"
          @mouseleave="privateCopyTitle = false"
          @click="copyCode(detailPrivateKey)"
          ><DocumentCopy
        /></el-icon>
        <span class="copy-title" v-show="privateCopyTitle">复制私钥</span>
      </h3>
      <el-input
        v-model="detailPrivateKey"
        autosize
        readonly
        resize="none"
        type="textarea"
        class="codeMaking-el-txt-style"
        placeholder="--没有设置或未保存--"
      />
    </div>
  </el-drawer>
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

  <el-drawer
    ref="historyDataTableRef"
    v-model="rsaHistoryStore.drawerShow"
    direction="ttb"
    :show-close="false"
    :close-on-click-modal="false"
    size="100%"
    :with-header="false"
    :append-to-body="true"
    :close-on-press-escape="canEscToExit"
  >
    <template #default>
      <div class="search-history">
        <el-select
          class="history-select-style"
          v-model="functionLike"
          placeholder="--筛选功能类型(*必选)--"
          size="large"
          style="width: 200px"
        >
          <el-option
            v-for="item in functionLikeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          class="history-select-style"
          v-model="keyTypeLike"
          placeholder="--筛选密钥类型--"
          size="large"
          style="width: 200px"
        >
          <el-option
            v-for="item in keyTypeLikeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          class="history-select-style"
          v-model="keyForceLike"
          placeholder="--筛选密钥强度--"
          size="large"
          style="width: 200px"
        >
          <el-option
            v-for="item in keyForceLikeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          type="daterange"
          v-model="selectDate"
          unlink-panels
          range-separator="To"
          start-placeholder="筛选起始日期"
          end-placeholder="筛选终止日期"
          :shortcuts="shortcuts"
          size="large"
          shortcuts="shortcuts"
          style="width: 400px"
        />
        <el-button
          round
          size="large"
          class="history-search-button"
          @click="handleSearch"
          ><el-icon size="16px" style="color: #000"><Search />&nbsp;</el-icon
          >搜索</el-button
        >
        <el-button
          style="border: 1px solid #626aef; color: #626aef"
          round
          size="large"
          class="history-search-button"
          @click="handleAllSearch"
          >直接查找全部</el-button
        >
      </div>
      <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
      <div class="history-table-style">
        <el-table
          v-loading="filterHistoryDataLoading"
          @selection-change="handleSelectionChange"
          :data="filterHistoryData"
          height="500"
          style="width: 90%"
          v-if="filterHistoryData.length > 0"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            prop="storeTime"
            fixed
            label="生成时间"
            width="240"
          />
          <el-table-column prop="keyType" label="密钥类型" width="200" />
          <el-table-column prop="keyForce" label="密钥强度" width="200" />
          <el-table-column prop="note" label="备注" />
          <el-table-column label="操作">
            <template #default="scope">
              <n-button ghost color="#606266" @click="handleDetail(scope.row)"
                >详情</n-button
              >
              <el-popconfirm
                confirm-button-text="继续删除"
                cancel-button-text="取消"
                icon-color="#626AEF"
                title="敏感数据，谨慎删除!"
                @confirm="handleDelete(scope.row)"
              >
                <template #reference>
                  <n-button ghost color="#c45656" style="margin-left: 6px"
                    >删除数据</n-button
                  >
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <template v-else>
          <el-empty description="暂无数据" :image-size="200"> </el-empty>
        </template>
      </div>
      <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
    </template>
    <template #footer>
      <div class="historyDrawerFooterContainer">
        <div class="DeleteBatchButton">
          <n-button
            ghost
            color="#c45656"
            @click="preDeleteBatch"
            v-show="showDeleteBatchButton"
          >
            <template #icon>
              <el-icon><DeleteFilled /></el-icon>
            </template>
            批量删除数据
          </n-button>
        </div>
        <div class="exitHistoryDrawerButton">
          <n-button
            @click="rsaHistoryStore.drawerShow = false"
            ghost
            color="#696aef"
            >关闭/esc</n-button
          >
        </div>
      </div>
    </template>
  </el-drawer>
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <n-modal
    v-model:show="showLargeBatch"
    transform-origin="center"
    :auto-focus="false"
    :mask-closable="false"
    :close-on-esc="false"
    @keydown.enter="javascript:;"
  >
    <div>
      <el-card class="box-card" shadow="never">
        <template #header>
          <div class="card-header">
            <h3>权限验证</h3>
          </div>
        </template>
        <h4>
          检测到您需要批量删除大量数据，为保证账户数据安全，需要您输入账户密码进行身份验证:
        </h4>
        <div style="text-align: center">
          <form>
            <p>输入密码:</p>
            <input
              class="passwordInput"
              type="password"
              v-model="identifyPassword"
            />
          </form>

          <form>
            <p>计算以下算式的正确结果:</p>
            <div class="identifyByCalculate">
              {{ randomCalculate }}
            </div>
            <input class="calculateInput" v-model="identifyCalculate" />
          </form>
        </div>
        <div
          style="
            display: flex;
            margin: 10px auto;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          "
        >
          <n-button
            style="margin-right: 10px"
            @click="cancelDeleteBatch"
            ghost
            color="#606266"
            >取消</n-button
          >
          <n-button
            style="margin-left: 10px"
            @click="axiosIdentifyByPasswordDeleteBatch"
            ghost
            color="#c45656"
            >提交并删除数据</n-button
          >
        </div>
      </el-card>
    </div>
  </n-modal>
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <n-modal
    v-model:show="showBatch"
    transform-origin="center"
    z-index="9999999"
    :mask-closable="false"
    :close-on-esc="false"
  >
    <n-card
      style="width: 600px"
      title="批量删除数据"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      确定全部删除这些数据吗？
      <template #footer>
        <div
          style="
            display: flex;
            margin: 10px auto;
            justify-content: center;
            align-items: center;
          "
        >
          <n-button
            style="margin-right: 10px"
            @click="showBatch = false"
            ghost
            color="#606266"
            >取消</n-button
          >
          <n-button
            style="margin-left: 10px"
            @click="axiosDeleteBatch"
            ghost
            color="#c45656"
            >确定</n-button
          >
        </div>
      </template>
    </n-card>
  </n-modal>
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
</template>

<style scoped>
.history-select-style {
  margin: 0 30px 0 10px;
}
.history-search-button {
  margin-left: 50px;
  margin-right: 30px;
}
.search-history {
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 12%;
}
.history-table-style {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.codeMaking-el-txt-style {
  left: 5%;
  width: 90%;
  margin: 20px auto;
  text-align: center;
}
.detail-h3-style {
  text-align: center;
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
  margin-top: 6px;
  border-radius: 5px;
}
.password-title {
  position: absolute;
  width: 80px;
  height: 20px;
  background-color: #0a0a0a;
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
  margin-left: 10px;
  margin-top: 6px;
  border-radius: 5px;
}

.drawerQrcode {
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.DeleteBatchButton {
  padding-left: 5%;
  display: flex;
  justify-content: left;
}
.exitHistoryDrawerButton {
  display: flex;
  justify-content: right;
  padding-right: 2.5%;
}

.passwordInput {
  width: 180px;
  height: 30px;
  border-radius: 8px;
  border: 1.5px solid #aaa;
  outline: none;
}

.passwordInput:hover {
  border: 1.5px solid #c45656;
}

.passwordInput:focus {
  border: 1.5px solid #c45656;
}

.calculateInput {
  width: 180px;
  height: 30px;
  border-radius: 8px;
  border: 1.5px solid #aaa;
  outline: none;
}

.calculateInput:hover {
  border: 1.5px solid #c45656;
}

.calculateInput:focus {
  border: 1.5px solid #c45656;
}

.identifyByCalculate {
  height: 30px;
  width: 120px;
  font-size: 26px;
  line-height: 30px;
  border-radius: 5px;
  background-color: #e4e7ed;
  margin: 10px auto;
  text-align: center;
}

.historyDrawerFooterContainer {
  display: flex;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>