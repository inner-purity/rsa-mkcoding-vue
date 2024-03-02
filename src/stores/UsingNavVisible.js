import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsingNavVisibleStore = defineStore(
  "UsingNavVisibleStore",
  () => {
    const usingNavshow = ref(true);
    return {
      usingNavshow,
    };
  }
);
