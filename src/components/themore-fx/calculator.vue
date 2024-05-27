<template>
  <form id="fxcalc-calculator">
    <div class="input-group">
      <input type="number"
        v-model="userInput"
        @paste.prevent="pasteDetect"
        @focus="tooltipToggle"
        @blur="tooltipToggle"
        :step="
          (config.currencyDB[selectCurrency].hasOwnProperty('digits')) ?
            Math.pow(0.1, config.currencyDB[selectCurrency]) :
            0.01" />
      <span class="input-label">{{ selectCurrency }}</span>
      <Transition>
        <div class="tooltip" :class="{active: onFocus}" v-show="onFocus">
          <button @click.prevent="copyToClipboard">복사하기</button>
        </div>
      </Transition>
    </div>
    <span>≒</span>
    <div class="input-group">
      <input type="text" v-model="calcResult" disabled />
      <span class="input-label">KRW</span>
    </div>
  </form>
</template>

<script setup>
  import { config, feeCalc, roundDown, delay } from '@/modules/common'
  import { onMounted, ref, watch } from 'vue'
  import { useFxCalcStore } from '@/stores/themore-fx'
  import { useUIStore } from '@/stores/ui'

  // eslint-disable-next-line no-undef
  const userInput = defineModel('userInput')
  // eslint-disable-next-line no-undef
  const selectCurrency = defineModel('selectCurrency')
  // eslint-disable-next-line no-undef
  const selectCurrencyList = defineModel('selectCurrencyList')

  const props = defineProps(['changeCurrencyAction', 'updateDataAction'])
  const Store = useFxCalcStore()
  const UIStore = useUIStore()
  const calcResult = ref(0)
  const onFocus = ref(false)

  watch(userInput, (current) => {
    if (selectCurrency.value === 'USD') {
      const calc = feeCalc(Number(current), selectCurrency.value, Store.data.rate.KRW.USD)
      calcResult.value = calc.value
    } else {
      const USDcalc = feeCalc(Number(current), selectCurrency.value, Store.data.rate.USD[selectCurrency.value])
      const KRWcalc =
        roundDown(USDcalc.value * Store.data.rate.KRW.USD, 0) +
        roundDown(USDcalc.value * Store.data.rate.KRW.USD * 0.0018, 0)
      calcResult.value = KRWcalc
    }
  })
  
  onMounted(() => {
    // tooltip offset fix
    const inputSize = document.querySelector('#fxcalc-calculator > .input-group > input').offsetWidth
    document.querySelector('#fxcalc-calculator > .input-group > .tooltip').style.left = (inputSize) / 2 + 'px'
  })

  async function tooltipToggle () {
    if (onFocus.value === false) {
      onFocus.value = true
    } else {
      await delay(100)
      onFocus.value = false
    }
  }

  async function copyToClipboard () {
    UIStore.Toast.addToast({
      text: '클립보드에 복사가 완료되었습니다'
    })
    await navigator.clipboard.writeText(userInput.value)
  }

  const currencyList = Object.keys(config.currencyDB)
    .filter(currency => config.availableCurrency.includes(currency))
  const symbolTable = currencyList.map(currency => config.currencyDB[currency].symbol)

  async function pasteDetect (event) {
    const data = event.clipboardData.getData('text').trim()
    const parsedData = /^(\D+)?([0-9,.]+)(\D+)?$/.exec(data.trim())
    const priority = {
      '$': 'USD',
      '£': 'GBP',
      '€': 'EUR'
    }

    if (window.localStorage.getItem('fxcalc-parsePaste') === null) {
      userInput.value = data
      return false
    } else {
      if (parsedData !== null) {
        let text = parsedData[2]
        const parsedText = /([0-9,]+)[,.]?([0-9]{2,3})/.exec(text)
        if (parsedText[1].lastIndexOf(',') === parsedText[1].length - 1) {
          console.log(true)
          text = Number(parsedText[1].replace(/,/g, '') + '.' + parsedText[2])
        } else {
          text = Number(parsedText[0].replace(/,/g, ''))
        }

        // const text = parsedData[2].replace(/,/g, '')
        const symbol = (parsedData[1] !== undefined) ? parsedData[1].trim() : null
        const ticker = (parsedData[3] !== undefined) ? parsedData[3].trim() : null

        const parseResult = {
          currency: '',
          value: text
        }

        // CNY detect
        if (['￥', '¥'].includes(symbol)) {
          if (text.indexOf('.') >= 0) {
            parseResult.currency = 'CNY'
          } else {
            parseResult.currency = 'JPY'
          }
        } else if (Object.keys(priority).includes(symbol)) {
          parseResult.currency = priority[symbol]
        } else {
          if (
            currencyList.indexOf(ticker) >= 0 ||
            currencyList.indexOf(symbol) >= 0
          ) {
            parseResult.currency = (currencyList.indexOf(ticker) > 0) ? ticker : symbol
          } else if (
            symbolTable.indexOf(ticker) >= 0 ||
            symbolTable.indexOf(symbol) >= 0
          ) {
            parseResult.currency = (symbolTable.indexOf(ticker) > 0) ?
              currencyList[symbolTable.indexOf(ticker)] :
              currencyList[symbolTable.indexOf(symbol)]
          } else {
            if (data.match(/[\d.,]+/) !== null) {
              parseResult.value = data.match(/[\d.,]+/)[0].replace(/,/g, '')
            } else {
              parseResult.value = data
            }
          }
        }

        if (parseResult.currency !== '') {
          if (selectCurrencyList.value.includes(parseResult.currency) === false) {
            selectCurrencyList.value.push(parseResult.currency)
            await props.updateDataAction()
          }

          props.changeCurrencyAction(
            parseResult.currency,
            parseResult.value
          )
          showToast(true)
        } else {
          userInput.value = data
          showToast(false)
        }
      } else {
        if (data.match(/[\d.,]+/) !== null) {
          userInput.value = data.match(/[\d.,]+/)[0].replace(/,/g, '')
        } else {
          userInput.value = data
        }
      }
    }
  }

  function showToast (status) {
    UIStore.Toast.addToast({
      text: (status === true) ?
        '붙여넣은 텍스트의 분석이 완료되었습니다' :
        '분석에 실패했습니다.'
    })
  }
