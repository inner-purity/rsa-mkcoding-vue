import { useRsaUserInfoStore } from "../stores/rsaUserInfo";
const rsaUserInfoStore = useRsaUserInfoStore();
export default function clearUserInfo () {
    rsaUserInfoStore.userLoginInfo.createTime = null;
    rsaUserInfoStore.userLoginInfo.deleting = null;
    rsaUserInfoStore.userLoginInfo.id = null;
    rsaUserInfoStore.userLoginInfo.lastLoginTime = null;
    rsaUserInfoStore.userLoginInfo.password = null;
    rsaUserInfoStore.userLoginInfo.status = null;
    rsaUserInfoStore.userLoginInfo.token = null;
    rsaUserInfoStore.userLoginInfo.userLogo = null;
    rsaUserInfoStore.userLoginInfo.username = null;
    rsaUserInfoStore.userLoginInfo.validate = null;
}