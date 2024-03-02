<script setup>
import {
  onBeforeMount,
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
  ElIcon,
} from "element-plus";
import {
  NCard,
  NModal,
  NTooltip,
  NInputNumber,
  NButton,
  NInput,
  NDropdown,
  NTag,
  NPopover,
  NPopselect,
  NEllipsis,
} from "naive-ui";
import {
  CaretDownOutlined,
  SettingOutlined,
  FilterFilled,
  PlusCircleOutlined,
  HighlightOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
///////////////////////////////////////////////////////////////////////////////////////////////////
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
///////////////////////////////////////////////////////////////////////////////////////////////////
import axios from "axios";
import instance from "../../axios/axios";
import responseDataMessage from "../../hooks/reponseDataMessage";
import { useRsaUserInfoStore } from "../../stores/rsaUserInfo";
const userInfo = useRsaUserInfoStore();
///////////////////////////////////////////////////////////////////////////////////////////////////
onMounted(() => {
  axiosGetSocketData();
});

const clearObjProp = (obj) => {
  Object.keys(obj).forEach((key) => {
    obj[key] = null;
  });
};
const clearAddRequestPathInputSpace = () => {
  // 去除输入框内所有空格
  addRequestPath.value.requestPath = addRequestPath.value.requestPath.replace(
    /\s/g,
    ""
  );
};
const clearNewRequestPathInputSpace = () => {
  // 去除输入框内所有空格
  newRequestPath.value = newRequestPath.value.replace(/\s/g, "");
};

const socketData = ref([]);
const totalRecords = ref(10);

const currentPage = ref(1);
const pageSize = ref(10);

const filterProperties = ref({
  requestPath: null,
  note: null,
  canRequest: null,
  watchIt: null,
  updateUser: null,
});
const requestPathPageDTO = ref({
  requestPath: null,
  note: null,
  canRequest: null,
  watchIt: null,
  updateUser: null,
  page: null,
  pageSize: null,
});
const requestPath = ref({
  id: null,
  requestPath: null,
  note: null,
  canRequest: null,
  watchIt: null,
  updateUser: null,
  updateTime: null,
});
const requestPathList = ref([]);
const socketDataLoding = ref(false);

const getRequestPathPageDTOValue = () => {
  return new Promise((resolve) => {
    requestPathPageDTO.value.requestPath = filterProperties.value.requestPath;
    requestPathPageDTO.value.note = filterProperties.value.note;
    requestPathPageDTO.value.canRequest = filterProperties.value.canRequest;
    requestPathPageDTO.value.watchIt = filterProperties.value.watchIt;
    requestPathPageDTO.value.updateUser = filterProperties.value.updateUser;
    requestPathPageDTO.value.page = currentPage.value;
    requestPathPageDTO.value.pageSize = pageSize.value;
    resolve();
  });
};
const axiosGetSocketData = () => {
  socketDataLoding.value = true;
  try {
    getRequestPathPageDTOValue().then(() => {
      instance
        .post("/request/getRequestPathByPage", requestPathPageDTO.value)
        .then((res) => {
          const responseData = res.data;
          socketData.value = responseData.data.records;
          totalRecords.value = responseData.data.total;
          socketDataLoding.value = false;
        });
    });
  } catch (error) {
    ElNotification({
      title: "网络异常",
      message: error,
      type: "error",
    });
    socketDataLoding.value = false;
    console.log(error);
  }
};

const colorStatus = ref({
  active: "#529b2e",
  noActive: "#c45656",
});

const canRequestOptions = ref([
  {
    label: "接入使用",
    key: 1,
  },
  {
    label: "暂停服务",
    key: 0,
  },
]);
const watchItOptions = ref([
  {
    label: "开启监视",
    key: 1,
  },
  {
    label: "取消监视",
    key: 0,
  },
]);
const actionOptions = ref([
  {
    label: "更改接口路径",
    key: 1,
  },
  {
    label: "修改备注",
    key: 2,
  },
  {
    label: "删除配置",
    key: 3,
  },
]);
//////////////////////////////////////****************/////////////////////////////////////////
const recordRequestPathData = (scopeRows) => {
  requestPath.value = { ...scopeRows };
};
//////////////////////////////////////***************//////////////////////////////////////////
// 在Vue.js中，当对象被修改时，绑定到该对象的所有组件都会更新其对应的视图。
// 因此，当修改一个属性时，另一个属性也会相应地更新并反映在视图中。

// 如果希望这两个属性之间的更改是独立的，可以在recordRequestPathData函数中对requestPath.value进行深拷贝，
// 并将拷贝后的对象用于记录每个属性的值。这样，每个属性的更改就不会互相影响了。
// 例如：
// const recordRequestPathData = (scopeRows) => {
//   requestPath.value = { ...scopeRows };
// };
// 这样，requestPath.value将被重新赋值为scopeRows对象的深拷贝，而不是引用同一个对象。这样，两个属性之间的更改就不会相互影响了。
const handleCanRequestSelect = (key) => {
  requestPath.value.canRequest = key;
  requestPath.value.requestPath = null;
  //以上代码为了防止更新时连同路径名发给后端导致重名路径无法添加的错误
  socketDataLoding.value = true;
  instance.put("/request/updateRequestPath", requestPath.value).then((res) => {
    socketDataLoding.value = false;
    responseDataMessage(res.data);
    axiosGetSocketData();
  });
};
const handleWatchItSelect = (key) => {
  requestPath.value.watchIt = key;
  requestPath.value.requestPath = null;
  //以上代码为了防止更新时连同路径名发给后端导致重名路径无法添加的错误
  socketDataLoding.value = true;
  instance.put("/request/updateRequestPath", requestPath.value).then((res) => {
    socketDataLoding.value = false;
    responseDataMessage(res.data);
    axiosGetSocketData();
  });
};
const handleActionSelect = (key) => {
  switch (key) {
    case 1: {
      showHandleUpdateRequestPathNameModal.value = true;
      break;
    }
    case 2: {
      showHandleUpdateNote.value = true;
      newNote.value = requestPath.value.note;
      break;
    }
    case 3: {
      showHandleDeleteSocketData.value = true;
      break;
    }
  }
};
const newRequestPath = ref("");
const handleUpdateRequestPathName = () => {
  if (newRequestPath.value === "") {
    ElNotification({
      title: "路径不能为空",
      type: "info",
    });
    return;
  }
  requestPath.value.requestPath = newRequestPath.value;
  socketDataLoding.value = true;
  instance.put("/request/updateRequestPath", requestPath.value).then((res) => {
    socketDataLoding.value = false;
    showHandleUpdateRequestPathNameModal.value = false;
    responseDataMessage(res.data);
    axiosGetSocketData();
  });
};
const newNote = ref("");
const handleUpdateNote = () => {
  requestPath.value.note = newNote.value;
  requestPath.value.requestPath = null;
  //以上代码为了防止更新时连同路径名发给后端导致重名路径无法添加的错误
  socketDataLoding.value = true;
  instance.put("/request/updateRequestPath", requestPath.value).then((res) => {
    socketDataLoding.value = false;
    showHandleUpdateNote.value = false;
    responseDataMessage(res.data);
    axiosGetSocketData();
  });
};
const handleDeleteSocketData = () => {
  socketDataLoding.value = true;
  requestPathList.value.push(requestPath.value);
  instance
    .post("/request/deleteBatchRequestPath", requestPathList.value)
    .then((res) => {
      socketDataLoding.value = false;
      showHandleDeleteSocketData.value = false;
      responseDataMessage(res.data);
      axiosGetSocketData();
      requestPathList.value.splice(0, requestPathList.value.length);
    });
};
const showHandleUpdateRequestPathNameModal = ref(false);
const showHandleUpdateNote = ref(false);
const showHandleDeleteSocketData = ref(false);

const handleFilterCanRequest = (value) => {
  filterProperties.value.canRequest = value;
  axiosGetSocketData();
};
const handleFilterWatchIt = (value) => {
  filterProperties.value.watchIt = value;
  axiosGetSocketData();
};
const handleFilterCanRequestValue = ref("");
const filterCanRequestOptions = ref([
  {
    label: "接入使用",
    value: 1,
  },
  {
    label: "暂停服务",
    value: 0,
  },
  {
    label: "全部",
    value: "",
  },
]);
const handleFilterWatchItValue = ref("");
const filterWatchItOptions = ref([
  {
    label: "监视中",
    value: 1,
  },
  {
    label: "不监视",
    value: 0,
  },
  {
    label: "全部",
    value: "",
  },
]);
//////////////////////////////////////////////////////////////////////////////////
//执行批量删除数据
const selectedRows = ref([]);
const handleSelectionChange = (e) => {
  selectedRows.value = e;
  if (e.length > 0) {
    canBatchUpdate.value = false;
    canBatchDelete.value = false;
  }
  if (e.length === 0) {
    canBatchUpdate.value = true;
    canBatchDelete.value = true;
  }
};
const handleDeleteBatchSocketData = () => {
  socketDataLoding.value = true;
  selectedRows.value.forEach((items) => {
    requestPathList.value.push(items);
  });
  instance
    .post("/request/deleteBatchRequestPath", requestPathList.value)
    .then((res) => {
      socketDataLoding.value = false;
      showHandleDeleteSocketData.value = false;
      responseDataMessage(res.data);
      axiosGetSocketData();
      requestPathList.value.splice(0, requestPathList.value.length);
      //以上代码用于清空选项数组
      showBatch.value = false;
      showLargeBatch.value = false;
      showRecheckModal.value = false;
      identifyPassword.value = null;
      identifyCalculate.value = null;
    });
};
//////////////////////////////////////////////////////////////////////////////////
const showBatch = ref(false);
const showLargeBatch = ref(false);

const canEscToExit = ref(true);

const identifyPassword = ref(null);
const identifyCalculate = ref(null);

const preDeleteBatch = () => {
  if (selectedRows.value.length >= 10) {
    showLargeBatch.value = true;
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
            ///继续跳转到已选项的确认框---二次确认
            handleRecheckSelected();
            showLargeBatch.value = false;
          }
        });
    } else {
      randomCalculate.value = generateRandomOperation();
      ElNotification({
        title: "计算结果有误,请重新计算",
        type: "error",
      });
    }
  } else {
    ElNotification({
      title: "请完整填写后提交",
      type: "info",
    });
  }
};

