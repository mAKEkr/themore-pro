<template>
  <div id="fxcalc-details">
    <ul>
      <li class="original-value" v-if="props.selectedCurrency === 'USD'">
        <p>계산 대상값</p>
        <p class="value">
          {{ userInput }} {{ props.selectedCurrency }}
        </p>
        <p class="calc-value">
          ({{ roundDown(userInput * Store.data.rate.KRW.USD, 0) }} KRW)
        </p>
        <p class="description">
          {{ userInput }} * {{ Store.data.rate.KRW.USD }}<br />소숫점단위 버림
        </p>
      </li>
      <li class="visa-rate" v-else>
        <p>{{ props.selectedCurrency }}/USD<br />VISA사 환율 변환</p>
        <p class="value">
          {{ result().value - result().details.fee.VISA }} USD
        </p>
        <p class="description">
          {{ userInput }} * {{ Store.data.rate.USD[props.selectedCurrency] }}<br />소숫점 3번째단위 반올림
        </p>
      </li>
      <li class="fee-visa">
        <p>VISA사 수수료</p>
        <template v-if="props.selectedCurrency === 'USD'">
          <p class="value">
            {{ result().details.fee.VISA.toFixed(2) }} USD
          </p>
          <p class="calc-value">
            ({{ roundDown(result().details.fee.VISA * Store.data.rate.KRW.USD, 0) }} KRW)
          </p>
          <p class="description">
            {{ userInput }} * 1.1%(0.011)<br />소숫점 3번째단위 버림
          </p>
        </template>
        <template v-else>
          <p class="value">
            {{ result().details.fee.VISA.toFixed(2) }} USD
          </p>
          <p class="description">
            VISA사 환율 변환 값 * 1.1%(0.011)<br />소숫점 3번째단위 버림
          </p>
        </template>
      </li>
      <li class="fee-shinhan">
        <p>신한카드 수수료</p>
        <template v-if="props.selectedCurrency === 'USD'">
          <p class="value">
            {{ result().details.fee.SHINHANCARD }} KRW
          </p>
          <p class="description">
            계산기준값의 KRW * 0.18%(0.0018)<br />소숫점단위 버림
          </p>
        </template>
        <template v-else>
          <p class="value">
            {{ roundDown(result().value * Store.data.rate.KRW.USD * 0.0018, 0) }} KRW
          </p>
          <p class="description">
            (VISA사 환율 변환 값 + 수수료) * 0.18%(0.0018)<br />소숫점 버림
          </p>
        </template>
      </li>
      <li class="calc-result">
        <p>총 계산 결과</p>
        <p class="value" v-if="props.selectedCurrency === 'USD'">
          {{ result().value }} KRW
        </p>
        <p class="value" v-else>
          {{
            roundDown(result().value * Store.data.rate.KRW.USD, 0) +
            roundDown(result().value * Store.data.rate.KRW.USD * 0.0018, 0)
          }} KRW
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { feeCalc, roundDown } from '@/modules/common'
  import { useFxCalcStore } from '@/stores/themore-fx'
  // import { onMounted } from 'vue'

  // eslint-disable-next-line no-undef
  const userInput = defineModel('userInput')
  const props = defineProps(['selectedCurrency'])
  const Store = useFxCalcStore()
  
  const result = () => 
    props.selectedCurrency === 'USD' ?
      feeCalc(Number(userInput.value), props.selectedCurrency, Store.data.rate.KRW.USD) :
      feeCalc(Number(userInput.value), props.selectedCurrency, Store.data.rate.USD[props.selectedCurrency])
  
</script>

<style lang="postcss">
#fxcalc-details {
  @apply mb-4;

  & > ul {
    @apply flex align-middle items-stretch gap-8;
    @apply max-sm:flex-col;

    & > li {
      @apply w-full text-center bg-gray-100 p-4 rounded-xl relative;
      @apply dark:bg-gray-600 dark:text-white;
      
      & > p {
        @apply block;
      }

      p.value {
        @apply text-lg font-semibold;
      }

      p.calc-value {
        @apply text-gray-600;
        @apply dark:text-gray-300;
      }

      p.description {
        @apply hidden mt-2 text-sm;
      }

      &:hover > p.description {
        @apply block;
      }

      & + li::before {
        content:"+";
        @apply block absolute -left-6 top-1/2 -translate-y-1/2 text-xl;
        @apply max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:-top-8 max-sm:translate-y-0;
      }

      &:last-child:before {
        content:'=';
      }
    }
  }
}
</style>