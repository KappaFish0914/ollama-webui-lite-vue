<template>
  <n-message-provider>
    <slot></slot>
  </n-message-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMessage, NMessageProvider } from 'naive-ui'

const message = useMessage()

onMounted(() => {
  window.$message = message
})
</script> 