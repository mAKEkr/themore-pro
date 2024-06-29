import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './style.css'

if (
  localStorage.getItem('ui-theme') === 'dark' ||
  (
    !('ui-theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.mount('#app')
