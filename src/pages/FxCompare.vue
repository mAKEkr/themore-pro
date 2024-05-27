<template>
  <section id="fxcompare-main">
    <NoticeComponent id="fxcompare-agreement" class="mb-4">
      <p>
        <span class="icon">❗</span>
        해당 기능은 2024년 7월 1일부로 유지보수가 종료됩니다.
      </p>
      <p>
        <span class="icon">⚠️</span>
        해당 비교계산기는 실시간으로 환율을 불러오지 못합니다. 실제 적용환율과 최대 10분정도의 격차가 발생할 수 있으며, 참고용으로만 이용해주시기 바랍니다.
      </p>
      <p>
        <span class="icon">⚠️</span>
        서비스 제공사에서 우대비율변경 혹은 환율 산출방법 변경, 혹은 환율 미고시등이 발생할 경우 시간 격차와 관계없이 금액에 차이가 발생할 수 있습니다.
      </p>
    </NoticeComponent>
<!-- 
    <div id="fxcompare-condition">
      <form>
        <input type="number" name="target_amount" placeholder="환전 금액 입력" /> 원(KRW, ￦) 을<br />
        <select>
          <option>JPY</option>
        </select> 로<br />
        <select>
          <option>여행</option>
          <option>환율거래</option>
          <option>예금</option>
        </select>목적으로 환전했을때<br />
        <button>계산하기</button>
      </form>
    </div> -->

    <div id="fxcompare-content" v-if="Object.keys(Store.data).length !== 0">
      <!-- <p>토스뱅크 환율 발표기준 : {{ DateFormat.format(new Date(Store.data.toss.timestamp.provider)) }}</p> -->
      <p>하나은행 환율 발표기준 : {{ DateFormat.format(new Date(Store.data.hana.timestamp.provider)) }}</p>
      <p>신한은행 환율 발표기준 : {{ DateFormat.format(new Date(Store.data.shinhan.timestamp.provider)) }}</p>

      <table v-if="Object.keys(Store.data).length !== 0">
        <thead>
          <th class="symbol"></th>
          <!-- <th>토스뱅크</th> -->
          <th>트래블로그<br />(하나머니)</th>
          <th>신한SOL 트래블<br />(신한 SOL)</th>
        </thead>
        <tbody>
          <tr v-for="currency in Store.supportCurrencies" :key="currency">
            <td class="symbol">
              <i class="emoji">{{ config.currencyDB[currency].emoji }}</i>
              {{ currency }}
            </td>
            <td v-for="provider in Object.keys(Store.supportProviders)"
              :class="{winner: Store.winnerTable[currency] === provider}"
              :key="provider + currency">
              <template v-if="Store.data[provider].data[currency] !== undefined">
                <template v-if="provider === 'toss'">
                  <p>
                    {{ Store.data[provider].data[currency].rate.base }}
                  </p>
                </template>
                <template v-else>
                  <p>
                    {{ Store.data[provider].data[currency].rate.buy }}
                  </p>
                  <p v-if="provider === 'hana'">
                    {{ Store.data[provider].data[currency].rate.sell }}<span> + (-1%)</span>
                  </p>
                  <p v-else>
                    {{ Store.data[provider].data[currency].rate.sell }}
                  </p>
                </template>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <NoticeComponent id="fxcompare-disclaimer" class="mt-4">
      <p>
        <span class="icon">❗</span>
        해당 비교계산기는 정확한 환율을 제공하는것을 목적에 두지 않습니다. 어디까지나 참고용으로써 사용되어야 합니다.
      </p>
      <p>
        <span class="icon">❗</span>
        환율 데이터의 제공은 각 사업자의 데이터 요청 거부로 인하여 중단될 수 있습니다.
      </p>
    </NoticeComponent>
  </section>
</template>

<script setup>
  import { reactive, onMounted } from 'vue'
  import { config } from '@/modules/common'

  import { useFxCompareStore } from '@/stores/fx-compare'

  import NoticeComponent     from '@/components/notices.vue'
  
  const App = reactive({
    providers: ['toss', 'hana', 'shinhan'],
    userInput: 0
  })
  const Store = useFxCompareStore()
  const DateFormat = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Seoul',
    hour12: false
  })

  onMounted(async () => {
    await Store.getFxData()
  })
</script>

<style lang="postcss">
#fx-compare-content {
  @apply max-sm-mobile:overflow-x-scroll;
  width:200%;
}

#fxcompare-content > p {
  @apply text-gray-700 text-right text-sm;
  @apply dark:text-gray-200;
}

#fxcompare-content > table {
  @apply w-full mt-2 table-fixed
    shadow-md bg-gray-50 overflow-x-scroll;
  
  @apply dark:bg-gray-800 dark:shadow-2xl;
  @apply max-sm:text-sm;
  @apply max-sm-mobile:text-xs max-sm-mobile:w-fit;

  th, td {
    @apply py-3;
  }

  thead {
    @apply bg-gray-300 sticky top-0 left-0 will-change-transform;
    @apply dark:bg-gray-950;
  }
  
  thead th.symbol,
  tbody td.symbol {
    @apply w-24 text-center font-bold;
    @apply max-sm-mobile:w-20;
  }

  tbody td {
    border-top:1px solid;
    @apply border-gray-200 text-center;
    @apply dark:border-gray-700;

    & > p > span {
      @apply text-xs align-middle;
    }

    &.winner {
      @apply bg-cyan-800 bg-opacity-20 font-semibold;
      @apply dark:bg-gray-600;
    }
  }

  tbody td:first-child {
    @apply bg-gray-200;
    @apply dark:bg-gray-700;
  }
}
</style>