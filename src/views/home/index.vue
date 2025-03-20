<template>
  <div class="home bg-white w-full">
    <Nav title="聊天"></Nav>
    <ModelSelector></ModelSelector>
    <div class="messages-container h-full mt-10 mb-32 w-full flex flex-col">
      <Messages></Messages>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Nav from '@/components/Nav/index.vue';
import ModelSelector from '@/components/ModelSelector/index.vue';
import Messages from '@/components/Messages/index.vue'

</script>

<style scoped>

</style>
