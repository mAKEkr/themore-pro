<template>
  <div id="fxcalc-select-rate">
    <h1>💱 사용자 지정 환율 선택</h1>
    <form name="fxcalc_select_rate" @submit.prevent="applyUserRate">
      <ul>
        <li>
          <p>데이터 적용 환율 선택</p>
          <div>
            <input type="radio"
              id="currency_USD"
              name="currency"
              v-model="data.currency"
              value="USD" />
            <label for="currency_USD">
              USD
            </label>
            <input type="radio"
              id="currency_ALL"
              name="currency"
              v-model="data.currency"
              value="ALL" />
            <label for="currency_ALL">
              전체
            </label>
          </div>
        </li>
        <li>
          <p>환율 데이터 선택</p>
          <div>
            <input type="radio"
              id="data_from_14d_high"
              name="data_from"
              v-model="data.data_from"
              value="14d_high" />
            <label for="data_from_14d_high">
              14일 최고가
            </label>
  
            <input type="radio"
              id="data_from_30d_high"
              name="data_from"
              v-mmodel="data.data_from"
              value="30d_high" />
            <label for="data_from_30d_high">
              30일 최고가
            </label>
  
            <input type="radio"
              id="data_from_14d_avg"
              name="data_from"
              v-mmodel="data.data_from"
              value="14d_avg" />
            <label for="data_from_14d_avg">
              14일 평균
            </label>
  
            <input type="radio"
              id="data_from_30d_avg"
              name="data_from"
              v-mmodel="data.data_from"
              value="30d_avg" />
            <label for="data_from_30d_avg">
              30일 평균
            </label>
          </div>
        </li>
        <li>
          <p>추가 보정값 지정</p>
          <div>
            <input type="number"
              v-model="data.fix_ratio"
              name="fix_ratio"
              step="0.1"
              min="0"
              max="3"
              placeholder="퍼센트(숫자)" /> %
          </div>
        </li>
      </ul>
      <button type="submit">적용하기</button>
    </form>
  </div>
</template>

<script setup>
  import { useUIStore } from '@/stores/ui'
  import { useFxCalcStore } from '@/stores/themore-fx';

  const Store = {
    FxCalc: useFxCalcStore(),
    UI: useUIStore()
  }
  const data = {
    'currency': 'ALL',
    'data_from': '14d_high',
    'fix_ratio': 0
  }

  function applyUserRate () {
    window.localStorage.setItem('fxcalc-userRateConfig', JSON.stringify(data))
    Store.FxCalc.updateUserRateConfig(data)
    Store.UI.Toast.addToast({
      text: '사용자 지정 환율 설정이 완료되었습니다'
    })

    return false
  }
</script>

<style lang="postcss">
  #fxcalc-select-rate {
    @apply w-full p-4 mt-2 bg-orange-100 bg-opacity-80 rounded-xl;
    @apply dark:bg-opacity-100 dark:bg-slate-700 dark:text-white;

    & > h1 {
      @apply font-bold;
    }

    & > form {
      input[type="radio"] {
        @apply hidden;
      }

      ul > li {
        @apply my-4;

        p {
          @apply text-lg mb-2;
        }

        & > div {
          @apply grid grid-cols-4 w-full gap-2;
          @apply max-sm:grid-cols-2;
        }
      }

      input[type="radio"]:checked + label {
        @apply bg-cyan-600 text-white font-bold;
        @apply dark:bg-cyan-800;
      }

      label {
        @apply block px-4 py-3 items-center
          justify-center text-center rounded-xl text-sm
          cursor-pointer bg-white;
        @apply dark:bg-gray-600;
      }

      input[type="number"] {
        @apply py-2 px-3;
      }

      button[type="submit"] {
        @apply block text-center w-full bg-cyan-600;
        @apply dark:bg-cyan-800;
      }
    }
  }
</style>