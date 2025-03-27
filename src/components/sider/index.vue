<template>
  <div class="sider h-screen w-[260px] overflow-hidden top-0 left-0 z-40 transition-all bg-[#0a0a0a] text-gray-200 shadow-2xl text-sm">
    <div class="py-2.5 my-auto flex flex-col justify-between h-screen">
      <div class="px-2.5 flex justify-center space-x-2">
        <button class="flex-grow flex justify-between rounded-md px-3 py-1.5 mt-2 hover:bg-gray-900 transition">
          <div class="flex self-center">
            <div class="self-center mr-3.5">
              <img :src="ollamaLogo" class="w-5 invert-[100%] rounded-full" />              
            </div>
            <div class=" self-center font-medium text-sm">新对话</div>
          </div>
          <div class="self-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-4 h-4"
					>
						<path
							d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"
						/>
						<path
							d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"
						/>
					</svg>
				</div>
        </button>
      </div>
      <div class="px-2.5 mt-1 mb-2 flex justify-center space-x-2">
        <div class="flex w-full">
          <div class="self-center pl-3 py-2 rounded-l bg-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-4 h-4"
            >
              <path
                fill-rule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <input
            class="w-full rounded-r py-1.5 pl-2.5 pr-4 text-sm text-gray-300 bg-gray-900 outline-none"
            placeholder="搜索"
          />
        </div>
      </div>
      <div class="pl-2.5 my-2 flex-1 flex flex-col space-y-1 overflow-y-auto">
        <div 
          v-for="chat in $chats.filter(chat => {
            if (search === '') return true;
            return chat.title.toLowerCase().includes(search);
          })"
          :key="chat.id"
          class="w-full pr-2 relative"
        >
					<button
						class=" w-full flex justify-between rounded-md px-3 py-2 hover:bg-gray-900 {chat.id ===
						$chatId
							? 'bg-gray-900'
							: ''} transition whitespace-nowrap text-ellipsis"
						@click="handleChangeChat"
					>
						<div class=" flex self-center flex-1">
							<div class=" self-center mr-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-4 h-4"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
									/>
								</svg>
							</div>
							<div
								class=" text-left self-center overflow-hidden {chat.id === $chatId
									? 'w-[120px]'
									: 'w-[180px]'} "
							>
                <template v-if="chatTitleEditId === chat.id">
                  <input v-model="chatTitle" class=" bg-transparent w-full" />
                </template>
								<template v-else>
                  {chat.title}
                </template>																
							</div>
						</div>
					</button>

          <template v-if="chat.id === $chatId">
						<div class=" absolute right-[22px] top-[10px]">
              <template v-if="chatTitleEditId === chat.id">
                <div class="flex self-center space-x-1.5">
									<button
										class=" self-center hover:text-white transition"
										@click="editChatTitle(chat.id, chatTitle)"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4"
										>
											<path
												fill-rule="evenodd"
												d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>
									<button
										class=" self-center hover:text-white transition"
										@click="handleDelete"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4"
										>
											<path
												d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
											/>
										</svg>
									</button>
								</div>
              </template>
							<template v-else-if="chatDeleteId === chat.id">
                <div class="flex self-center space-x-1.5">
									<button
										class=" self-center hover:text-white transition"
										@click="deleteChat(chat.id)"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4"
										>
											<path
												fill-rule="evenodd"
												d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>
									<button
										class=" self-center hover:text-white transition"
										@click="() => {
											chatDeleteId = null;
										}"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4"
										>
											<path
												d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
											/>
										</svg>
									</button>
								</div>
              </template>
              <template v-else>
                <div class="flex self-center space-x-1.5">
									<button
										class=" self-center hover:text-white transition"
										@click="() => {
											chatTitle = chat.title;
											chatTitleEditId = chat.id;
										}"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="w-4 h-4"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
											/>
										</svg>
									</button>
									<button
										class=" self-center hover:text-white transition"
										@click="() => {
											chatDeleteId = chat.id;
										}"
									>
										<img :src="deleteIcon" class="w-4 h-4" />
									</button>
								</div>
              </template>
						</div>
					</template>
				</div>
			</div>

      <div class="px-2.5">
        <hr class=" border-gray-800 mb-2 w-full" />
        <div class="flex flex-col">
          <div class="flex">
            <input ref="importFiles" type="file" hidden />
            <button
              class=" flex rounded-md py-3 px-3.5 w-full hover:bg-gray-900 transition "
              @click="handleImport"
            >
              <div>
                <div class=" self-center mr-3 inline">
                  <img :src="importIcon" class="w-5 h-5 inline" />
                </div>
                <div class="self-center inline">导入</div>
              </div>
            </button>
            <button
              class=" flex rounded-md py-3 px-3.5 w-full hover:bg-gray-900 transition "
            >
              <div>
                <div class=" self-center mr-3 inline">
                  <img :src="exportIcon" class="w-5 h-5 inline" />
                </div>
                <div class=" self-center inline">导出</div>
              </div>
            </button>
          </div>
          <button
						class=" flex rounded-md my-1 py-3 px-3.5 w-full hover:bg-gray-900 transition"
					>
						<div class="mr-3">
							<img :src="clearIcon" class="w-5 h-5" />
						</div>
						<span>清除对话</span>
					</button>
          <button
            class=" flex rounded-md py-3 px-3.5 w-full hover:bg-gray-900 transition"
          >
            <div class=" self-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div class=" self-center font-medium">设置</div>
				  </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useChatStore } from '@/store'
import ollamaLogo from '@/assets/image/ollama.png'
import deleteIcon from '@/assets/image/delete.svg'
import importIcon from '@/assets/image/import.svg'
import exportIcon from '@/assets/image/export.svg'
import clearIcon from '@/assets/image/clear.svg'

const store = useChatStore()
const importFiles = ref()
const search = ref('')
const chatTitleEditId = ref(null)
const chatDeleteId = ref(null)
const chatTitle = ref('')

const $chats = computed(() => store.chats)
const $chatId = computed(() => store.chatId)

function handleImport() {
  importFiles.value.click()
}

function loadChat(id: string) {
  store.setChatId(id)
}

function editChatTitle(id: string, title: string) {
  chatTitleEditId = null;
  chatTitle = "";
  store.updateChatTitle(id, title)
}

function deleteChat(id: string) {
  store.deleteChat(id)
}

function handleChangeChat() {
  if (chat.id !== chatTitleEditId) {
    chatTitleEditId = null;
    chatTitle = "";
  }

  if (chat.id !== $chatId) {
    loadChat(chat.id);
  }
}
function handleDelete() {
  chatTitleEditId = null;
  chatTitle = "";
}
</script>