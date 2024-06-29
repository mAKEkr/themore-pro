<template>
  <section id="fxcalc-main">
    <NoticeComponent id="fxcalc-notice" class="mb-4" notice-id="uploader-process">
      <p>
        <span class="icon">📢</span>
        <a href="https://themore-pro.notion.site/06a1a1a2edd3490b86ade97617ef1e69" target="_blank">
          더모아프로 개선작업 완료와 앞으로의 운영에 대해 공지합니다.
        </a>
      </p>
    </NoticeComponent>

    <header>
      <div class="header-buttons">
        <!-- <Switch name="shinhanRemain" v-model="App.applySelectedRate">
          해외이용환율선택 적용
        </Switch> -->
        <RouterLink to="/themore-fx/config">설정</RouterLink>
      </div>

      <DateSelect v-model:date="App.select.date" v-if="App.applySelectedRate" />
      <UserRate v-else />

      <CurrencySelect
        :changeCurrencyAction="changeCurrency"
        :selectCurrency="App.select.currency"
        :currencyList="App.select.currencyList"
        :selectDate="App.select.date"
      />
    </header>
  
    <Calculator
      v-model:userInput="userInput"
      v-model:selectCurrency="App.select.currency"
      v-model:selectCurrencyList="App.select.currencyList"
      :changeCurrencyAction="changeCurrency"
      :updateDataAction="updateData"
    />

    <CalculationDetails
      v-if="(
        Object.keys(Store.data).length !== 0 &&
        App.displayDetails === true
      )"
      v-model:userInput="userInput"
      :selectedCurrency="App.select.currency"
    />

    <DisclaimerComponent
      v-if="Object.keys(App.disclaimer).find(key => App.disclaimer[key]() === true)"
      :conditions="App.disclaimer" />

    <template v-if="Object.keys(Store.data).length !== 0">
      <p class="fxcalc-upload-time">
        신한은행 1회차 고시환율 발표 시각 : {{ DateFormat.format(new Date(Store.data.updatedAt.Shinhan)) }}
      </p>
      <p class="fxcalc-upload-time" v-if="App.select.currency !== 'USD'">
        VISA 환율 발표 시각 : {{ DateFormat.format(new Date(Store.data.updatedAt.Visa)) }}
      </p>
    </template>

    <RevenueTable v-if="Object.keys(Store.data).length !== 0"
      :currency="App.select.currency"
      :table="Store.data.table[App.select.currency]"
      :krwusd="Store.data.rate.KRW.USD"
    />

    <NoticeComponent id="fxcalc-disclaimer" class="mt-4">
      <p>
        <span class="icon">❗</span>
        해당 계산기는 일부 공개된 계산식과 신한은행, 비자사의 공개된 환율 정보를 토대로 계산되며, 계산값에 대한 결과가 실제 금액과 다르더라도 사이트는 책임지지 않습니다.
      </p>
      <p>
        <span class="icon">❗</span>
        원화-달러 고시환율(KRW/USD)은 신한은행의 1회차 고시환율의 송금 보내실 때(전신환매도율)만을 참조합니다.
      </p>
    </NoticeComponent>
  </section>

  <CurrencySelectModal
    :data="App.select.currencyList"
    :datachangeAction="(data) => App.select.currencyList = data"
  />
</template>

