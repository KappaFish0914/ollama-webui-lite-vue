<template>
  <div class="home flex h-screen bg-white">
    <!-- 主内容区，使用 ml-[272px] 来匹配菜单宽度，transition 用于菜单收起时的平滑过渡 -->
    <div class="flex-1 flex flex-col w-full transition-all duration-300 ease-in-out">
      <Nav title="聊天"></Nav>
      <ModelSelector></ModelSelector>
      <div class="flex-1 mt-10 w-full flex flex-col overflow-y-auto">
        <Messages :messages="$messages"></Messages>
      </div>
      <!-- 输入框容器，使用 left 和 right 来控制宽度，transition 用于菜单收起时的平滑过渡 -->
      <div class="fixed bottom-0 right-0 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-lg" 
           :class="{'left-[272px]': !menuCollapsed, 'left-0': menuCollapsed}"
      >
        <MessageInput
          v-model:auto-scroll="autoScroll"
          v-model:prompt="prompt"
          @submit-prompt="handleSubmitPrompt"
          @stop-response="handleStopResponse"
        ></MessageInput>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, unref, nextTick } from 'vue';
import { v4 as uuidv4 } from "uuid";
import Nav from '@/components/Nav/index.vue';
import ModelSelector from '@/components/ModelSelector/index.vue';
import Messages from '@/components/Messages/index.vue';
import MessageInput from '@/components/MessageInput/index.vue';
import { useChatStore } from '@/store';
import { getModels, sendPrompt } from '@/api/index';

const store = useChatStore();

let $selectedModels = computed(() => {
  return store.selectedModels;
})
let $db = computed(() => {
  return store.db;
})
let $chatId = computed(() => {
  return store.chatId;
})
const autoScroll = ref(true)
const menuCollapsed = ref(false) // 控制菜单是否收起

let $messages = computed(() => {
  return store.messages;
})



let prompt = ref(''); // 输入的字符串
let $history = computed(() => {
  let history = store.history;
  if (history.currentId !== null) {
		let _messages = [];

		let currentMessage = history.messages[history.currentId];
		while (currentMessage !== null) {
			_messages.unshift({ ...currentMessage });
			currentMessage =
				currentMessage.parentId !== null ? history.messages[currentMessage.parentId] : null;
		}
    store.setMessages(_messages);
	} else {
    store.setMessages([]);
	}

  return history;
})

let $settings = computed(() => {
  return store.settings;
});

async function handleSubmitPrompt(userPrompt: string) {
  const _chatId = JSON.parse(JSON.stringify(unref($chatId)));
		if (
      unref($selectedModels).includes("") ||
      unref($selectedModels).length == 0
    ) {
      window.$message.error("请选择模型");
		} else if (unref($messages).length != 0 && unref($messages).at(-1).done != true) {
			console.log("wait");
		} else {
      let chatTextarea = document.getElementById("chat-textarea");
      if (chatTextarea) {
        chatTextarea.style.height = "";  
      }
			
			let userMessageId = uuidv4();
			let userMessage = {
				id: userMessageId,
				parentId: unref($messages).length !== 0 ? unref($messages).at(-1).id : null,
				childrenIds: [],
				role: "user",
				content: userPrompt
			};

			if (unref($messages).length !== 0) {
				unref($history).messages[unref($messages).at(-1).id].childrenIds.push(userMessageId);
			}

			unref($history).messages[userMessageId] = userMessage;
			unref($history).currentId = userMessageId;

      store.setHistory(unref($history))

			await nextTick();
			if (unref($messages).length == 1) {
        const newChat = {
					id: _chatId,
					title: store.title ? store.title : "新对话",
					models: unref($selectedModels),
					system: unref($settings).system ?? undefined,
					options: {
						seed: unref($settings).seed ?? undefined,
						temperature: unref($settings).temperature ?? undefined,
						repeat_penalty: unref($settings).repeat_penalty ?? undefined,
						top_k: unref($settings).top_k ?? undefined,
						top_p: unref($settings).top_p ?? undefined,
						num_ctx: unref($settings).num_ctx ?? undefined,
						...(unref($settings).options ?? {})
					},
					messages: unref($messages),
					history: unref($history)
				}
				await unref($db).createNewChat(newChat);
			}

			prompt.value = "";

			setTimeout(() => {
				window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
			}, 50);
      

			await sendPrompt(userPrompt, userMessageId, _chatId);
    }
}
/**
 * @description 停止响应
 * @todo 停止响应
 */
function handleStopResponse() {
  // TODO 通知响应
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
