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
        v-for="(message, index) in props.messages"
        :key="index"
        class=" w-full"
      >
        <div class="flex justify-between px-5 mb-3 w-full mx-auto rounded-lg group">
          <div class=" flex w-full">
            <div class=" mr-4">
              <template v-if="message.role === 'user'">
                <img
                  src="/user.png"
                  class=" max-w-[28px] object-cover rounded-full"
                  alt="User profile"
                  draggable="false"
                />
              </template>
              <template v-else>
                <img
                  src="/favicon.png"
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
                    <template v-if="message.files.length > 0">
                      <div class="my-3 w-full flex overflow-x-auto space-x-2">
                        {#each message.files as file}
                          <div>
                            {#if file.type === "image"}
                              <img
                                src={file.url}
                                alt="input"
                                class=" max-h-96 rounded-lg"
                                draggable="false"
                              />
                            {/if}
                          </div>
                        {/each}
                      </div>
                    </template>

                    {#if message?.edit === true}
                    <template v-if="message.edit">
                      
                      <div class=" w-full">
                        <textarea
                          id="message-edit-{message.id}"
                          class=" bg-transparent outline-none w-full resize-none"
                          bind:value={history.messages[message.id].editedContent}
                          on:input={(e) => {
                            e.target.style.height = `${e.target.scrollHeight}px`;
                          }}
                        />

                        <div class=" mt-2 mb-1 flex justify-center space-x-2 text-sm font-medium">
                          <button
                            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-gray-100 transition rounded-lg"
                            on:click={() => {
                              confirmEditMessage(message.id);
                            }}
                          >
                            Save & Submit
                          </button>

                          <button
                            class=" px-4 py-2 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 transition outline outline-1 outline-gray-200 dark:outline-gray-600 rounded-lg"
                            on:click={() => {
                              cancelEditMessage(message.id);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="w-full">
                        <pre id="user-message">{message.content}</pre>

                        <div class=" flex justify-start space-x-1">

                          <template v-if="message.parentId !== null && message.parentId in history.messages && (history.messages[message.parentId]?.childrenIds.length ?? 0) > 1">
                            <div class="flex self-center">
                              <button
                                class="self-center"
                                on:click={() => {
                                  showPreviousMessage(message);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  class="w-4 h-4"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </button>

                              <div class="text-xs font-bold self-center">
                                {history.messages[message.parentId].childrenIds.indexOf(message.id) +
                                  1} / {history.messages[message.parentId].childrenIds.length}
                              </div>

                              <button
                                class="self-center"
                                on:click={() => {
                                  showNextMessage(message);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  class="w-4 h-4"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </template>
                          <template v-else-if="message.parentId === null && Object.values(history.messages).filter((message) => message.parentId === null).length > 1">

                            <div class="flex self-center">
                              <button
                                class="self-center"
                                on:click={() => {
                                  showPreviousMessage(message);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  class="w-4 h-4"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </button>

                              <div class="text-xs font-bold self-center">
                                {Object.values(history.messages)
                                  .filter((message) => message.parentId === null)
                                  .map((message) => message.id)
                                  .indexOf(message.id) + 1} / {Object.values(history.messages).filter(
                                  (message) => message.parentId === null
                                ).length}
                              </div>

                              <button
                                class="self-center"
                                on:click={() => {
                                  showNextMessage(message);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  class="w-4 h-4"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </template>

                          <button
                            class="invisible group-hover:visible p-1 rounded dark:hover:bg-gray-800 transition"
                            on:click={() => {
                              editMessageHandler(message.id);
                            }}
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
                            class="invisible group-hover:visible p-1 rounded dark:hover:bg-gray-800 transition"
                            on:click={() => {
                              copyToClipboard(message.content);
                            }}
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
                                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </template>
                  </template>

                  {#if message.role === "assistant"}
                    <div>
                      {#if message?.edit === true}
                        <div class=" w-full">
                          <textarea
                            id="message-edit-{message.id}"
                            class=" bg-transparent outline-none w-full resize-none"
                            bind:value={history.messages[message.id].editedContent}
                            on:input={(e) => {
                              e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                          />

                          <div class=" mt-2 mb-1 flex justify-center space-x-2 text-sm font-medium">
                            <button
                              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-gray-100 transition rounded-lg"
                              on:click={() => {
                                confirmEditResponseMessage(message.id);
                              }}
                            >
                              Save
                            </button>

                            <button
                              class=" px-4 py-2 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 transition outline outline-1 outline-gray-200 dark:outline-gray-600 rounded-lg"
                              on:click={() => {
                                cancelEditMessage(message.id);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      {:else}
                        <div class="w-full">
                          {#if message?.error === true}
                            <div
                              class="flex mt-2 mb-4 space-x-2 border px-4 py-3 border-red-800 bg-red-800/30 font-medium rounded-lg"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-5 h-5 self-center"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                />
                              </svg>

                              <div class=" self-center">
                                {message.content}
                              </div>
                            </div>
                          {:else}
                            {@html marked(message.content.replace("\\\\", "\\\\\\"))}
                          {/if}

                          {#if message.done}
                            <div class=" flex justify-start space-x-1 -mt-2">
                              {#if message.parentId !== null && message.parentId in history.messages && (history.messages[message.parentId]?.childrenIds.length ?? 0) > 1}
                                <div class="flex self-center">
                                  <button
                                    class="self-center"
                                    on:click={() => {
                                      showPreviousMessage(message);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      class="w-4 h-4"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                        clip-rule="evenodd"
                                      />
                                    </svg>
                                  </button>

                                  <div class="text-xs font-bold self-center">
                                    {history.messages[message.parentId].childrenIds.indexOf(
                                      message.id
                                    ) + 1} / {history.messages[message.parentId].childrenIds.length}
                                  </div>

                                  <button
                                    class="self-center"
                                    on:click={() => {
                                      showNextMessage(message);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      class="w-4 h-4"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                        clip-rule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              {/if}

                              <button
                                class="{messageIdx + 1 === messages.length
                                  ? 'visible'
                                  : 'invisible group-hover:visible'} p-1 rounded dark:hover:bg-gray-800 transition"
                                on:click={() => {
                                  editMessageHandler(message.id);
                                }}
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
                                class="{messageIdx + 1 === messages.length
                                  ? 'visible'
                                  : 'invisible group-hover:visible'} p-1 rounded dark:hover:bg-gray-800 transition"
                                on:click={() => {
                                  copyToClipboard(message.content);
                                }}
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
                                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                                  />
                                </svg>
                              </button>

                              {#if message.info}
                                <button
                                  class=" {messageIdx + 1 === messages.length
                                    ? 'visible'
                                    : 'invisible group-hover:visible'} p-1 rounded dark:hover:bg-gray-800 transition whitespace-pre-wrap"
                                  on:click={() => {
                                    console.log(message);
                                  }}
                                  id="info-{message.id}"
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
                                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                    />
                                  </svg>
                                </button>
                              {/if}

                              {#if messageIdx + 1 === messages.length}
                                <button
                                  type="button"
                                  class="{messageIdx + 1 === messages.length
                                    ? 'visible'
                                    : 'invisible group-hover:visible'} p-1 rounded dark:hover:bg-gray-800 transition"
                                  on:click={regenerateResponse}
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
                                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                    />
                                  </svg>
                                </button>
                              {/if}
                            </div>
                          {/if}
                        </div>
                      {/if}
                    </div>
                  {/if}
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
import type { Props } from './types'

const props = withDefaults(defineProps<Props>(), {
  messages: () => [] as string[]
})

</script>

<style lang="scss"></style>