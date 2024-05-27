<template>
  <div id="fxcalc-select-date">
    📆 계산 기준 일자 선택하기
    <div class="selector">
      <a
        :href="'/themore-fx/?date=' + calcDay(-1, date)"
        :class="{disabled: availableDate().min === date}"
        @click.prevent="date = calcDay(-1, date)"
      >
        &lt;
      </a>
      <input type="date"
        v-model="date"
        :min="availableDate().min"
        :max="availableDate().max"
        />
      <a
        :href="'/themore-fx/?date=' + calcDay(1, date)"
        :class="{disabled: availableDate().max === date}"
        @click.prevent="date = calcDay(1, date)"
      >
        &gt;
      </a>
    </div>
    <div class="quick-buttons">
      <a :href="'/themore-fx/?date=' + calcDay(-7)"
        @click.prevent="date = calcDay(-7)"
      >
        &lt;&lt; 일주일 전
      </a>
      <a :href="'/themore-fx/?date=' + calcDay(-4)"
        @click.prevent="date = calcDay(-4)"
      >
        &lt; 4일 전
      </a>
      <a :href="'/themore-fx/?date=' + calcDay(0)"
        @click.prevent="date = calcDay(0)"
      >
        오늘
      </a>
    </div>
    <p class="alert-different-date" v-if="date !== calcDay(0)">
      <span class="icon">❗</span>
      조회일자가 오늘과 다릅니다. 계산 및 결제에 유의하시기 바랍니다.
    </p>
  </div>
</template>

<script setup>
  import { makeDateCode } from '@/modules/common'
  import { useFxCalcStore } from '@/stores/themore-fx'

  const date = defineModel('date')
  const Store = useFxCalcStore()
  const availableDate = () => ({
    min: Store.availableDates[Store.availableDates.length - 1],
    max: Store.availableDates[0]
  })

  function calcDay (number, date = new Date()) {
    return makeDateCode(new Date(date).getTime() + number * 86400 * 1000)
  }
</script>

<style lang="postcss">
  #fxcalc-select-date {
    @apply w-full p-4 mt-2 bg-orange-100 bg-opacity-80 rounded-xl;
    @apply dark:bg-opacity-100 dark:bg-slate-700 dark:border-0 dark:text-white;

    .selector {
      @apply inline-block;
      @apply max-sm:block max-sm:mt-2 max-sm:text-center;

      & > a:first-child {
        @apply ml-2;
      }

      & > input[type="date"] {
        @apply p-2 rounded-2xl mx-2;
        @apply dark:bg-slate-800 dark:text-white;
      }

      & > a.disabled {
        @apply pointer-events-none cursor-none opacity-60;
      }
    }

    a {
      @apply inline-block py-2 px-3 rounded-xl cursor-pointer bg-white;
      @apply dark:bg-slate-800;
    }

    .quick-buttons {
      @apply inline-block ml-4 border-orange-200 border-0;
      @apply max-md:block max-md:pt-2 max-md:mt-2 max-md:ml-0 max-md:border-t-2 max-md:text-center;
      @apply dark:border-gray-500;

      & > a + a {
        @apply ml-2;
      }
    }

    & > p {
      @apply mt-4;
    }
  }
</style>