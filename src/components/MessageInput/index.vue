<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'

interface Props {
  autoScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoScroll: true
})

const isAutoScroll = ref(props.autoScroll)

const emit = defineEmits(['submit-prompt', 'stop-response', 'update:autoScroll'])

const prompt = ref('')
const messages = ref<any[]>([])

const handleSubmit = () => {
  if (prompt.value.trim()) {
    emit('submit-prompt', prompt.value)
  }
}

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    if (prompt.value.trim()) {
      handleSubmit()
    }
  }
}

const handleStopResponse = () => {
  emit('stop-response')
}

const handleScroll = () => {
  isAutoScroll.value = true
  emit('update:autoScroll', true)
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

const handleTextareaInput = (e: Event) => {
  const textarea = document.getElementById('chat-textarea') as HTMLTextAreaElement
  // console.log('handleTextareaInput', textarea, textarea.scrollHeight)
  if (textarea) {
    textarea.style.height = ''
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }
}
</script>

<template>
  <div class="bottom-0 w-full">
    <div class="px-2.5 pt-2.5 -mb-0.5 mx-auto inset-x-0 bg-transparent flex justify-center">
      <div v-if="!isAutoScroll && messages.length > 0" class="flex justify-center mb-4">
        <n-button
          class="bg-white border border-gray-100 dark:border-none dark:bg-white/20 p-1.5 rounded-full"
          @click="handleScroll"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-5 h-5"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
              clip-rule="evenodd"
            />
          </svg>
        </n-button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800">
      <div class="w-full px-2.5 -mb-0.5 mx-auto inset-x-0">
        <div class="bg-gradient-to-t from-white dark:from-gray-800 from-40% pb-2">
          <form
            class="flex flex-col relative w-full rounded-xl border dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100"
            @submit.prevent="handleSubmit"
          >
            <div class="flex">
              <textarea
                id="chat-textarea"
                v-model="prompt"
                class="dark:bg-gray-800 dark:text-gray-100 outline-none w-full py-3 px-2 pl-4 rounded-xl resize-none"
                placeholder="请输入信息"
                :rows="1"
                @keypress="handleKeyPress"
                @input="handleTextareaInput"
              ></textarea>

              <div class="self-end mb-2 flex space-x-0.5 mr-2">
                <template v-if="messages.length === 0 || messages[messages.length - 1].done">
                  <n-button
                    :class="[
                      prompt !== ''
                        ? 'bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                        : 'text-white bg-gray-100 dark:text-gray-800 dark:bg-gray-600 disabled',
                      'transition rounded-lg p-1 mr-0.5 w-7 h-7 self-center'
                    ]"
                    :disabled="prompt === ''"
                    @click="handleSubmit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </n-button>
                </template>
                <template v-else>
                  <n-button
                    class="bg-white hover:bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800 transition rounded-lg p-1.5"
                    @click="handleStopResponse"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564a1.312 1.312 0 01-1.313-1.313V9.564z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </n-button>
                </template>
              </div>
            </div>
          </form>

          <div class="mt-1.5 text-xs text-gray-500 text-center">
            Shift + Enter 换行 | Enter 发送
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.n-input {
  --n-border: none !important;
  --n-border-hover: none !important;
  --n-border-focus: none !important;
}
</style> 