const showRecheckModal = ref(false);
const handleRecheckSelected = () => {
  showRecheckModal.value = true;
};

const cancelDeleteBatch = () => {
  showLargeBatch.value = false;
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
const checkResult = () => {
  // 将用户输入的字符串转换成数字进行比较
  const userResult = parseFloat(identifyCalculate.value);
  // 将生成的计算式转换成真正的计算结果
  const realResult = eval(randomCalculate.value);
  // 比较结果
  return userResult === realResult;
};
watch(showLargeBatch, (newValue) => {
  if (newValue === true) {
    randomCalculate.value = generateRandomOperation();
    canEscToExit.value = false;
  } else if (newValue === false) {
    canEscToExit.value = true;
  }
});
watch(showBatch, (newValue) => {
  if (newValue === true) {
    canEscToExit.value = false;
  } else if (newValue === false) {
    canEscToExit.value = true;
  }
});
//////////////////////////////////////////////////////////////////////////////////
const canBatchUpdate = ref(true);
const canBatchDelete = ref(true);
//////////////////////////////////////////////////////////////////////////////////
const showAddSocketModal = ref(false);
const addCanRequestOptions = ref([
  {
    label: "接入使用",
    value: 1,
  },
  {
    label: "暂停服务",
    value: 0,
  },
]);
const addWatchItOptions = ref([
  {
    label: "开启监视",
    value: 1,
  },
  {
    label: "不监视",
    value: 0,
  },
]);
const addRequestPath = ref({
  id: null,
  requestPath: null,
  note: null,
  canRequest: 1,
  watchIt: 0,
  updateUser: null,
  updateTime: null,
});
const handleAddSocketData = () => {
  if (addRequestPath.value.requestPath != null) {
    socketDataLoding.value = true;
    instance
      .post("/request/addRequestPath", addRequestPath.value)
      .then((res) => {
        socketDataLoding.value = false;
        showAddSocketModal.value = false;
        responseDataMessage(res.data);
        axiosGetSocketData();
        clearObjProp(addRequestPath.value);
        addRequestPath.value.canRequest = 1;
        addRequestPath.value.watchIt = 0;
      });
  } else {
    ElNotification({
      title: "请填写接口路径",
      type: "info",
    });
  }
};
//////////////////////////////////////////////////////////////////////////////////
const showUpdateBatchModal = ref(false);
const updateBatchCanRequestOptions = ref([
  {
    label: "接入使用",
    value: 1,
  },
  {
    label: "暂停服务",
    value: 0,
  },
]);
const updateBatchWatchItOptions = ref([
  {
    label: "开启监视",
    value: 1,
  },
  {
    label: "取消监视",
    value: 0,
  },
]);
const updateBatchCanRequestValue = ref(null);
const updateBatchWatchItValue = ref(null);
const preUpdateBatch = () => {
  showUpdateBatchModal.value = true;
};

const updateBatch = () => {
  socketDataLoding.value = true;
  selectedRows.value.forEach((item) => {
    item.canRequest = updateBatchCanRequestValue.value;
    item.watchIt = updateBatchWatchItValue.value;
  });
  instance.put("/request/updateBatch", selectedRows.value).then((res) => {
    showUpdateBatchModal.value = false;
    socketDataLoding.value = false;
    responseDataMessage(res.data);
    axiosGetSocketData();
  });
};
</script>

<template>
  <n-modal v-model:show="showHandleUpdateRequestPathNameModal">
    <n-card
      style="width: 600px"
      title="更改接口路径名"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <el-input
        v-model="newRequestPath"
        class="w-50 m-2"
        placeholder="输入接口路径"
        @input="clearNewRequestPathInputSpace"
      />
      <n-tag :bordered="false" style="margin-top: 10px">
        *路径格式：<span style="color: #c45656"
          >注意大小写敏感，符合开发规范</span
        >。配合后端检查路径一致性！
      </n-tag>
      <n-tag :bordered="false" style="margin-top: 5px">
        如：(<span style="font-weight: 600"
          >/users/getExampleFunction/action</span
        >),<span style="color: #c45656">注意开头的斜杠</span>不要忘带
      </n-tag>
      <template #footer>
        <div class="footer-button">
          <n-button
            ghost
            color="#303133"
            style="margin-right: 10px"
            @click="showHandleUpdateRequestPathNameModal = false"
          >
            取消
          </n-button>
          <n-button
            ghost
            color="#E6A23C"
            style="margin-left: 10px"
            @click="handleUpdateRequestPathName"
          >
            提交
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
  <n-modal v-model:show="showHandleUpdateNote">
    <n-card
      style="width: 600px"
      title="备注"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <el-input
        v-model="newNote"
        autosize
        maxlength="200"
        type="textarea"
        placeholder="填写接口备注信息"
      />
      <template #footer>
        <div class="footer-button">
          <n-button
            ghost
            color="#303133"
            style="margin-right: 10px"
            @click="showHandleUpdateNote = false"
          >
            取消
          </n-button>
          <n-button
            ghost
            color="#E6A23C"
            style="margin-left: 10px"
            @click="handleUpdateNote"
          >
            提交
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
  <n-modal v-model:show="showHandleDeleteSocketData">
    <n-card
      style="width: 600px"
      title="删除接口配置"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      >确认要删除路径为
      <span style="font-weight: 600"
        >&nbsp;&nbsp;{{ requestPath.requestPath }}&nbsp;&nbsp;</span
      >的接口配置吗?
      <template #footer>
        <div class="footer-button">
          <n-button
            ghost
            color="#303133"
            style="margin-right: 10px"
            @click="showHandleDeleteSocketData = false"
          >
            取消
          </n-button>
          <n-button
            ghost
            color="#c45656"
            style="margin-left: 10px"
            @click="handleDeleteSocketData"
          >
            删除
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
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
      <span style="margin: 10px auto">确定全部删除以下接口配置吗？</span>
      <el-table :data="selectedRows" style="width: 60%; height: 40vh">
        <el-table-column prop="requestPath" label="接口路径" width="180" />
      </el-table>
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
            @click="handleDeleteBatchSocketData"
            ghost
            color="#c45656"
            >确定</n-button
          >
        </div>
      </template>
    </n-card>
  </n-modal>
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <n-modal
    v-model:show="showRecheckModal"
    transform-origin="center"
    :mask-closable="false"
    :close-on-esc="false"
  >
    <n-card
      style="width: 600px"
      title="确认数据"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <span style="margin: 10px auto">确定全部删除以下接口配置吗？</span>
      <el-table :data="selectedRows" style="width: 60%; height: 40vh">
        <el-table-column prop="requestPath" label="接口路径" width="180" />
      </el-table>
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
            @click="showRecheckModal = false"
            ghost
            color="#606266"
            >取消</n-button
          >
          <n-button
            style="margin-left: 10px"
            @click="handleDeleteBatchSocketData"
            ghost
            color="#c45656"
            >确定</n-button
          >
        </div>
      </template>
    </n-card>
  </n-modal>
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <n-modal v-model:show="showAddSocketModal">
    <n-card
      style="width: 600px"
      title="添加接口配置"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div style="margin-bottom: 10px">
        <span style="margin-bottom: 10px">接口路径</span>
        <el-input
          v-model="addRequestPath.requestPath"
          placeholder="接口路径"
          @input="clearAddRequestPathInputSpace"
        />
        <n-tag :bordered="false" style="margin-top: 10px">
          *路径格式：<span style="color: #c45656"
            >注意大小写敏感，符合开发规范</span
          >。配合后端检查路径一致性！
        </n-tag>
        <n-tag :bordered="false" style="margin-top: 5px">
          如：(<span style="font-weight: 600"
            >/users/getExampleFunction/action</span
          >),<span style="color: #c45656">注意开头的斜杠</span>不要忘带
        </n-tag>
      </div>

      <div style="margin-bottom: 10px">
        <span style="margin-bottom: 10px">备注</span>
        <el-input
          v-model="addRequestPath.note"
          autosize
          maxlength="200"
          type="textarea"
          placeholder="填写接口备注信息"
        />
      </div>

      <div style="margin-bottom: 10px; display: flex; align-items: center">
        <h4 style="margin-right: 10px">接入情况</h4>
        <el-select
          v-model="addRequestPath.canRequest"
          clearable
          placeholder="默认接入使用"
        >
          <el-option
            v-for="item in addCanRequestOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div style="margin-bottom: 10px; display: flex; align-items: center">
        <span style="margin-right: 10px">监视状态</span>
        <el-select
          v-model="addRequestPath.watchIt"
          clearable
          placeholder="默认不监视"
        >
          <el-option
            v-for="item in addWatchItOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <template #footer>
        <div class="footer-button">
          <n-button
            ghost
            color="#303133"
            style="margin-right: 10px"
            @click="showAddSocketModal = false"
          >
            取消
          </n-button>
          <n-button
            ghost
            color="#409EFF"
            style="margin-left: 10px"
            @click="handleAddSocketData"
          >
            添加
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
  <n-modal v-model:show="showUpdateBatchModal">
    <n-card
      style="width: 600px"
      title="批量修改配置"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      以下是本次修改的接口配置列表
      <el-table :data="selectedRows" style="width: 100%; height: 40vh">
        <el-table-column prop="requestPath" label="接口路径" width="180" />
        <el-table-column prop="canRequest">
          <template #header>
            <span>接入情况</span>
          </template>
          <template #default="scope">
            <template v-if="scope.row.canRequest === 1">
              <el-icon :color="colorStatus.active" size="14"
                ><SwitchButton
              /></el-icon>
              接入使用
            </template>
            <template v-else-if="scope.row.canRequest === 0">
              <el-icon :color="colorStatus.noActive" size="14"
                ><SwitchButton
              /></el-icon>
              暂停服务
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="watchIt">
          <template #header>
            <span>监视状态</span>
          </template>
          <template #default="scope">
            <template v-if="scope.row.watchIt === 1">
              <el-icon :color="colorStatus.active" size="14"><View /></el-icon>
              监视中
            </template>
            <template v-else-if="scope.row.watchIt === 0">
              <el-icon :color="colorStatus.noActive" size="14"
                ><Hide
              /></el-icon>
              不监视
            </template>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div
          style="
            margin: 10px auto;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            flex-wrap: wrap;
          "
        >
          <el-select
            v-model="updateBatchCanRequestValue"
            class="m-2"
            placeholder="选择接入情况"
          >
            <el-option
              v-for="item in updateBatchCanRequestOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="updateBatchWatchItValue"
            class="m-2"
            placeholder="选择监视状态"
          >
            <el-option
              v-for="item in updateBatchWatchItOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
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
            @click="showUpdateBatchModal = false"
            ghost
            color="#606266"
            >取消</n-button
          >
          <n-button
            style="margin-left: 10px"
            @click="updateBatch"
            ghost
            color="#c45656"
            >提交修改</n-button
          >
        </div>
      </template>
    </n-card>
  </n-modal>
  <!--//////////////////////////////////////////////////////////////////////////////////////////////-->
  <el-table
    @selection-change="handleSelectionChange"
    v-loading="socketDataLoding"
    element-loading-text="数据飞速赶来......"
    :data="socketData"
    height="55vh"
    max-height="55vh"
    style="width: 100%"
    :header-row-style="{ color: '#000', fontSize: '14px' }"
    table-layout="auto"
    empty-text="暂无相关的接口配置"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="requestPath" label="接口路径"> </el-table-column>
    <el-table-column prop="note" label="备注">
      <template #default="scope">
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="true">
          {{ scope.row.note }}
        </n-ellipsis>
        <!-- 用于省略文字,应对较长备注 -->
      </template>
    </el-table-column>
    <el-table-column prop="canRequest">
      <template #header>
        <span>接入情况</span>
        <n-popselect
          :options="filterCanRequestOptions"
          size="medium"
          scrollable
          @update:value="handleFilterCanRequest"
          v-model:value="handleFilterCanRequestValue"
        >
          <FilterFilled :style="{ marginLeft: '10px', cursor: 'pointer' }" />
        </n-popselect>
      </template>
      <template #default="scope">
        <template v-if="scope.row.canRequest === 1">
          <el-icon :color="colorStatus.active" size="14"
            ><SwitchButton
          /></el-icon>
          接入使用
        </template>
        <template v-else-if="scope.row.canRequest === 0">
          <el-icon :color="colorStatus.noActive" size="14"
            ><SwitchButton
          /></el-icon>
          暂停服务
        </template>
        <n-dropdown
          placement="bottom-start"
          trigger="hover"
          size="small"
          :options="canRequestOptions"
          @select="handleCanRequestSelect"
        >
          <CaretDownOutlined
            @mouseenter="recordRequestPathData(scope.row)"
            :style="{ fontSize: '16px' }"
          />
        </n-dropdown>
      </template>
    </el-table-column>
    <el-table-column prop="watchIt">
      <template #header>
        <span>监视状态</span>
        <n-popselect
          :options="filterWatchItOptions"
          size="medium"
          scrollable
          @update:value="handleFilterWatchIt"
          v-model:value="handleFilterWatchItValue"
        >
          <FilterFilled :style="{ marginLeft: '10px', cursor: 'pointer' }" />
        </n-popselect>
      </template>
      <template #default="scope">
        <template v-if="scope.row.watchIt === 1">
          <el-icon :color="colorStatus.active" size="14"><View /></el-icon>
          监视中
        </template>
        <template v-else-if="scope.row.watchIt === 0">
          <el-icon :color="colorStatus.noActive" size="14"><Hide /></el-icon>
          不监视
        </template>
        <n-dropdown
          placement="bottom-start"
          trigger="hover"
          size="small"
          :options="watchItOptions"
          @select="handleWatchItSelect"
        >
          <CaretDownOutlined
            @mouseenter="recordRequestPathData(scope.row)"
            :style="{ fontSize: '16px' }"
          />
        </n-dropdown>
      </template>
    </el-table-column>
    <el-table-column prop="updateUser" label="上次操作人">
      <template #default="scope">
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="true">
          {{ scope.row.updateUser }}
        </n-ellipsis>
        <!-- 用于省略文字,应对较长备注 -->
      </template>
    </el-table-column>
    <el-table-column prop="updateTime" label="上次更新时间" />
    <el-table-column label="更多操作">
      <template #default="scope">
        <n-dropdown
          placement="bottom-start"
          trigger="hover"
          size="small"
          :options="actionOptions"
          @select="handleActionSelect"
        >
          <SettingOutlined
            @mouseenter="recordRequestPathData(scope.row)"
            :style="{ fontSize: '18px' }"
          />
        </n-dropdown>
      </template>
    </el-table-column>
  </el-table>
  <!--//////////////////////////////////////////////////////////////////////////////////////////////-->
  <div class="pagination">
    <div class="bottomButton">
      <n-button ghost color="#409EFF" @click="showAddSocketModal = true">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        添加接口
      </n-button>
      <n-button
        ghost
        color="#E6A23C"
        @click="preUpdateBatch"
        :disabled="canBatchUpdate"
      >
        <template #icon>
          <HighlightOutlined />
        </template>
        批量修改
      </n-button>
      <n-button
        ghost
        color="#F56C6C"
        @click="preDeleteBatch"
        :disabled="canBatchDelete"
      >
        <template #icon>
          <DeleteOutlined />
        </template>
        批量删除
      </n-button>
    </div>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRecords"
      @size-change="axiosGetSocketData"
      @current-change="axiosGetSocketData"
    />
  </div>
  <!--//////////////////////////////////////////////////////////////////////////////////////////////-->
  <div class="functionBox">
    <el-card class="box-card" style="display: inline-block" shadow="never">
      <template #header>
        <div class="card-header">
          <span>高级筛查</span>
          <el-button class="button" text>支持动态筛查-模糊匹配</el-button>
        </div>
      </template>
      <div
        style="
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <span>筛选接口路径</span>
        <el-input
          @input="axiosGetSocketData"
          v-model="filterProperties.requestPath"
          placeholder="输入接口路径"
          clearable
          :style="{ width: '350px' }"
        />
      </div>
      <div
        style="
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <span>筛查操作人</span>
        <el-input
          @input="axiosGetSocketData"
          v-model="filterProperties.updateUser"
          placeholder="输入操作人"
          clearable
          :style="{ width: '350px' }"
        />
      </div>
      <div
        style="
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <span>查找备注</span>
        <el-input
          @input="axiosGetSocketData"
          v-model="filterProperties.note"
          placeholder="输入备注段落"
          clearable
          :style="{ width: '350px' }"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.pagination {
  margin-top: 2vh;
  margin-left: 1vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.pagination > div {
  margin-bottom: 10px;
}
.manageOption:hover {
  color: #000;
}
.footer-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
.functionBox {
  display: flex;
  justify-content: left;
  align-items: flex-start;
  flex-wrap: wrap;
}
.bottomButton {
  width: 400px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>