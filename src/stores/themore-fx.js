import { ref, reactive, inject } from 'vue'
import { defineStore } from 'pinia'
import { config, roundDown, feeCalc, makeTable } from '@/modules/common'

export const useFxCalcStore = defineStore('themore-fx', () => {
  const Supabase = inject('supabase')
  const currentDate = ref('')
  const availableDates = ref([])
  const userRateConfig = reactive({
    enable: false,
    data: {
      percentage: 1,
      currencyTarget: 'USD',
      rateType: '',
      // rateType: '14d_high', '30d_high', '14d_avg', '30d_avg'
      fixRate: {
        USDKRW: 0
      }
    }
  })

  const data = reactive({})

  const requestHeaders = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d3RwcnBlb2J6bnV2dWxmdmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQzMDI5NjMsImV4cCI6MjAxOTg3ODk2M30.Qw2ijlhoS_LhYWmJgz3BkBgTNYfwdxlGcHSuXHQRnBM',
    'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d3RwcnBlb2J6bnV2dWxmdmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQzMDI5NjMsImV4cCI6MjAxOTg3ODk2M30.Qw2ijlhoS_LhYWmJgz3BkBgTNYfwdxlGcHSuXHQRnBM'
  }

  async function getAvailableDates () {
    // await Supabase
    //   .from('ThemoreFx')
    //   .select('date')
    //   .order('date', { ascending: false, descending: true })

    const data = await fetch(
      'https://qxwtprpeobznuvulfvgn.supabase.co/rest/v1/ThemoreFx?select=date&order=date.desc',
      {
        method: 'GET',
        headers: requestHeaders
      }
    ).then(response => {
      return response.json()
    })
    availableDates.value = data.map(item => item.date)
    return availableDates.value
  }

  async function updateUserRateConfig(data) {
    if (data === false) {
      userRateConfig.enable = false
    } else {
      userRateConfig.enable = true

      userRateConfig.data.percentage = data.fix_ratio
      userRateConfig.data.rateType = data.data_from
      userRateConfig.data.currencyTarget = data.currency

      await getAdvancedFxData()
    }

    await updateTables()
  }

  async function getFxLog(date, currencyList) {
    if (config.currencyListLenghtLimit !== 0) {
      currencyList.length = config.currencyListLenghtLimit
    }

    // const response = await Supabase.from('FxRateLog')
    //   .select()
    //   .eq('date', date)
    //   .in('currency', currencyList)
    //   .then()

    const response = await fetch(
      'https://qxwtprpeobznuvulfvgn.supabase.co/rest/v1/ThemoreFx?' +
      'select=date,data&date=eq.' + date,
      {
        method: 'GET',
        headers: requestHeaders,
      }).then(response => {
        return response.json()
      })
      
    Object.keys(data).forEach(key => delete data[key])
    currentDate.value = date
    Object.assign(data, {...response[0].data, table: {}})
    
    await updateTables()
  }

  async function getAdvancedFxData () {
    const [days, type] = userRateConfig.data.rateType.split('_')
    const list = await Supabase.from('ThemoreFx')
      .select('*')
      .order('date', { ascending: false })
      .limit(Number(days.replace('d', '')))

    console.log(list)
  }

  async function updateTables () {
    let baseUSDprice = 0
    if (userRateConfig.enable === true) {
      baseUSDprice = roundDown(
        userRateConfig.data.fixRate.USDKRW * ( 1 + userRateConfig.data.percentage * 0.01),
        1
      )
    } else {
      baseUSDprice = data.rate.KRW.USD
    }

    data.table.USD = makeTable().map(item => {
      const [target,] = item
      const result = {
        loop: true,
        amount: roundDown(target / baseUSDprice, 2),
        actualPaymentAmount: 0
      }
    
      while (result.loop) {
        const KRWconverted = feeCalc(result.amount, 'USD', baseUSDprice)
    
        if (KRWconverted.value > target) {
          result.amount = result.amount - 0.01
        } else {
          result.actualPaymentAmount = KRWconverted.value
          result.loop = false
        }
      }
    
      // 여기 toFixed는 숫자를 정확하게 표현하기 위한 toFixed로 절대로 반올림이 아님!
      return [
        target,
        Number(result.amount.toFixed(2)),
        result.actualPaymentAmount,
        roundDown(baseUSDprice * Number(result.amount.toFixed(2)), 0)
      ]
    })
    
    Object.keys(data.rate.USD).map(currency => {
        const exchangeRate = data.rate.USD[currency]
        const digits = config.currencyDB[currency].hasOwnProperty('digits') ?
          config.currencyDB[currency].digits :
          2

        data.table[currency] = makeTable().map(item => {
          const [target,] = item
          const [, targetUSD] = data.table.USD.filter(item => item[0] === target)[0]
          const result = {
            loop: true,
            amount: roundDown(((targetUSD + 0.01) / exchangeRate), digits),
            actualPaymentAmount: 0
          }

          let USDconverted = 0
          let KRWconverted = 0

          while (result.loop) {
            USDconverted = feeCalc(result.amount, currency, exchangeRate)
            KRWconverted = feeCalc(USDconverted.value - USDconverted.details.fee.VISA, 'USD', baseUSDprice)
    
            if (KRWconverted.value > target) {
              result.amount = result.amount - Math.pow(0.1, digits)
            } else {
              result.actualPaymentAmount = KRWconverted.value
              result.loop = false
            }
          }
    
          return [
            target,
            (result.amount).toFixed(digits),
            result.actualPaymentAmount,
            roundDown(baseUSDprice * (USDconverted.value - USDconverted.details.fee.VISA), 0)
          ]
        })
    })
  }

  return { getFxLog, data, getAvailableDates, availableDates, updateUserRateConfig }
})
