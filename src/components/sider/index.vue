<template>
  <div class="sider h-screen w-[260px] overflow-hidden top-0 left-0 z-40 transition-all bg-[#0a0a0a] text-gray-200 shadow-2xl text-sm">
    <div class="py-2.5 my-auto flex flex-col justify-between h-screen">
      <div class="px-2.5 flex justify-center space-x-2">
        <button class="flex-grow flex justify-between rounded-md px-3 py-1.5 mt-2 hover:bg-gray-900 transition">
          <div class="flex self-center">
            <div class="self-center mr-3.5">
              <img src="@/assets/image/ollama.png" class="w-5 invert-[100%] rounded-full" />              
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
      </div>

      <div class="px-2.5">
        <hr class=" border-gray-800 mb-2 w-full" />
        <div class="flex flex-col">
          <div class="flex">
            <input ref="importFiles" type="file" hidden />
            <button
              class=" flex rounded-md py-3 px-3.5 w-full hover:bg-gray-900 transition"
              @click="handleImport"
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
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div class="self-center">导入</div>
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
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div class=" self-center">导出</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

let importFiles = ref()
function handleImport() {
  importFiles.value.click()
}
</script>