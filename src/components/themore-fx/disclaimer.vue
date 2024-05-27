<template>
  <NoticeComponent class="component-notice-warn mb-4">
    <p v-if="props.conditions.earlyHour()">
      <span class="icon">❗</span>
      신한/VISA사의 환율은 9시를 넘어서 공개됩니다. 해당 시각에 결제를 추천하지 않습니다.<br />
      환율이 일부만 공개되거나 사이트가 정상 작동하지 않을 수 있습니다.
    </p>
    <p v-if="props.conditions.isKRWselected()">
      <span class="icon">❗</span>
      해당 사이트에서 제공하는 KRW 계산은 VISA 결제망을 통한 이중환전(DCC라 부르는) KRW결제를 이용한 경우에 대한 계산기입니다.<br />
      한국 내에서의 사용은 해당되지 않으니 참고하시기 바랍니다.
    </p>
  </NoticeComponent>
</template>

<script setup>
  import NoticeComponent from '@/components/notices.vue'

  const props = defineProps(['conditions'])
</script>