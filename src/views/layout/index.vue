<template>
  <div class="layout w-screen h-screen">
    <n-space size="large">
      <n-layout has-sider>
        <n-layout-sider>
          <Sider />
        </n-layout-sider>
        <n-layout>
          <router-view />
        </n-layout>
      </n-layout>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { NSpace, NLayout, NLayoutSider } from 'naive-ui'
import Sider from '@/components/sider/index.vue';
</script>

<style scoped></style>