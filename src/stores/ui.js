import { ref } from 'vue'
import { defineStore } from 'pinia'
import { delay } from '@/modules/common'

export const useUIStore = defineStore('toast', () => {
  const Toast = {
    list: ref([]),
    addToast: async (data) => {
      const time = 3000
      Toast.list.value.push({
        text: data.text,
        time,
        timestamp: new Date().getTime() + '' + String(Math.random()).split('.')[1]
      })
  
      await delay(time)
      Toast.list.value.shift()
    }
  }

  const Modal = {
    name: '',
    status: ref(false),
    active: (name) => {
      Modal.name = name
      Modal.status.value = true
    },
    deactive: () => {
      Modal.name = ''
      Modal.status.value = false
    }
  }

  return { Toast, Modal }
})
