<template>
  <div id="fxcalc-table">
    <table>
      <thead>
        <th width="35">{{ props.currency }}</th>
        <th width="35">예상 환산 KRW</th>
        <th width="30">예상 수익률</th>
      </thead>
      <tbody>
        <tr v-for="item in props.table" :key="item[0]">
          <td
            :title="(item[1]) + ' 복사하기'"
            :data-text="(item[1])"
            @click.prevent="copyToClipboard">
            {{ config.currencyDB[props.currency].symbol + (item[1]) }}
          </td>
          <td>
            {{ config.currencyDB.KRW.symbol + NumberFormat.format(item[2]) }}
          </td>
          <td>
            {{ getRevenuePercent(item) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import { config } from '@/modules/common'
  import { useUIStore } from '@/stores/ui'

  const props = defineProps(['currency', 'table', 'krwusd'])
  const UIStore = useUIStore()

  const NumberFormat = new Intl.NumberFormat('ko-KR')

  function getRevenuePercent (tableItem) {
    const target = String(tableItem[3])
    const revenue = Number(target.slice(-3, target.length)) * 2
    
    return (props.currency === 'KRW') ?
      (revenue / Number(tableItem[1]) * 100).toFixed(2) + '%' :
      (revenue / Number(target) * 100).toFixed(2) + '%'
  }

  async function copyToClipboard ({ target }) {
    UIStore.Toast.addToast({
      text: '클립보드에 복사가 완료되었습니다'
    })
    await navigator.clipboard.writeText(target.dataset.text)
  }
</script>

<style lang="postcss" scoped>
#fxcalc-table {
  @apply relative;
}

table {
  @apply w-full border-gray-100 border-2 bg-gray-50 table-fixed;
  @apply dark:border-gray-600 dark:bg-gray-950 dark:text-gray-300;

  th, td {
    @apply p-2;
  }

  td {
    @apply text-center;
  }

  td:first-child {
    @apply font-semibold cursor-pointer;
  }

  & > thead {
    @apply bg-gray-200 text-gray-800;
    @apply dark:bg-gray-600 dark:text-gray-200;
  }

  & > tbody > tr + tr {
    border-top:1px solid;
    @apply border-gray-200;
    @apply dark:border-0;

    &:nth-child(2n) {
      @apply bg-gray-100;
      @apply dark:bg-gray-800;
    }
  }
}
</style>