</script>

<style lang="postcss">
#fxcalc-calculator {
  @apply w-full p-12 my-2 flex align-middle items-center;
  @apply max-sm:flex-col py-6 px-0;

  & > .input-group {
    @apply relative flex;

    & > input {
      border:1px solid;
      border-right:none;
      @apply w-full px-6 py-4 font-semibold text-center appearance-none rounded-l-full border-gray-400;
      @apply dark:border-gray-600 dark:bg-slate-800 dark:text-white;
      @apply max-sm:text-base;
    }

    & > input[disabled] {
      @apply text-white bg-gray-700 appearance-none;
    }

    & > span.input-label {
      border:1px solid;
      border-left:none;
      @apply p-4 bg-gray-800 font-bold text-white min-w-20 text-center rounded-r-full border-gray-400;
      @apply dark:border-gray-600 dark:bg-gray-600;
      @apply max-sm:leading-6;
    }

    & > .tooltip {
      @apply absolute left-1/2 -translate-x-1/2 -top-12 -mt-4 font-semibold text-sm bg-gray-800 text-white rounded-lg opacity-0 transition-all;
      @apply dark:bg-black;

      &.active {
        @apply opacity-100 mt-0 block;
      }

      & > button {
        @apply bg-transparent appearance-none px-4 py-2 rounded-lg;
      }

      & > button + button::before {
        content:"";
        border-left:1px solid;
        @apply border-gray-600 absolute;
      }

      &::after {
        content:"";
        display:inline-block;
        left: calc(50% - 0.5rem);
        @apply inline-block w-0 h-0 absolute -bottom-4
          bg-transparent border-8 border-transparent border-t-gray-800;
        @apply dark:border-t-black;
      }
    }
  }

  & > span {
    @apply flex-grow flex-shrink-0 basis-8 w-full text-center mx-2 text-3xl font-extrabold ;
    @apply max-sm:my-2;
    @apply dark:text-white;
  }
}
</style>