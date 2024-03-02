import axios from "axios";
import { ElNotification } from "element-plus";
import clearUserInfo from "../hooks/clearUserInfo";
import router from "../router";
const instance = axios.create({
  baseURL: "https://innerpurity.top:2599",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  timeout: 15000,
});
// https://innerpurity.top:2599
//http://localhost:2599
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    let token = null;
    // 在发送请求之前做什么
    if (localStorage.getItem("rsaUserInfo")) {
      token = JSON.parse(localStorage.getItem("rsaUserInfo")).token;
    }
    if (token) {
      config.headers["token"] = `${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.data.code === 4031) {
      ElNotification({
        title: `${response.data.msg}`,
        message: "如有疑问，请联系开发者处理",
        type: "error",
        offset: 50,
      });
      localStorage.removeItem("rsaUserInfo");
      clearUserInfo();
      Promise.reject();
    } else if (response.data.code === 5021) {
      ElNotification({
        title: `${response.data.msg}`,
        message: "接口维护中，暂停访问",
        type: "error",
        offset: 50,
      });
      Promise.reject();
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      ElNotification({
        title: "登录超时，请先登录",
        type: "error",
        offset: 50,
      });
      localStorage.removeItem("rsaUserInfo");
      clearUserInfo();
    } else if(error.response && error.response.status === 404){
      router.push({name: "404page"})
    }
    else {
      console.error(error);
    }
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default instance;
