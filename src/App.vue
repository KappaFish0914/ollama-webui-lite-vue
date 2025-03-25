<template>
  <div class="w-screen h-screen" id="App">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { NMessageProvider } from 'naive-ui';
import { getDB } from '@/db/index';
import { useChatStore } from '@/store';

const store = useChatStore();

onMounted(async () => {
  let db = await getDB();
  store.setDB(db);
})
</script>

<style scoped>

</style>
