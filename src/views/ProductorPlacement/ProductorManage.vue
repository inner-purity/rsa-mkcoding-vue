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
  CoffeeOutlined,
  CrownOutlined,
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
      instance.post("/users/getAdminByPage", userPageDTO.value).then((res) => {
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
const pageSize = ref(10);

const filterProperties = ref({
  username: null,
  status: null,
  validate: null,
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
    userPageDTO.value.validate = filterProperties.value.validate;
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
      instance.post("/users/getAdminByPage", userPageDTO.value).then((res) => {
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

const validateOptions = ref([
  {
    label: "设为平台开发者",
    key: 2,
  },
  {
    label: "撤为普通用户",
    key: 0,
  },
]);
const actionOptions = ref([
  {
    label: "简言传信",
    key: 1,
    disabled: true,
  },
]);

const recordUserData = (scopeRows) => {
  user.value = { ...scopeRows };
};

const handleValidateSelect = (key) => {
  user.value.validate = key;
  userDataLoding.value = true;
  instance.put("/users/updateUserValidate", user.value).then((res) => {
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
const handleFilterValidate = (value) => {
  filterProperties.value.validate = value;
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
///////////以上待开发//////////////
const handleFilterValidateValue = ref("");
const filterValidateOptions = ref([
  {
    label: "平台测试员",
    value: 1,
  },
  {
    label: "平台开发者",
    value: 2,
  },
  {
    label: "全部",
    value: "",
  },
]);
</script>

<template>
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
    <el-table-column prop="username" label="开发者" width="135">
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
    <el-table-column prop="validate" width="135">
      <template #header>
        <span>权限等级</span>
        <n-popselect
          :options="filterValidateOptions"
          size="medium"
          scrollable
          @update:value="handleFilterValidate"
          v-model:value="handleFilterValidateValue"
        >
          <FilterFilled :style="{ marginLeft: '10px', cursor: 'pointer' }" />
        </n-popselect>
      </template>
      <template #default="scope">
        <template v-if="scope.row.validate === 2">
          <CrownOutlined />
          平台开发者
        </template>
        <template v-else-if="scope.row.validate === 1">
          <CoffeeOutlined />
          平台测试员
        </template>
        <n-dropdown
          v-if="scope.row.validate < 2"
          placement="bottom-start"
          trigger="hover"
          size="small"
          :options="validateOptions"
          @select="handleValidateSelect"
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
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRecords"
      @size-change="axiosGetUserData"
      @current-change="axiosGetUserData"
    />
  </div>
  <!--//////////////////////////////////////////////////////////////////////////////////////////////-->
</template>

<style scoped>
.pagination {
  margin: 2vh;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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