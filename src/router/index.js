import { createRouter, createWebHistory } from 'vue-router'
// import IndexPage from '../pages/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        return {
          path: '/themore-fx'
        }
      }
    },
    {
      path: '/fx-calc',
      redirect: () => {
        return {
          path: '/themore-fx'
        }
      }
    },
    {
      path: '/themore-fx',
      name: 'ThemoreFx',
      meta: {
        title: '더모아계산기'
      },
      children: [
        {
          path: '',
          name: 'ThemoreFxPage',
          meta: {
            title: '더모아계산기'
          },
          component: () => import('../pages/themore/ThemoreFx.vue')
        },
        {
          path: 'config',
          name: 'ThemoreFxConfig',
          meta: {
            title: '더모아계산기 설정'
          },
          component: () => import('../pages/config/ThemoreFx.vue')
        }
      ]
    },
  ]
})

const titleSuffix = '더모아프로'

router.beforeEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + titleSuffix
  } else {
    document.title = '더모아프로 - themore.pro'
  }

  const currentCanonicalURL = import.meta.env.VITE_APP_HOST + to.path
  const canonicalElement = document.querySelector('head > link[rel="canonical"]')
  if (canonicalElement === null) {
    const canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    canonical.setAttribute('href', currentCanonicalURL)
    document.head.appendChild(canonical)
  } else {
    canonicalElement.setAttribute('href', currentCanonicalURL)
  }
})

export default router