<script setup>
  import { ref, reactive, watch, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'

  import { config, makeDateCode } from '@/modules/common'
  import { useFxCalcStore } from '@/stores/themore-fx'

  import Switch              from '@/components/switch.vue'
  import NoticeComponent     from '@/components/notices.vue'

  import DateSelect          from '@/components/themore-fx/dateSelect.vue'
  import UserRate            from '@/components/themore-fx/userRate.vue'
  import CurrencySelect      from '@/components/themore-fx/currencySelect.vue'
  import Calculator          from '@/components/themore-fx/calculator.vue'
  import CalculationDetails  from '@/components/themore-fx/calcDetails.vue'
  import DisclaimerComponent from '@/components/themore-fx/disclaimer.vue'
  import RevenueTable        from '@/components/themore-fx/revenueTable.vue'
  import CurrencySelectModal from '@/components/themore-fx/currencySelectModal.vue'

  const App = reactive({
    localHour: 0,
    select: {
      date: '',
      currency: 'USD',
      currencyList: ['USD']
    },
    disclaimer: {
      'earlyHour': () => App.localHour < 9,
      'isKRWselected': () => App.select.currency === 'KRW'
    },
    displayDetails: (window.localStorage.getItem('fxcalc-calcDetails') !== null),
    applySelectedRate: (window.localStorage.getItem('fxcalc-selectedRate') === null)
  })

  const Store = useFxCalcStore()
  const userInput = ref(0)

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
    const selectedCurrencyList = window.localStorage.getItem('fxrate-selectedCurrency')
    if (selectedCurrencyList === null) {
      App.select.currencyList = [].concat(config.availableCurrency)
      if (config.currencyListLenghtLimit !== 0) {
        App.select.currencyList.length = config.currencyListLenghtLimit
      } else {
        App.select.currencyList.length = 6
      }
    } else {
      App.select.currencyList = JSON.parse(selectedCurrencyList)
    }

    await Store.getAvailableDates()

    App.localHour = Number(new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      hour12: false,
      timeZone: 'Asia/Seoul'
    }).format(new Date().getTime()))

    setCurrentDate()
    await updateData()
    parseURLquery()

    // 앱 마운트 후 감시해야 충돌이 없음
    watch(() => App.select.currencyList, () => {
      updateData()
    })

    // if (App.applySelectedRate === )

    watch(() => App.applySelectedRate, (value) => {
      if (value === true) {
        window.localStorage.removeItem('fxcalc-selectedRate')
        Store.updateUserRateConfig(false)
      } else {
        Store.updateUserRateConfig(window.localStorage.getItem('fxcalc-userRateConfig'))
        window.localStorage.setItem('fxcalc-selectedRate', value)
      }
    })
  })

  watch(() => App.select.date, async (selectDate, prev) => {
    if (prev !== selectDate && prev !== '') {
      if (Store.availableDates.includes(selectDate)) {
        await updateData()
      } else if (selectDate === '') {
        if (prev !== makeDateCode(new Date().getTime())) {
          setCurrentDate()
          await updateData()
        } else {
          App.select.date = makeDateCode(new Date().getTime())
        }
      } else {
        alert('해당 일자의 데이터가 존재하지 않습니다')
        document.querySelector('#fxcalc-select-date input[type="date"]').blur() // Issue #3
        setCurrentDate()
      }
    }
  })

  const setCurrentDate = () => {
    const currentDate = makeDateCode(new Date().getTime())

    if (
      (Array.isArray(Store.availableDates) &&
      Store.availableDates.length !== 0 &&
      Store.availableDates.includes(currentDate) === false) ||
      App.localHour < 9
    ) {
      App.select.date = makeDateCode(new Date().getTime() - 86400 * 1000)
    } else {
      App.select.date = makeDateCode(new Date().getTime())
    }
  }

  function parseURLquery () {
    const currentURL = new URL(window.location.href)
    if (
      currentURL.pathname === '/themore-fx/' &&
      currentURL.searchParams.size > 0
    ) {
      const filter = /[0-9]{4}-[0-1]?[0-9]-[0-3]?[0-9]/g
      
      if (
        currentURL.searchParams.has('currency') &&
        config.availableCurrency.includes(currentURL.searchParams.get('currency'))
      ) {
        if (App.select.currencyList.includes(currentURL.searchParams.get('currency')) === false) {
          App.select.currencyList.push(currentURL.searchParams.get('currency'))
        }
        changeCurrency(currentURL.searchParams.get('currency'))
      }

      if (
        currentURL.searchParams.has('date') &&
        currentURL.searchParams.get('date').match(filter)
      ) {
        App.select.date = currentURL.searchParams.get('date')
      }
    }
  }

  async function updateData (date) {
    await Store.getFxLog(
      date === undefined ? App.select.date : date,
      App.select.currencyList
    )

    if (Store.data.rate.hasOwnProperty(App.select.currency) === false) {
      App.select.currency = 'USD'
    }
    userInput.value = Store.data.table[App.select.currency][0][1]
  }

  async function changeCurrency (currency, value) {
    App.select.currency = currency

    if (
      value === undefined &&
      ( currency === 'USD' || Store.data.rate.USD[currency] !== undefined )
    ) {
      userInput.value = Store.data.table[currency][0][1]
    } else {
      userInput.value = value
    }
  }
</script>

<style lang="postcss">
#fxcalc-main {
  @apply relative max-sm:text-sm;

  .header-buttons {
    @apply flex gap-4 justify-start mb-3 items-center;

    & > a {
      @apply ml-auto text-center bg-cyan-600 text-white px-4 py-3 rounded-xl;
      @apply dark:bg-slate-800;
    }
  }
}

#disclaimer-message {
  @apply absolute w-full h-full top-0 left-0 flex items-center rounded-xl bg-gray-600 text-white;
}

#fxcalc-main > p.fxcalc-upload-time {
  @apply text-right text-gray-600;
  @apply dark:text-gray-300;
}
</style>