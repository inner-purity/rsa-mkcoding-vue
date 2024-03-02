import { defineStore } from "pinia";
import { ref } from "vue";

export const useIsTypecodingStore = defineStore("useIsTypecodingStore", () => {
  const TypeCodingOnOff = ref(false);
  return {
    TypeCodingOnOff,
  };
});