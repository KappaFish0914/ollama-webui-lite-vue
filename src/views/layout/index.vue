<template>
  <div class="layout w-screen h-screen">
    <n-message-provider>
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
    </n-message-provider>
    
  </div>
</template>

<script lang="ts" setup>
import { NSpace, NLayout, NLayoutSider, NLayoutContent } from 'naive-ui'
import Sider from '@/components/Sider/index.vue';

</script>

<style scoped></style>