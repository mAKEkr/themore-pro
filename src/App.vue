<template>
  <Layout>
    <RouterView />
  </Layout>
  <Toast />
  <Modal />
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import Layout from './Layout.vue'
  import Toast from '@/components/toast.vue'
  import Modal from '@/components/modal.vue'
</script>