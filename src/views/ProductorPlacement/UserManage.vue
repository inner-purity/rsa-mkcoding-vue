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
  UsergroupAddOutlined,
  LaptopOutlined,
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
  axiosGetUserData();
  setInterval(() => {
    try {
    getUserPageDTOValue().then(() => {
      instance.post("/users/getUserByPage", userPageDTO.value).then((res) => {
        const responseData = res.data;
        userData.value = responseData.data.records;
        totalRecords.value = responseData.data.total;
      });
    });
  } catch (error) {
    ElNotification({
      title: "网络异常",
      message: error,
      type: "error",
    });
    console.log(error);
  }
  },30000)
});
//清除指定对象的所有属性
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
const validatePasswordForce = () => {
  //判断设置密码的合法性
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/;
  return regex.test(addUser.value.password);
};
////////////////////////////////////////////////////////////////////////////////////////////
// 典型代码---可复制重复利用=====对接后端文件上传---图片格式数据
////////////////////////////////////////////////////////////////////////////////////////////
const fileInput = ref(null);

const uploadImage = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const selectedImage = event.target.files[0];
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedTypes.includes(selectedImage.type)) {
    ElNotification({
      title: "图片上传失败",
      message: "图像格式只能为jpg,jpeg,png",
      type: "error",
    });
    event.target.value = ""; // 清空文件选择，让用户重新选择
  } else if (selectedImage.size > 800 * 1024) {
    // 图片大小超过800KB，给出提示或者进行其他处理
    ElNotification({
      title: "图片上传失败",
      message: "图片大小不能超过800kb",
      type: "error",
    });
    event.target.value = ""; // 清空文件选择，让用户重新选择
  } else {
    uploadToServer(selectedImage);
  }
};

