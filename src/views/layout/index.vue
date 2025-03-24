<template>
  <div class="layout w-screen h-screen">
    <n-space size="large">
      <n-layout has-sider class="w-screen">
        <n-layout-sider>
          <Sider />
        </n-layout-sider>
        <n-layout>
          <n-layout-content>
            <router-view />
          </n-layout-content>
        </n-layout>
      </n-layout>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { NSpace, NLayout, NLayoutSider, NLayoutContent, useMessage } from 'naive-ui'
import Sider from '@/components/Sider/index.vue';

const message = useMessage();

onMounted(() => {
  window.$message = message;
})

</script>

<style scoped></style>