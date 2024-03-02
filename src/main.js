import App from "./App.vue";
import { createApp } from "vue";

import router from "./router";

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const pinia = createPinia();
const app = createApp(App);
pinia.use(piniaPluginPersistedstate);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router);
app.use(pinia);
app.use(Antd);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount("#app");
