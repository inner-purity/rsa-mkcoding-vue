<script setup>
import { useRsaHistoryStore } from "../../stores/rsaHistory";
import { ref } from "vue";
import { ElMessage } from "element-plus";
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
      historyData.value = JSON.parse(localStorage.getItem("keyHistoryStorage"));
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
              new Date(item.storeTime).getTime() <= selectDate.value[1]
            );
          });
        }
      } else {
        filterHistoryData.value = historyData.value.filter((item) => {
          return (
            item.keyForce === keyForceLike.value &&
            item.keyType === keyTypeLike.value &&
            selectDate.value[0] <= new Date(item.storeTime).getTime() &&
            new Date(item.storeTime).getTime() <= selectDate.value[1]
          );
        });
      }
    } else if (functionLike.value === "加密解密") {
      /////////////////   待开发   //////////////////
      return;
    }
  }
};
const handleAllSearch = () => {
  historyData.value = JSON.parse(localStorage.getItem("keyHistoryStorage"));
  filterHistoryData.value = historyData.value;
};
//////////////////////////////////////////////////////////////////////////////////
const detailShow = ref(false);
const detailPublicKey = ref("");
const detailPrivateKey = ref("");
const detailPrivatePassword = ref("");
const handleDetail = (scopeRow) => {
  detailShow.value = true;
  detailPublicKey.value = scopeRow.publicKeyCodeStore;
  detailPrivateKey.value = scopeRow.privateKeyCodeStore;
  detailPrivatePassword.value = scopeRow.privatePassword;
};
const handleDelete = (scopeRow, scopeIndex) => {
  filterHistoryData.value.splice(scopeIndex, 1);
  historyData.value = historyData.value.filter((item) => {
    return item.publicKeyCodeStore !== scopeRow.publicKeyCodeStore;
  });
  localStorage.setItem("keyHistoryStorage", JSON.stringify(historyData.value));
  deleteSuccessMessage();
};
const deleteSuccessMessage = () => {
  ElMessage({
    message: "删除成功!",
    grouping: true,
    center: true,
    type: "success",
  });
};
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
</script>

<template>
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <el-drawer
    v-model="detailShow"
    direction="rtl"
    size="40%"
    :with-header="false"
    :append-to-body="true"
  >
    <h3 class="detail-h3-style">
      私钥密码&nbsp;记录
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
  </el-drawer>
  <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

  <el-drawer
    v-model="rsaHistoryStore.drawerShow"
    direction="ttb"
    :show-close="false"
    :close-on-click-modal="false"
    size="100%"
    :with-header="false"
    :append-to-body="true"
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
        <el-table :data="filterHistoryData" height="500" style="width: 90%">
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
              <el-button size="default" @click="handleDetail(scope.row)"
                >详情</el-button
              >
              <el-popconfirm
                confirm-button-text="继续删除"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="敏感数据，谨慎删除!"
                @confirm="handleDelete(scope.row, scope.$index)"
              >
                <template #reference>
                  <el-button size="default" type="danger">删除记录</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="rsaHistoryStore.drawerShow = false">关闭</el-button>
      </div>
    </template>
  </el-drawer>
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
</style>