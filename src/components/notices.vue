<template>
  <div class="component-notice" v-if="isHide === false">
    <button v-if="props.noticeId !== undefined"
      @click.prevent="hideNotice">
      &times;
    </button>
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

let isHide = ref(false)
const props = defineProps(['noticeId'])

onMounted(() => {
  if (props.noticeId !== undefined) {
    const hideStatus = window.localStorage.getItem('notice-' + props.noticeId)
    if (hideStatus !== null) {
      if (new Date().getTime() > hideStatus) {
        window.localStorage.removeItem('notice-' + props.noticeId)
      } else {
        isHide.value = true
      }
    }
  }
})

function hideNotice () {
  window.localStorage.setItem('notice-' + props.noticeId, new Date().getTime() + 7 * 86400 * 1000)
  isHide.value = true
}
</script>

<style lang="postcss">
.component-notice {
  @apply relative p-4 bg-gray-100 rounded-xl border-2 break-words;
  @apply dark:bg-slate-600 dark:border-gray-800 dark:text-white;

  & > button {
    @apply absolute right-2 top-2 w-6 h-6 text-lg leading-6 text-gray-700 z-10;
  }

  p {
    @apply relative pl-6;

    & > span.icon {
      @apply absolute left-0;
    }

    & + p {
      @apply mt-2;
    }
  }
}
</style>