import axios from "../axios/axios"
import { useRsaUserInfoStore } from "../stores/rsaUserInfo";
const rsaUserInfoStore = useRsaUserInfoStore();

export function copyUserInfo(
  id,
  username,
  password,
  validate,
  userLogo,
  status,
  deleting,
  createTime,
  lastLoginTime,
  token
) {
  rsaUserInfoStore.userLoginInfo.id = id;
  rsaUserInfoStore.userLoginInfo.username = username;
  rsaUserInfoStore.userLoginInfo.userLogo = userLogo;
  rsaUserInfoStore.userLoginInfo.validate = validate;
  rsaUserInfoStore.userLoginInfo.token = token;
  rsaUserInfoStore.userLoginInfo.status = status;
  rsaUserInfoStore.userLoginInfo.lastLoginTime = lastLoginTime;
  rsaUserInfoStore.userLoginInfo.password = password;
  rsaUserInfoStore.userLoginInfo.deleting = deleting;
  rsaUserInfoStore.userLoginInfo.createTime = createTime;
}

export  async function getAndStoreUserInfo(){
    axios.get("users/getUserInfo").then((res) => {
      const responseData = res.data;
      copyUserInfo(
        responseData.data.id,
        responseData.data.username,
        responseData.data.password,
        responseData.data.validate,
        responseData.data.userLogo,
        responseData.data.status,
        responseData.data.deleting,
        responseData.data.createTime,
        responseData.data.lastLoginTime
      );
    });
}
