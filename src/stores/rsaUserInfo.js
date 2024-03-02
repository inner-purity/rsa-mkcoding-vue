import { defineStore } from "pinia";
import { ref } from "vue";

export const useRsaUserInfoStore = defineStore("UsingRsaUserInfoStore", () => {
  const userLoginInfo = ref({
    id: null,
    username: null,
    password: null,
    validate: null,
    userLogo: null,
    status: null,
    deleting: null,
    createTime: null,
    lastLoginTime: null,
    token: null,
  });
  return {
    userLoginInfo,
  };
});
