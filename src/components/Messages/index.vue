<template>
  <div class="messages w-full">
    <template v-if="!props.messages || !props.messages.length">
      <div class="m-auto text-center w-full pb-56 px-2">
        <div class="flex justify-center mt-8">
          <img
            src="@/assets/image/ollama.png"
            class=" w-16 invert-[10%] dark:invert-[100%] rounded-full"
            alt="ollama"
            draggable="false"
          />
        </div>
        <div class=" mt-2 text-2xl text-gray-800 dark:text-gray-100 font-semibold">
          有什么可以帮到您?
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="(message, messageIdx) in props.messages"
        :key="messageIdx"
        class=" w-full"
      >
        <div class="flex justify-between px-5 mb-3 w-full mx-auto rounded-lg group">
          <div class=" flex w-full">
            <div class=" mr-4">
              <template v-if="message.role === 'user'">
                <img
                  src="@/assets/image/user.png"
                  class=" max-w-[28px] object-cover rounded-full"
                  alt="User profile"
                  draggable="false"
                />
              </template>
              <template v-else>
                <img
                  src="@/assets/image/favicon.png"
                  class=" max-w-[28px] object-cover rounded-full"
                  alt="Ollama profile"
                  draggable="false"
                />
              </template>
            </div>

            <div class="w-full overflow-hidden">
              <div class=" self-center font-bold mb-0.5">
                
                <template v-if="message.role === 'user'">
                  You
                </template>
                <template v-else>
                  Ollama 
                  <span class=" text-gray-500 text-sm font-medium">
                    {{ message.model ? message.model : "" }}
                  </span>
                </template>
              </div>

              
              <template v-if="message.role !== 'user' && message.content === ''">
                <div class="w-full mt-3">
                  <div class="animate-pulse flex w-full">
                    <div class="space-y-2 w-full">
                      <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded mr-14" />

                      <div class="grid grid-cols-3 gap-4">
                        <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded col-span-2" />
                        <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded col-span-1" />
                      </div>
                      <div class="grid grid-cols-4 gap-4">
                        <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded col-span-1" />
                        <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded col-span-2" />
                        <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded col-span-1 mr-4" />
                      </div>

                      <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  class="prose chat-{message.role} w-full max-w-full dark:prose-invert prose-headings:my-0 prose-p:my-0 prose-p:-mb-4 prose-pre:my-0 prose-table:my-0 prose-blockquote:my-0 prose-img:my-0 prose-ul:-my-4 prose-ol:-my-4 prose-li:-my-3 prose-ul:-mb-6 prose-ol:-mb-6 prose-li:-mb-4 whitespace-pre-line"
                >
                  <template v-if="message.role == 'user'">
                    <template v-if="message.files && message.files.length > 0">
                      <div class="my-3 w-full flex overflow-x-auto space-x-2">
                        <div v-for="file in message.files" :key="file.url">
                          <img
                            v-if="file.type === 'image'"
                            :src="file.url"
                            alt="input"
                            class="max-h-96 rounded-lg"
                            draggable="false"
                          />
                        </div>
                      </div>
                    </template>

                    <template v-if="message?.edit === true">
                      <div class="w-full">
                        <textarea
                          :id="'message-edit-' + message.id"
                          class="bg-transparent outline-none w-full resize-none"
                          v-model="$history.messages[message.id].editedContent"
                          @input="(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = `${target.scrollHeight}px`;
                          }"
                        />

                        <div class="mt-2 mb-1 flex justify-center space-x-2 text-sm font-medium">
                          <button
                            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-gray-100 transition rounded-lg"
                            @click="confirmEditMessage(message.id)"
                          >
                            保存并提交
                          </button>

                          <button
                            class="px-4 py-2 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 transition outline outline-1 outline-gray-200 dark:outline-gray-600 rounded-lg"
                            @click="cancelEditMessage(message.id)"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="w-full">
                        <pre id="user-message">{{ message.content }}</pre>

                        <div class="flex justify-start space-x-1">
                          <template v-if="message.parentId !== null && message.parentId in $history.messages && ($history.messages[message.parentId]?.childrenIds.length ?? 0) > 1">
                            <div class="flex self-center">
                              <button
                                class="self-center"
                                @click="showPreviousMessage(message)"
                              >
                                <img :src="leftIcon" class="w-4 h-4" />
                              </button>

                              <div class="text-xs font-bold self-center">
                                {{ $history.messages[message.parentId].childrenIds.indexOf(message.id) + 1 }} / {{ $history.messages[message.parentId].childrenIds.length }}
                              </div>

                              <button
                                class="self-center"
                                @click="showNextMessage(message)"
                              >
                                <img :src="rightIcon" class="w-4 h-4" />
                              </button>
                            </div>
                          </template>
                          <template v-else-if="message.parentId === null && Object.values($history.messages).filter((message) => message.parentId === null).length > 1">
                            <div class="flex self-center">
                              <button
                                class="self-center"
                                @click="showPreviousMessage(message)"
                              >
                                <img :src="leftIcon" class="w-4 h-4" />
                              </button>

                              <div class="text-xs font-bold self-center">
                                {{ Object.values($history.messages).filter((message) => message.parentId === null).map((message) => message.id).indexOf(message.id) + 1 }} / {{ Object.values($history.messages).filter((message) => message.parentId === null).length }}
                              </div>

                              <button
                                class="self-center"
                                @click="showNextMessage(message)"
                              >
                                <img :src="rightIcon" class="w-4 h-4" />
                              </button>
                            </div>
                          </template>

                          <button
                            class="invisible group-hover:visible p-1 rounded dark:hover:bg-gray-800 transition"
                            @click="editMessageHandler(message.id)"
                          >
                            <img :src="editIcon" class="w-4 h-4" />
                          </button>

                          <button
                            class="invisible group-hover:visible p-1 rounded dark:hover:bg-gray-800 transition"
                            @click="copyToClipboard(message.content)"
                          >
                            <img :src="copyIcon" class="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </template>
                  </template>

                  <template v-if="message.role === 'assistant'">
                    <div>
                      <template v-if="message?.edit === true">
                        <div class="w-full">
                          <textarea
                            :id="'message-edit-' + message.id"
                            class="bg-transparent outline-none w-full resize-none"
                            v-model="$history.messages[message.id].editedContent"
                            @input="(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = `${target.scrollHeight}px`;
                            }"
                          />

                          <div class="mt-2 mb-1 flex justify-center space-x-2 text-sm font-medium">
                            <button
                              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-gray-100 transition rounded-lg"
                              @click="confirmEditResponseMessage(message.id)"
                            >
                              保存
                            </button>

                            <button
                              class="px-4 py-2 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 transition outline outline-1 outline-gray-200 dark:outline-gray-600 rounded-lg"
                              @click="cancelEditMessage(message.id)"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="w-full">
                          <template v-if="message?.error === true">
                            <div class="flex mt-2 mb-4 space-x-2 border px-4 py-3 border-red-800 bg-red-800/30 font-medium rounded-lg">
                              <img :src="warnIcon" class="w-5 h-5 self-center" />
                              <div class="self-center">
                                {{ message.content }}
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div v-html="marked(message.content ? message.content.replace('\\\\', '\\\\\\') : '')"></div>
                          </template>

                          <template v-if="message.done">
                            <div class="flex justify-start space-x-1 -mt-2">
                              <template v-if="message.parentId !== null && message.parentId in $history.messages && ($history.messages[message.parentId]?.childrenIds.length ?? 0) > 1">
                                <div class="flex self-center">
                                  <button
                                    class="self-center"
                                    @click="showPreviousMessage(message)"
                                  >
                                    <img :src="leftIcon" class="w-4 h-4" />
                                  </button>

                                  <div class="text-xs font-bold self-center">
                                    {{ $history.messages[message.parentId].childrenIds.indexOf(message.id) + 1 }} / {{ $history.messages[message.parentId].childrenIds.length }}
                                  </div>

                                  <button
                                    class="self-center"
                                    @click="showNextMessage(message)"
                                  >
                                    <img :src="rightIcon" class="w-4 h-4" />
                                  </button>
                                </div>
                              </template>

                              <button
                                :class="{'visible': messageIdx + 1 === messages.length, 'invisible group-hover:visible': messageIdx + 1 !== messages.length}"
                                class="p-1 rounded dark:hover:bg-gray-800 transition"
                                @click="editMessageHandler(message.id)"
                              >
                                <img :src="editIcon" class="w-4 h-4" />
                              </button>

                              <button
                                :class="{'visible': messageIdx + 1 === messages.length, 'invisible group-hover:visible': messageIdx + 1 !== messages.length}"
                                class="p-1 rounded dark:hover:bg-gray-800 transition"
                                @click="copyToClipboard(message.content)"
                              >
                                <img :src="copyIcon" class="w-4 h-4" />
                              </button>

                              <template v-if="message.info">
                                <button
                                  :class="{'visible': messageIdx + 1 === messages.length, 'invisible group-hover:visible': messageIdx + 1 !== messages.length}"
                                  class="p-1 rounded dark:hover:bg-gray-800 transition whitespace-pre-wrap"
                                  :id="'info-' + message.id"
                                >
                                  
                                </button>
                              </template>

                              <template v-if="messageIdx + 1 === messages.length">
                                <button
                                  type="button"
                                  class="visible p-1 rounded dark:hover:bg-gray-800 transition"
                                  @click="regenerateResponse"
                                >
                                  <img :src="warnIcon" class="w-4 h-4" />
                                </button>
                              </template>
                            </div>
                          </template>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { unref, computed, nextTick } from 'vue';
