<template>
  <Transition name="ui-modal">
    <div id="ui-modal"
      v-if="Store.Modal.status === true && props.name === Store.Modal.name"
      @click.self="Store.Modal.deactive()">
      <div class="modal-container">
        <header class="modal-header">
          <h1><slot name="header"></slot></h1>
          <button @click.prevent="Store.Modal.deactive()">&times;</button>
        </header>

        <slot></slot>

        <footer class="modal-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup>
  // eslint-disable-next-line no-unused-vars
  import { Transition, watch } from 'vue'
  import { useUIStore } from '@/stores/ui'

  const props = defineProps(['name'])
  const Store = useUIStore()

  watch(() => Store.Modal.status, (changeValue) => {
    if (changeValue === true) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  })
</script>

<style lang="postcss">
#ui-modal {
  @apply fixed top-0 left-0 w-full h-full z-10
    bg-black bg-opacity-90 backdrop-blur-sm
    flex items-center justify-center;

  div.modal-container {
    @apply bg-white m-4 w-full max-w-screen-sm rounded-xl overflow-hidden;
    @apply dark:bg-gray-950;
  }

  header.modal-header {
    @apply flex p-4 bg-cyan-600 items-center;
    @apply dark:bg-slate-800;

    & > h1 {
      @apply font-semibold text-xl text-white ml-2;
    }

    & > button {
      @apply ml-auto min-w-8 h-8 text-cyan-600 bg-white rounded-xl;
      @apply dark:text-slate-800;
      font-family:'Pretendard';
    }
  }

  footer.modal-footer {
    border-top:1px solid;
    @apply px-4 py-3 pl-8 border-gray-300 bg-gray-100;
    @apply dark:bg-gray-900 dark:border-gray-700;

    & > ul {
      @apply list-decimal text-sm text-gray-600;
      @apply dark:text-gray-400;
    }
  }
}

.ui-modal-enter-active,
.ui-modal-leave-active {
  @apply transition-all;
}

.ui-modal-enter-from,
.ui-modal-leave-to {
  @apply opacity-0 backdrop-blur-0;
}
</style>