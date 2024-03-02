import { defineStore } from "pinia";
import { ref } from "vue";

export const useTipsVisibleStore = defineStore("UsingTipsVisibleStore", () => {
  const tipsShow = ref(true);
  return {
    tipsShow,
  };
});
