<template>
  <ModalComponent name="CurrencySelect">
    <template #header>
      화면에 표시할 통화 선택
    </template>

    <div class="modal-content fxcalc-modal-content">
      <form @submit.prevent="currencySelectSave">
        <ul>
          <li :key="'ALL'" class="select-all">
            <label>
              <p>전체 선택하기</p>
              <input type="checkbox" @click="allSelect" :checked="isAllSelected" />
            </label>
          </li>
          <li :key="'USD'">
            <label>
              <span class="currency">
                {{ 'USD' + '(' + config.currencyDB.USD.symbol +')' }}
              </span>
              <p>{{ config.currencyDB.USD.name }}</p>
              <input name="selectCurrency[]" type="checkbox" value="USD" checked disabled
                v-model="selectList" />
            </label>
          </li>
          <li
            v-for="currency in Object.keys(config.currencyDB).filter(currency => currency !== 'USD' && config.availableCurrency.includes(currency))"
            :key="currency"
          >
            <label>
              <span class="currency">
                {{ currency + '(' + config.currencyDB[currency].symbol +')' }}
              </span>
              <p>{{ config.currencyDB[currency].name }}</p>
              <input name="selectCurrency[]" type="checkbox"
                v-model="selectList"
                :value="currency"
                :disabled="checkCountOver && selectList.includes(currency) === false"
                />
            </label>
          </li>
        </ul>
        <button type="submit">저장하기</button>
      </form>
    </div>

    <template #footer>
      <ul>
        <li v-if="restrictLength !== 0">통화는 최대 {{ restrictLength }}개까지 지정 가능합니다.</li>
        <li>통화를 설정해도 조회하는 날짜에 특정 통화 환율 데이터가 존재하지 않을 경우 표시되지 않을 수 있습니다.</li>
      </ul>
    </template>
  </ModalComponent>
</template>

<script setup>
  // eslint-disable-next-line no-unused-vars
  import { ref, computed, onBeforeUpdate } from 'vue'
  import ModalComponent from '@/components/modal.vue'
  import { config } from '@/modules/common'
  import { useUIStore } from '@/stores/ui'

  const restrictLength = config.currencyListLenghtLimit
  const props = defineProps(['data', 'datachangeAction'])
  const selectList = ref([])
  const Store = useUIStore()

  onBeforeUpdate(() => {
    if (window.localStorage.getItem('fxrate-selectedCurrency') !== null) {
      selectList.value = props.data
    } else {
      selectList.value = ['USD']
    }
  })

  const checkCountOver = computed(() => {
    return (restrictLength === 0 ) ? false : selectList.value.length >= restrictLength
  })

  const currencySelectSave = () => {
    window.localStorage.setItem('fxrate-selectedCurrency', JSON.stringify(selectList.value))
    props.datachangeAction(selectList.value)
    Store.Modal.deactive()
  }

  const allSelect = (event) => {
    if (event.target.checked === true) {
      selectList.value = Object.keys(config.currencyDB).filter(currency => config.availableCurrency.includes(currency))
    } else {
      selectList.value = ['USD']
    }
  }

  const isAllSelected = computed(() => {
    return selectList.value.length === config.availableCurrency.length
  })
</script>

<style lang="postcss">
  .fxcalc-modal-content {
    form {
      & > ul {
        @apply max-h-72 overflow-y-scroll;
      }

      & > ul > li {
        @apply block;

        &.select-all {
          @apply sticky top-0 bg-gray-100;
          @apply dark:bg-gray-900;

          & > label >  p {
            @apply ml-auto mr-0 font-bold text-gray-700 text-sm;
            @apply dark:text-white;
          }
        }

        & > label {
          @apply flex w-full py-3 px-4 cursor-pointer;
          @apply dark:text-white;

          & > span.currency {
            @apply w-20 text-right pr-4 basis-20 flex-shrink-0;
          }

          & > p {
            @apply mr-auto flex-grow-0;
            flex-basis:auto;
          }
          & > input[type="checkbox"] {
            @apply ml-4;
          }
        }

        & + li {
          border-top:1px solid;
          @apply border-gray-300;
          @apply dark:border-gray-900;
        }
      }

      button[type="submit"] {
        @apply block w-full text-center bg-cyan-600 py-2 text-white;
        @apply dark:bg-slate-800;
      }
    }
  }
</style>