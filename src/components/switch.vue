<template>
  <label class="ui-switch">
    <input type="checkbox" :name="props.name" v-model="value" />
    <small></small>
    <span>
      <slot />
    </span>
  </label>
</template>

<script setup>
import { defineModel } from 'vue'

const props = defineProps(['name'])
const value = defineModel()
</script>

<style lang="postcss">
label.ui-switch {
  @apply inline-flex relative;

  & > input[type="checkbox"] {
    border: 1px solid transparent;
    @apply appearance-none w-0 h-0
      m-4 -z-10 absolute
      bg-transparent;

    &:checked ~ small {
      @apply bg-cyan-600 border-cyan-700;
    }

    &:checked ~ small:before {
      @apply translate-x-6;
    }
  }

  & > small { /*  */
    border:1px solid;
    @apply inline-block w-12 h-6 m-0 p-0
      box-content border-opacity-0 rounded-2xl
      bg-gray-400 border-gray-300;
    @apply transition-all;

    &::before {
      content: "";
      
      @apply block absolute box-border bg-white w-6 h-6 shadow-md rounded-2xl;
      @apply transition-transform;
    }
  }

  & > span {
    @apply ml-2;
  }
}
</style>