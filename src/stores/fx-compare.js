import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useFxCompareStore = defineStore('fx-compare', () => {
  const supportCurrencies = ref([])
  const supportProviders = {
    // 'toss': '토스뱅크',
    'hana': '트래블머니(하나머니)',
    'shinhan': '신한SOL트래블'
  }
  const data = reactive({})
  const winnerTable = reactive({})

  async function getFxData() {
    const response = await fetch('https://worker.themore.pro/latest-data/fx-compare')
      .then(response => response.json())

    // 왜인진 모르겠지만 이렇게 정리를 하네요.. 과거의 나 왜그러지?
    Object.keys(data).forEach(key => delete data[key])
    Object.assign(data, response)

    await updateCurrencyList()
    await getWinners()
  }

  async function updateCurrencyList () {
    supportCurrencies.value = [...new Set(
      Object.keys(data).map(provider => Object.keys(data[provider].data)).flat()
    )]
  }

  async function getWinners () {
    const providers = Object.keys(supportProviders)
    Object.assign(winnerTable, supportCurrencies.value.reduce((store, currency) => {
      let lowerPrice = 0
      let lowerProvider = ''
      
      for (let i in providers) {
        const provider = providers[i]
        if (data[provider].data[currency] !== undefined) {
          const price = (data[provider].data[currency].rate.buy === undefined) ?
            data[provider].data[currency].rate.base :
            data[provider].data[currency].rate.buy

          if (price < lowerPrice || lowerPrice === 0) {
            lowerPrice = price
            lowerProvider = provider
          }
        }
      }

      store[currency] = lowerProvider
      return store
    }, {}))
  }

  async function getCompareResult () {
    return {

      list: [
        // { provider: 'toss', calcResult: 0 },
        { provider: 'hana', calcResult: 0 },
        { provider: 'shinhan', calcResult: 0 },
        { provider: 'legacy-card', calcResult: 0 },
        { provider: 'legacy-cash', calcResult: 0 }
      ]
    }
  }

  return { getFxData, data, supportProviders, supportCurrencies, winnerTable }
})
