<template>
  <section id="fxcalc-config">
    <h1>환율 계산기 설정</h1>
    <p>해당 설정을 모두 마치고 저장하기를 누르셔야 설정이 반영됩니다.</p>

    <form @submit.prevent="formSubmit">
      <div class="config-items">
        <div class="input-description">
          <h2 @click="focusInput"><span class="label-beta">베타</span>붙여넣기 감지 후 자동입력</h2>
          <p>불안정하므로 기능이 원하는대로 작동하지 않을 수 있습니다.</p>
        </div>
        <div class="input-items">
          <Switch name="fxcalc-parsePaste" />
        </div>
      </div>

      <div class="config-items">
        <div class="input-description">
          <h2 @click="focusInput">환율 계산 상세 결과 표시</h2>
          <p>더모아프로에서 계산하는 환율 계산 방식을 통한 상세 결과를 표시합니다.</p>
        </div>
        <div class="input-items">
          <Switch name="fxcalc-calcDetails" />
        </div>
      </div>

      <div class="config-items">
        <div class="input-description">
          <h2 @click="focusInput">환율 선택 초기화</h2>
          <p>환율 선택과 관련된 문제가 발생할 경우 다음의 설정을 이용하여 초기화합니다.</p>
        </div>
        <div class="input-items">
          <Switch name="fxcalc-clearSelectedCurrency" />
        </div>
      </div>

      <div class="config-items">
        <div class="input-description">
          <h2 @click="focusInput">공지사항 숨기기 초기화</h2>
          <p>모든 공지사항 숨기기 설정을 초기화합니다.</p>
        </div>
        <div class="input-items">
          <Switch name="fxcalc-reviveAllNotice" />
        </div>
      </div>

      <button type="submit">설정 적용하기</button>
    </form>
    <RouterLink to="/themore-fx/" class="prev">계산기로 돌아가기</RouterLink>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import Switch from '@/components/switch.vue'

import { useUIStore } from '@/stores/ui'

const UIStore = useUIStore()
const router = useRouter()

onMounted(() => {
  if (window.localStorage.getItem('fxcalc-parsePaste') !== null) {
    document.forms[0]['fxcalc-parsePaste'].checked = true
  }

  if (window.localStorage.getItem('fxcalc-calcDetails') !== null) {
    document.forms[0]['fxcalc-calcDetails'].checked = true
  }
})

function focusInput (event) {
  event.target.closest('.config-items').querySelector('input').focus()
}

function formSubmit (event) {
  const form = event.target

  if (form['fxcalc-parsePaste'].checked === true) {
    window.localStorage.setItem('fxcalc-parsePaste', true)
  } else {
    window.localStorage.removeItem('fxcalc-parsePaste')
  }

  if (form['fxcalc-calcDetails'].checked === true) {
    window.localStorage.setItem('fxcalc-calcDetails', true)
  } else {
    window.localStorage.removeItem('fxcalc-calcDetails')
  }

  if (form['fxcalc-clearSelectedCurrency'].checked === true) {
    window.localStorage.removeItem('fxrate-selectedCurrency')
  }

  if (form['fxcalc-reviveAllNotice'].checked === true) {
    const items = Object.keys(localStorage).filter(key => key.indexOf('notice-') >= 0)
    items.forEach(key => window.localStorage.removeItem(key))
  }

  UIStore.Toast.addToast({
    text: '설정 저장이 완료되었습니다'
  })
  router.push('/themore-fx/')
}
</script>

<style lang="postcss">
#fxcalc-config {
  & > h1 {
    @apply text-3xl font-bold;
    @apply dark:text-gray-100;
  }

  & > p {
    @apply text-lg leading-10;
    @apply dark:text-gray-300;
  }

  form {
    @apply pt-6;

    & > button[type="submit"] {
      @apply w-full mt-4 p-4 bg-cyan-600 text-white rounded-xl;
      @apply dark:bg-slate-800;
    }
  }

  .config-items {
    border-top:1px solid;
    @apply py-4 relative flex flex-row border-gray-200 items-center;
    /* @apply sm-mobile:flex-col; */

    h2 {
      @apply text-2xl font-semibold flex text-gray-800;
      @apply dark:text-gray-100;

      & > span.label-beta {
        @apply text-xs self-center text-white bg-red-600 px-1.5 py-0.5 rounded-lg mr-1 font-light;
      }
    }

    p {
      @apply text-base text-gray-600;
      @apply dark:text-gray-300;
    }

    & > .input-description {
      @apply sm-mobile:w-full;
    }

    & > .input-items {
      @apply flex-grow-0;

      & > input[type="checkbox"] {
        @apply p-4 block;
      }

      & > input[type="date"] {
        border:1px solid;
        @apply w-full border-gray-200 p-2 rounded-xl;
        @apply dark:bg-slate-800 dark:border-0 dark:text-white;
      }

      & > button {
        @apply w-full p-2 bg-gray-200 mt-2 rounded-xl text-sm;
        @apply dark:bg-slate-800 dark:text-white;
      }
    }
  }

  a.prev {
    @apply mt-2 w-full p-4 bg-gray-500 block text-center text-white rounded-xl;
    @apply dark:bg-gray-800;
  }
}
</style>