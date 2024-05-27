<template>
  <div id="ui-toast" v-if="Store.Toast.list.length > 0">
    <TransitionGroup name="toast" appear>
      <div class="toast-items" v-for="data in Store.Toast.list" :key="data.timestamp">
        {{ data.text }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { TransitionGroup } from 'vue'
import { useUIStore } from '@/stores/ui'

const Store = useUIStore()
</script>

<style lang="postcss">
#ui-toast {
  @apply fixed bottom-8 left-0 flex items-center justify-end flex-col -z-0 h-0 w-full;

  .toast-enter-from {
    @apply -translate-x-16 opacity-0;
  }

  .toast-leave-to {
    @apply translate-x-16 opacity-0;
  }

  & > .toast-items {
    @apply text-center w-auto float-left
      bg-black bg-opacity-80 text-white
      px-4 py-3 mt-4 rounded-xl
      transition-all z-10;

    @apply after:clear-both;
  }
}
</style>