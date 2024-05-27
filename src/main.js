import { createApp } from 'vue'
import { createClient } from '@supabase/supabase-js'
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
const Supabase = createClient(
  'https://qxwtprpeobznuvulfvgn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d3RwcnBlb2J6bnV2dWxmdmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQzMDI5NjMsImV4cCI6MjAxOTg3ODk2M30.Qw2ijlhoS_LhYWmJgz3BkBgTNYfwdxlGcHSuXHQRnBM'
)

app.use(createPinia())
app.use(router)
app.use({
  install: (app) => {
    app.provide('supabase', Supabase)
  }
})

app.mount('#app')
