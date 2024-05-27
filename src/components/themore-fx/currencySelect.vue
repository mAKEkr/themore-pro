<template>
  <nav id="fxcalc-select-currency">
    <a class="currency-display-modal"
      @click.prevent="UIStore.Modal.active('CurrencySelect')">
      환율 추가하기 (총 {{ config.availableCurrency.length }}종)
    </a>
    <a
      :class="{active: props.selectCurrency === 'USD'}"
      :title="config.currencyDB.USD.name"
      @click.prevent="props.changeCurrencyAction('USD')"
    >
      <i class="emoji">{{ config.currencyDB.USD.emoji }}</i> USD
    </a>
    <a v-for="currency in props.currencyList.filter(currency => currency !== 'USD')"
      :title="config.currencyDB[currency].name"
      :key="currency"
      :class="{active: currency === props.selectCurrency, hide: Store.data?.rate?.USD.hasOwnProperty(currency) === false}"
      :href="'/themore-fx/?date=' + props.selectDate + '&currency=' + currency"
      @click.prevent="props.changeCurrencyAction(currency)"
    >
      <i class="emoji">{{ config.currencyDB[currency].emoji }}</i> {{ currency }}
    </a>
  </nav>
</template>

<script setup>
  import { config } from '@/modules/common'
  import { useFxCalcStore } from '@/stores/themore-fx'
  import { useUIStore } from '@/stores/ui'

  const props = defineProps([
    'changeCurrencyAction', 'selectCurrency', 'currencyList', 'selectDate'
  ])
  const Store = useFxCalcStore()
  const UIStore = useUIStore()
</script>

<style lang="postcss">
#fxcalc-select-currency {
  @apply grid grid-cols-4 text-center gap-2 mt-4 max-h-72 overflow-y-scroll;
  @apply sm:grid-cols-6;
  @apply dark:bg-gray-900;

  & > a.currency-display-modal {
    @apply w-full border-gray-400 col-span-4 sticky top-0 bg-white;
    @apply dark:bg-slate-800 dark:text-white dark:border-0;
    @apply sm:col-span-6;
  }

  & > a {
    @apply inline-block w-full px-4 py-2 border-2 border-gray-200 cursor-pointer;
    @apply dark:border-0 dark:bg-gray-700 dark:text-white;

    &.active {
      @apply bg-gray-100 font-bold;
      @apply dark:bg-gray-900;
    }

    &.hide {
      @apply hidden;
    }
  }

  & > a > i {
    @apply block;
  }
}
</style>