import type { Props, Message } from './types.d';
import { copyToClipboard } from '@/utils/index';
import { marked } from "marked";
import { useChatStore } from '@/store';
import { v4 as uuidv4 } from 'uuid';
import { sendPrompt } from '@/api/index';
import copyIcon from '@/assets/image/copy.svg';
import editIcon from '@/assets/image/edit.svg';
import warnIcon from '@/assets/image/warn.svg';
import leftIcon from '@/assets/image/left.svg';
import rightIcon from '@/assets/image/right.svg';

const props = withDefaults(defineProps<Props>(), {
  messages: () => []
})

const store = useChatStore();
let $history = computed(() => {
  return store.history;
})

let $chatId = computed(() => {
  return store.chatId;
})

async function cancelEditMessage(messageId: string | null) {
  if (!messageId) {
    window.$message.error('messageId 为空');
    return
  };
  const history = JSON.parse(JSON.stringify(unref($history)));
  history.messages[messageId].edit = false;
	history.messages[messageId].editedContent = undefined;
  store.setHistory(unref(history));
}
async function confirmEditMessage(messageId: string | null) {
  if (!messageId) {
    window.$message.error('messageId 为空');
    return
  };
  const history = JSON.parse(JSON.stringify(unref($history)));
  history.messages[messageId].edit = false;

  let userPrompt = history.messages[messageId].editedContent;
  let userMessageId = uuidv4();

  let userMessage = {
    id: userMessageId,
    parentId: history.messages[messageId].parentId,
    childrenIds: [],
    role: "user",
    content: userPrompt,
    ...(history.messages[messageId].files && { files: history.messages[messageId].files })
  };

  let messageParentId = history.messages[messageId].parentId;

  if (messageParentId !== null) {
    history.messages[messageParentId].childrenIds = [
      ...history.messages[messageParentId].childrenIds,
      userMessageId
    ];
  }

  history.messages[userMessageId] = userMessage;
  history.currentId = userMessageId;

  await nextTick();
  await sendPrompt(userPrompt, userMessageId, unref($chatId));

  store.setHistory(unref(history));
}

