<template>
  <div class="home flex h-screen bg-white">
    <!-- 主内容区，使用 ml-[272px] 来匹配菜单宽度，transition 用于菜单收起时的平滑过渡 -->
    <div class="flex-1 flex flex-col w-full transition-all duration-300 ease-in-out">
      <Nav title="聊天"></Nav>
      <ModelSelector></ModelSelector>
      <div class="flex-1 mt-10 w-full flex flex-col overflow-y-auto">
        <Messages :messages="messages"></Messages>
      </div>
      <!-- 输入框容器，使用 left 和 right 来控制宽度，transition 用于菜单收起时的平滑过渡 -->
      <div class="fixed bottom-0 right-0 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-lg" 
           :class="{'left-[272px]': !menuCollapsed, 'left-0': menuCollapsed}"
      >
        <MessageInput
          v-model:auto-scroll="autoScroll"
          @submit-prompt="handleSubmitPrompt"
          @stop-response="handleStopRespose"
        ></MessageInput>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Nav from '@/components/Nav/index.vue';
import ModelSelector from '@/components/ModelSelector/index.vue';
import Messages from '@/components/Messages/index.vue';
import MessageInput from '@/components/MessageInput/index.vue';
import { getModels } from '@/api/index';


const autoScroll = ref(true)
const menuCollapsed = ref(false) // 控制菜单是否收起

let messages = ref([])

let prompt = ref(''); // 输入的字符串
let history = ref({
  messages: {},
  currentId: null
});
function handleSubmitPrompt() {
}

function handleStopRespose() {
}

onMounted(() => {
  getModels();
})

</script>

<style scoped>
.home {
  overflow: hidden;
}
</style>
