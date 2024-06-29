<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header id="app-header">
    <div class="width-container">
      <h1><img src="/assets/img/icons/128.png" />더모아프로<span class="max-sm-mobile:hidden"> - Themore.pro</span></h1>
      <nav>
        <RouterLink to="/themore-fx">더모아계산기</RouterLink>
        <button>
          <IconSun v-if="darkMode === true" @click="themeChange" />
          <IconMoon v-if="darkMode === false" @click="themeChange" />
        </button>
      </nav>
    </div>
  </header>
  <div id="app-content">
    <div class="width-container">
      <slot></slot>
    </div>
  </div>
  <footer id="app-footer">
    <div class="width-container">
      <nav>
        <a href="https://github.com/mAKEkr/themore-pro" target="_blank">Github Repository</a>
      </nav>
      <p>2024 Themore.pro</p>
    </div>
  </footer>
</template>

<script setup>
  import { RouterLink } from 'vue-router'
  import { ref, onMounted } from 'vue'

  import IconSun from '@/assets/icons/sun.svg?component'
  import IconMoon from '@/assets/icons/moon.svg?component'

  const darkMode = ref(false)

  onMounted(() => {
    if (document.documentElement.classList.contains('dark')) {
      darkMode.value = true
    }
  })

  function themeChange () {
    if (darkMode.value === true) {
      window.localStorage.setItem('ui-theme', 'light')
      document.documentElement.classList.remove('dark')
      darkMode.value = false
    } else {
      window.localStorage.setItem('ui-theme', 'dark')
      document.documentElement.classList.add('dark')
      darkMode.value = true
    }
  }
</script>

<style lang="postcss">
body {
  @apply dark:bg-gray-900;
}

.width-container {
  @apply w-full max-w-3xl mx-auto p-4 ;
}

#app-header {
  @apply w-full
    bg-cyan-600 text-white;
  @apply dark:bg-slate-800;

  h1 {
    @apply flex text-2xl items-center;

    & > img {
      @apply inline w-12 mr-3 align-middle;
    }
  }

  nav {
    @apply mt-4 -mb-4 flex items-center;

    & > a {
      @apply p-4 inline-block text-base;
      @apply max-sm:text-sm py-3 px-4;
    }

    & > .router-link-active {
      @apply bg-white text-cyan-700 font-bold rounded-t-xl;
      @apply dark:bg-gray-900 dark:text-white;
    }

    & > img {
      @apply text-white;
    }

    & > button {
      @apply p-2 ml-auto;
    }
  }
}

#app-footer {
  @apply bg-gray-200 py-4 text-gray-600;
  @apply dark:bg-gray-800 dark:text-gray-400;

  & > .width-container {
    @apply flex items-center justify-center;
    @apply max-sm:flex-col items-baseline;
  }

  & nav {
    @apply mr-auto;
  }

  a, p {
    @apply px-4 py-3 block;
  }
}
</style>