const uploadToServer = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    instance
      .post("/users/common/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const responseData = res.data;
        console.log(responseData);
        addUser.value.userLogo = responseData.data;
      });
  } catch (error) {
    ElNotification({
      title: "图片上传失败",
      type: "error",
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////
const userData = ref([]);

const totalRecords = ref(0);
const currentPage = ref(1);
const pageSize = ref(15);

const filterProperties = ref({
  username: null,
  status: null,
  deleting: null,
  updateUser: null,
});
const userPageDTO = ref({
  username: null,
  userLogo: null,
  status: null,
  deleting: null,
  validate: null,
  createTime: null,
  lastLoginTime: null,
  updateUser: null,
  updateTime: null,
  page: null,
  pageSize: null,
});
const user = ref({
  id: null,
  username: null,
  password: null,
  validate: null,
  userLogo: null,
  status: null,
  deleting: null,
  createTime: null,
  lastLoginTime: null,
  updateUser: null,
  updateTime: null,
});
const userList = ref([]);
const userDataLoding = ref(false);

const getUserPageDTOValue = () => {
  return new Promise((resolve) => {
    userPageDTO.value.username = filterProperties.value.username;
    userPageDTO.value.status = filterProperties.value.status;
    userPageDTO.value.deleting = filterProperties.value.deleting;
    userPageDTO.value.updateUser = filterProperties.value.updateUser;
    userPageDTO.value.page = currentPage.value;
    userPageDTO.value.pageSize = pageSize.value;
    resolve();
  });
};
const axiosGetUserData = () => {
  userDataLoding.value = true;
  try {
    getUserPageDTOValue().then(() => {
      instance.post("/users/getUserByPage", userPageDTO.value).then((res) => {
        const responseData = res.data;
        userData.value = responseData.data.records;
        totalRecords.value = responseData.data.total;
        userDataLoding.value = false;
      });
    });
  } catch (error) {
    ElNotification({
      title: "网络异常",
      message: error,
      type: "error",
    });
    userDataLoding.value = false;
    console.log(error);
  }
};

const deletingOptions = ref([
  {
    label: "禁用账户",
    key: 1,
  },
  {
    label: "启用账户",
    key: 0,
  },
]);
const actionOptions = ref([
  {
    label: "权限设置",
    key: 1,
  },
  // {
  //   label: "强制修改",
  //   key: 2,
  // },
  {
    label: "删除账户",
    key: 3,
  },
]);

const recordUserData = (scopeRows) => {
  user.value = { ...scopeRows };
};

const handleDeletingSelect = (key) => {
  user.value.deleting = key;
  userDataLoding.value = true;
  instance.put("/users/updateUserDeleting", user.value).then((res) => {
    userDataLoding.value = false;
    responseDataMessage(res.data);
    axiosGetUserData();
  });
};
//////////////////////////////////////////////////////////////////////////////////
const showSetValidateModal = ref(false);
const showHandleUpdateNote = ref(false);
const showHandleDeleteUser = ref(false);

const handleActionSelect = (key) => {
  switch (key) {
    case 1: {
      showSetValidateModal.value = true;
      break;
    }
    case 2: {
      showHandleUpdateNote.value = true;
      break;
    }
    case 3: {
      showHandleDeleteUser.value = true;
      break;
    }
  }
};
const setValidateOptions = ref([
  {
    label: "平台测试员",
    value: 1,
  },
  {
    label: "平台开发者",
    value: 2,
  },
]);
const setValidateValue = ref();
const handleUpdateValidate = () => {
  user.value.validate = setValidateValue.value;
  userDataLoding.value = true;
  instance.put("/users/updateUserValidate", user.value).then((res) => {
    userDataLoding.value = false;
    responseDataMessage(res.data);
    showSetValidateModal.value = false;
    axiosGetUserData();
  });
};

const handleDeleteUser = () => {
  deleteUserList.value.push(user.value);
  instance.post("/users/deleteBatchUser", deleteUserList.value).then((res) => {
    userDataLoding.value = false;
    responseDataMessage(res.data);
    showHandleDeleteUser.value = false;
    deleteUserList.value.splice(0, deleteUserList.value.length);
    axiosGetUserData();
  });
};
//////////////////////////////////////////////////////////////////////////////////
const handleFilterStatus = (value) => {
  filterProperties.value.status = value;
  axiosGetUserData();
};
const handleFilterDeleting = (value) => {
  filterProperties.value.deleting = value;
  axiosGetUserData();
};
const handleFilterStatusValue = ref("");
const filterStatusOptions = ref([
  {
    label: "登录/挂起",
    value: 1,
  },
  {
    label: "已下线",
    value: 0,
  },
  {
    label: "全部",
    value: "",
  },
]);
const handleFilterDeletingValue = ref("");
const filterDeletingOptions = ref([
  {
    label: "禁用中",
    value: 1,
  },
  {
    label: "许可使用",
    value: 0,
  },
  {
    label: "全部",
    value: "",
  },
]);

//////////////////////////////////////////////////////////////////////////////////
//添加用户
const showAddUserModal = ref(false);
const addUser = ref({
  id: null,
  username: null,
  password: null,
  validate: null,
  userLogo: null,
  status: null,
  deleting: null,
  createTime: null,
  lastLoginTime: null,
  updateUser: null,
  updateTime: null,
});
const addUserList = ref([]);
const handleAddUserData = async () => {
  if (addUser.value.password != null && addUser.value.password != "") {
    if (!validatePasswordForce()) {
      ElNotification({
        title: "密码格式不规范",
        message: "密码只能且必须包含数字字母,长度8~18位,不允许空格",
        type: "info",
      });
      return;
    }
  }
  userDataLoding.value = true;
  addUserList.value.push(addUser.value);
  instance.post("/users/addBatchUser", addUserList.value).then((res) => {
    userDataLoding.value = false;
    showAddUserModal.value = false;
    addUserList.value.splice(0, addUserList.value.length);
    responseDataMessage(res.data);
    axiosGetUserData();
    clearObjProp(addUser.value);
  });
};
//////////////////////////////////////////////////////////////////////////////////
//批量添加用户
const showAddBatchUserModal = ref(false);
const addBatchValidatePassword = ref("");
const addBatchUserNum = ref(1);

const axiosValidateaddBatchPassword = async () => {
  const formData = new FormData();
  formData.append("password", addBatchValidatePassword.value);
  const res = await instance.post("/users/identifyByPassword", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const responseData = res.data;
  if (responseData.code === 0) {
    return false;
  } else if (responseData.code === 1) {
    return true;
  }
};

const handleAddBatchUserData = async () => {
  userDataLoding.value = true;
  if (addBatchValidatePassword.value === "") {
    ElNotification({
      title: "请输入账户密码确认身份!",
      type: "info",
    });
    userDataLoding.value = false;
  } else {
    if (await axiosValidateaddBatchPassword()) {
      for (var i = 0; i < addBatchUserNum.value; i++) {
        addUserList.value.push(addUser.value);
      }
      instance.post("/users/addBatchUser", addUserList.value).then((res) => {
        userDataLoding.value = false;
        showAddBatchUserModal.value = false;
        addUserList.value.splice(0, addUserList.value.length);
        responseDataMessage(res.data);
        axiosGetUserData();
        clearObjProp(addUser.value);
      });
    } else {
      ElNotification({
        title: "密码错误!权限校验失败",
        type: "error",
      });
      userDataLoding.value = false;
      showAddBatchUserModal.value = false;
    }
  }
};
//////////////////////////////////////////////////////////////////////////////////
const canBatchUpdate = ref(true);
const canBatchDelete = ref(true);
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
//////////////////////////////////////////////////////////////////////////////////
//批量删除数据
const deleteUserList = ref([]);
const showDeleteBatchUserModal = ref(false);
const handleDeleteBatchUserData = () => {
  userDataLoding.value = true;
  selectedRows.value.forEach((items) => {
    deleteUserList.value.push(items);
  });
  instance.post("/users/deleteBatchUser", deleteUserList.value).then((res) => {
    userDataLoding.value = false;
    responseDataMessage(res.data);
    axiosGetUserData();
    deleteUserList.value.splice(0, deleteUserList.value.length);
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
//生成随机算式验证---可复用代码
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
//批量修改
const showUpdateBatchModal = ref(false);
const updateBatchDeletingOptions = ref([
  {
    label: "启用账户",
    value: 0,
  },
  {
    label: "禁用账户",
    value: 1,
  },
]);
const updateBatchValidateOptions = ref([
  {
    label: "平台测试员",
    value: 1,
  },
  {
    label: "平台开发者",
    value: 2,
  },
]);
const updateBatchDeletingValue = ref(null);
const updateBatchValidateValue = ref(null);
const preUpdateBatch = () => {
  showUpdateBatchModal.value = true;
};

const updateBatch = () => {
  if (
    updateBatchDeletingValue.value === "" ||
    updateBatchDeletingValue.value === null
  ) {
    updateBatchDeletingValue.value = null;
  } else if (
    updateBatchValidateValue.value === "" ||
    updateBatchValidateValue.value === null
  ) {
    updateBatchValidateValue.value = null;
  }
    userDataLoding.value = true;
    selectedRows.value.forEach((item) => {
      item.deleting = updateBatchDeletingValue.value;
      item.validate = updateBatchValidateValue.value;
    });
    instance.put("/users/updateBatch", selectedRows.value).then((res) => {
      showUpdateBatchModal.value = false;
      userDataLoding.value = false;
      responseDataMessage(res.data);
      axiosGetUserData();
    });
};
</script>

<template>
  <n-modal v-model:show="showSetValidateModal">
    <n-card
      style="width: 600px"
      title="账户权限配置"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div style="text-align: center">
        赋权该账户为&nbsp;&nbsp;
        <el-select
          v-model="setValidateValue"
          class="m-2"
          placeholder="请选择权限"
        >
          <el-option
            v-for="item in setValidateOptions"
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
            @click="showSetValidateModal = false"
          >
            取消
          </n-button>
          <n-button
            ghost
            color="#E6A23C"
            style="margin-left: 10px"
            @click="handleUpdateValidate"
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
  <n-modal v-model:show="showHandleDeleteUser">
    <n-card
      style="width: 600px"
      title="删除用户"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div style="text-align: center">
        确认要删除用户:<span
          style="font-size: 16px; font-weight: 600; margin: 0 10px"
          >[{{ user.username }}]</span
        >吗?
      </div>
      <template #footer>
        <div class="footer-button">
          <n-button
            ghost
            color="#303133"
            style="margin-right: 10px"
            @click="showHandleDeleteUser = false"
          >
            取消
          </n-button>
          <n-button
            ghost
            color="#c45656"
            style="margin-left: 10px"
            @click="handleDeleteUser"
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
      title="批量删除用户数据"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <span style="margin: 10px auto">确定全部删除以下用户吗？</span>
      <el-table :data="selectedRows" style="width: 60%; height: 40vh">
        <el-table-column prop="username" label="用户名" width="180" />
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
            @click="handleDeleteBatchUserData"
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
      <span style="margin: 10px auto">确定全部删除以下用户吗？</span>
      <el-table :data="selectedRows" style="width: 60%; height: 40vh">
        <el-table-column prop="username" label="用户名" width="180" />
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
            @click="handleDeleteBatchUserData"
            ghost
            color="#c45656"
            >确定</n-button
          >
        </div>
      </template>
    </n-card>
  </n-modal>
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <n-modal v-model:show="showAddUserModal">
    <n-card
      style="width: 600px"
      title="添加用户"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div style="margin-bottom: 10px">
        <span style="margin-bottom: 10px">用户名 (选填)</span>
        <el-input v-model="addUser.username" placeholder="设置用户名" />
      </div>
      <div style="margin-bottom: 10px">
        <span style="margin-bottom: 10px">密码 (选填)</span>
        <el-input
          type="password"
          placeholder="设置密码"
          v-model="addUser.password"
          maxlength="18"
          show-password
          clearable
          autocomplete
        />
      </div>

      <div style="margin-bottom: 10px">
        <span style="margin-bottom: 10px">头像 (选填)</span>
        <div class="userInfoLogoContainer" @click="uploadImage">
          <img
            v-if="addUser.userLogo"
            :src="addUser.userLogo"
            class="userInfoLogo"
          />
          <el-icon v-if="!addUser.userLogo" size="40" color="#ccc"
            ><Plus
          /></el-icon>
        </div>
        <input
          type="file"
          ref="fileInput"
          accept=".jpg, .jpeg, .png"
          style="display: none"
          @change="handleFileChange"
        />
      </div>
      <div
        :bordered="false"
        style="margin-top: 10px; background-color: #ccc; width: 100%"
      >
        <span style="font-weight: 600"
          >* 以上信息选择性填写，如有未填项，则后端自动生成 <br />
          <br />
          用户名默认: 用户+UUID <br />
          <br />
          密码默认: rsa123456 <br />
          <br />
          头像默认: 随机生成
        </span>
      </div>
      <template #footer>
        <div class="footer-button">
          <n-button
            ghost
            color="#303133"
            style="margin-right: 10px"
            @click="showAddUserModal = false"
          >
            取消
          </n-button>
          <n-button
            ghost
            color="#409EFF"
            style="margin-left: 10px"
            @click="handleAddUserData"
          >
            添加
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
  <n-modal v-model:show="showAddBatchUserModal">
    <n-card
      style="width: 600px"
      title="批量添加用户"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div style="margin-bottom: 20px">
        <span style="margin-bottom: 10px">账户密码</span>
        <el-input
          type="password"
          placeholder="输入您的账户密码以确认身份"
          v-model="addBatchValidatePassword"
          maxlength="18"
          show-password
          clearable
          autocomplete
        />
      </div>
      <div style="margin-bottom: 10px">
        批量添加用户的数量 (一次最多添加15个用户)<br />
        <el-input-number
          v-model="addBatchUserNum"
          :min="1"
          :max="15"
          @change="handleChange"
        />
      </div>
      <div
        :bordered="false"
        style="margin-top: 10px; background-color: #ccc; width: 100%"
      >
        <span style="font-weight: 600"
          ><span style="color: #c45656">* 后端全自动生成</span> <br />
          <br />
          用户名默认: 用户+UUID <br />
          <br />
          密码默认: rsa123456 <br />
          <br />
          头像默认: 随机生成
        </span>
      </div>
      <template #footer>
        <div class="footer-button">
          <n-button
            ghost
            color="#303133"
            style="margin-right: 10px"
            @click="showAddBatchUserModal = false"
          >
            取消
          </n-button>
          <n-button
            ghost
            color="#409EFF"
            style="margin-left: 10px"
            @click="handleAddBatchUserData"
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
      以下是本次修改的用户列表
      <el-table :data="selectedRows" style="width: 100%; height: 40vh">
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="deleting" width="135">
          <template #header>
            <span>账号状态</span>
          </template>
          <template #default="scope">
            <template v-if="scope.row.deleting === 1">
              <div
                style="
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  background-color: red;
                  border-radius: 4px;
                  padding: auto 0;
                "
              ></div>
              禁用中
            </template>
            <template v-else-if="scope.row.deleting === 0">
              <div
                style="
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  background-color: #529b2e;
                  border-radius: 4px;
                  padding: auto 0;
                "
              ></div>
              许可使用
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
            v-model="updateBatchDeletingValue"
            class="m-2"
            placeholder="启用/禁用 账号"
            clearable
          >
            <el-option
              v-for="item in updateBatchDeletingOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="updateBatchValidateValue"
            class="m-2"
            placeholder="分配权限"
            clearable
          >
            <el-option
              v-for="item in updateBatchValidateOptions"
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
    v-loading="userDataLoding"
    element-loading-text="数据飞速赶来......"
    :data="userData"
    height="55vh"
    max-height="55vh"
    style="width: 100%"
    :header-row-style="{ color: '#000', fontSize: '14px' }"
    table-layout="auto"
    empty-text="暂无相关的用户数据"
  >
    <el-table-column type="selection" width="45" />
    <el-table-column prop="username" label="用户名" width="135">
      <template #default="scope">
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="true">
          {{ scope.row.username }}
        </n-ellipsis>
      </template>
    </el-table-column>
    <el-table-column prop="userLogo" label="头像" width="90">
      <template #default="scope">
        <el-avatar :size="36" :src="scope.row.userLogo" />
      </template>
    </el-table-column>
    <el-table-column prop="status" width="115">
      <template #header>
        <span>登录状态</span>
        <n-popselect
          :options="filterStatusOptions"
          size="medium"
          scrollable
          @update:value="handleFilterStatus"
          v-model:value="handleFilterStatusValue"
        >
          <FilterFilled :style="{ marginLeft: '10px', cursor: 'pointer' }" />
        </n-popselect>
      </template>
      <template #default="scope">
        <span v-if="scope.row.status === 1"> <LaptopOutlined style="margin-right: 8px; font-size: 14px; color: limegreen"/><span>登录/挂起</span></span>
        <span v-if="scope.row.status === 0"> <LaptopOutlined style="margin-right: 8px; font-size: 14px; color: #3e3d3d"/><span>已下线</span></span>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" width="155" />
    <el-table-column prop="lastLoginTime" label="上次登录" width="155" />
    <el-table-column prop="deleting" width="135">
      <template #header>
        <span>账号状态</span>
        <n-popselect
          :options="filterDeletingOptions"
          size="medium"
          scrollable
          @update:value="handleFilterDeleting"
          v-model:value="handleFilterDeletingValue"
        >
          <FilterFilled :style="{ marginLeft: '10px', cursor: 'pointer' }" />
        </n-popselect>
      </template>
      <template #default="scope">
        <template v-if="scope.row.deleting === 1">
          <div
            style="
              display: inline-block;
              width: 8px;
              height: 8px;
              background-color: red;
              border-radius: 4px;
              padding: auto 0;
            "
          ></div>
          禁用中
        </template>
        <template v-else-if="scope.row.deleting === 0">
          <div
            style="
              display: inline-block;
              width: 8px;
              height: 8px;
              background-color: #529b2e;
              border-radius: 4px;
              padding: auto 0;
            "
          ></div>
          许可使用
        </template>
        <n-dropdown
          placement="bottom-start"
          trigger="hover"
          size="small"
          :options="deletingOptions"
          @select="handleDeletingSelect"
        >
          <CaretDownOutlined
            @mouseenter="recordUserData(scope.row)"
            :style="{ fontSize: '16px' }"
          />
        </n-dropdown>
      </template>
    </el-table-column>
    <el-table-column prop="updateUser" label="上次操作人" width="135">
      <template #default="scope">
        <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="true">
          {{ scope.row.updateUser }}
        </n-ellipsis>
      </template>
    </el-table-column>
    <el-table-column prop="updateTime" label="操作时间" width="155" />
    <el-table-column label="更多操作" width="115">
      <template #default="scope">
        <n-dropdown
          placement="bottom-start"
          trigger="hover"
          size="small"
          :options="actionOptions"
          @select="handleActionSelect"
        >
          <SettingOutlined
            @mouseenter="recordUserData(scope.row)"
            :style="{ fontSize: '18px' }"
          />
        </n-dropdown>
      </template>
    </el-table-column>
  </el-table>
  <!--//////////////////////////////////////////////////////////////////////////////////////////////-->
  <div class="pagination">
    <div class="bottomButton">
      <n-button ghost color="#409EFF" @click="showAddUserModal = true">
        <template #icon>
          <PlusCircleOutlined />
        </template>
        添加用户
      </n-button>
      <n-button ghost color="#626aef" @click="showAddBatchUserModal = true">
        <template #icon>
          <UsergroupAddOutlined />
        </template>
        批量添加用户
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
      :page-sizes="[15, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRecords"
      @size-change="axiosGetUserData"
      @current-change="axiosGetUserData"
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
        <span>用户名查找</span>
        <el-input
          @input="axiosGetUserData"
          v-model="filterProperties.username"
          placeholder="输入用户名"
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
          @input="axiosGetUserData"
          v-model="filterProperties.updateUser"
          placeholder="输入操作人"
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
  width: 500px;
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

.userInfoLogoContainer {
  width: 180px;
  height: 180px;
  border: 2px dotted #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
.userInfoLogoContainer:hover {
  border: 2px dotted #409eff;
  cursor: pointer;
}
:deep().userInfoLogo {
  width: 170px;
  height: 170px;
  object-fit: cover; /* 让图像按比例铺满容器 */
  object-position: center; /* 将图像置中 */
}
</style>