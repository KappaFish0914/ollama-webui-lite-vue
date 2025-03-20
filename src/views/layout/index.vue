<template>
  <div class="layout w-screen h-screen">
    <n-space size="large">
      <n-layout has-sider>
        <n-layout-sider>
          <Sider />
        </n-layout-sider>
        <n-layout-content>
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { NSpace, NLayout, NLayoutSider, NLayoutContent } from 'naive-ui'
import Sider from '@/components/sider/index.vue';
import { useStore } from '@/store';
</script>

<style scoped></style>