async function editMessageHandler(messageId: string | null) {
  if (!messageId) {
    window.$message.error('messageId 为空');
    return
  };
  const history = JSON.parse(JSON.stringify(unref($history)));
  
  history.messages[messageId].edit = true;
  history.messages[messageId].originalContent = history.messages[messageId].content;
  history.messages[messageId].editedContent = history.messages[messageId].content;

  store.setHistory(unref(history));

  await nextTick();

  const editElement = document.getElementById(`message-edit-${messageId}`) as HTMLElement;

  editElement.style.height = "";
  editElement.style.height = `${editElement.scrollHeight}px`;
}

function regenerateResponse() {}

async function showPreviousMessage(message: any) {
  const history = JSON.parse(JSON.stringify(unref($history)));

  if (message.parentId !== null) {
			let messageId =
				history.messages[message.parentId].childrenIds[
					Math.max(history.messages[message.parentId].childrenIds.indexOf(message.id) - 1, 0)
				];

			if (message.id !== messageId) {
				let messageChildrenIds = history.messages[messageId].childrenIds;

				while (messageChildrenIds.length !== 0) {
					messageId = messageChildrenIds.at(-1);
					messageChildrenIds = history.messages[messageId].childrenIds;
				}

				history.currentId = messageId;
			}
		} else {
			let childrenIds = Object.values(history.messages)
				.filter((message: any) => message.parentId === null)
				.map((message: any) => message.id);
			let messageId = childrenIds[Math.max(childrenIds.indexOf(message.id) - 1, 0)];

			if (message.id !== messageId) {
				let messageChildrenIds = history.messages[messageId].childrenIds;

				while (messageChildrenIds.length !== 0) {
					messageId = messageChildrenIds.at(-1);
					messageChildrenIds = history.messages[messageId].childrenIds;
				}

				history.currentId = messageId;
			}
		}

		await nextTick();
    // TODO autoscroll
		// autoScroll = window.innerHeight + window.scrollY >= document.body.offsetHeight - 40;

		setTimeout(() => {
			window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
		}, 100);
}

function showNextMessage(message: any) {}

async function confirmEditResponseMessage(messageId: string) {
	const history = JSON.parse(JSON.stringify(unref($history)));
  history.messages[messageId].edit = false;
	history.messages[messageId].content = history.messages[messageId].editedContent;

  store.setHistory(unref(history));
};
</script>

<style lang="scss"></style>