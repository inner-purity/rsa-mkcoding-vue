import {defineStore} from 'pinia'
import { ref } from 'vue'

export const useRsaHistoryStore = defineStore('rsaHistoryStore',()=>{
    const drawerShow = ref(false);
    return {
        drawerShow
    }
})