<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { NButton, NInput, NImage } from 'naive-ui'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.min.css'
import autoRender from 'katex/dist/contrib/auto-render.mjs'
import 'katex/dist/katex.min.css'
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  done?: boolean
  error?: boolean
  model?: string
  info?: any
  files?: Array<{ type: string; url: string }>
  edit?: boolean
  editedContent?: string
  originalContent?: string
  parentId?: string | null
  childrenIds?: string[]
}

interface Props {
  messages: Message[]
  bottomPadding?: boolean
  autoScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  bottomPadding: false,
  autoScroll: true
})

const emit = defineEmits(['regenerate-response', 'edit-message', 'copy-message'])

const message = useMessage()
const { t } = useI18n()

// 监听消息变化，处理代码高亮和数学公式
watch(() => props.messages, async (messages) => {
  if (messages && messages.length > 0 && messages[messages.length - 1].done) {
    await nextTick()
    renderLatex()
    hljs.highlightAll()
    createCopyCodeBlockButton()
  }
}, { deep: true })

// 监听自动滚动
watch(() => props.autoScroll, (newVal) => {
  if (newVal && props.bottomPadding) {
    nextTick(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    })
  }
})

const renderLatex = () => {
  const chatMessageElements = document.getElementsByClassName('chat-assistant')
  for (const element of chatMessageElements) {
    autoRender(element, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\(', right: '\\)', display: true },
        { left: '\\[', right: '\\]', display: true }
      ],
      throwOnError: false
    })
  }
}

const createCopyCodeBlockButton = () => {
  const blocks = document.querySelectorAll('pre')
  blocks.forEach((block) => {
    if (navigator.clipboard && block.childNodes.length < 2 && block.id !== 'user-message') {
      const code = block.querySelector('code')
      if (!code) return
      
      code.style.borderTopRightRadius = '0'
      code.style.borderTopLeftRadius = '0'

      const topBarDiv = document.createElement('div')
      topBarDiv.className = 'bg-gray-900 flex justify-between px-4 pt-1 rounded-t-lg'

      const langDiv = document.createElement('div')
      const codeClassNames = code.className.split(' ')
      langDiv.textContent = codeClassNames[0] === 'hljs' ? codeClassNames[1]?.slice(9) : codeClassNames[0]?.slice(9)
      langDiv.className = 'text-white text-xs my-1'

      const button = document.createElement('button')
      button.textContent = '复制代码'
      button.className = 'text-gray-300 hover:text-white text-xs my-1 cursor-pointer'
      button.onclick = () => copyCode(block, button)

      topBarDiv.appendChild(langDiv)
      topBarDiv.appendChild(button)
      block.prepend(topBarDiv)
    }
  })
}

const copyCode = async (block: HTMLPreElement, button: HTMLButtonElement) => {
  const code = block.querySelector('code')
  if (!code) return
  
  await navigator.clipboard.writeText(code.innerText)
  button.innerText = '已复制!'
  setTimeout(() => {
    button.innerText = '复制代码'
  }, 1000)
}

const handleCopyMessage = (content: string) => {
  emit('copy-message', content)
}

const handleEditMessage = (messageId: string) => {
  emit('edit-message', messageId)
}

const handleRegenerateResponse = () => {
  emit('regenerate-response')
}
</script>

<template>
  <div class="w-full">
    <template v-if="!messages.length">
      <div class="m-auto text-center w-full pb-56 px-2">
        <div class="flex justify-center mt-8">
          <img
            src="./icons/ollama.png"
            class="w-16 invert-[10%] dark:invert-[100%] rounded-full"
            alt="ollama"
            draggable="false"
          />
        </div>
        <div class="mt-2 text-2xl text-gray-800 dark:text-gray-100 font-semibold">
          有什么可以帮到你?
        </div>
      </div>
    </template>

    <template v-else>
      <div v-for="(message, messageIdx) in messages" :key="message.id" class="w-full">
        <div class="flex justify-between px-5 mb-3 w-full mx-auto rounded-lg group">
          <div class="flex w-full">
            <div class="mr-4">
              <n-image
                :src="message.role === 'user' ? '@/assets/image/user.png' : '@/assets/image/ollama.png'"
                class="max-w-[28px] object-cover rounded-full"
                :alt="message.role === 'user' ? 'User profile' : 'Ollama profile'"
                :preview-disabled="true"
              />
            </div>

            <div class="w-full overflow-hidden">
              <div class="self-center font-bold mb-0.5">
                {{ message.role === 'user' ? 'You' : 'Ollama' }}
                <span v-if="message.role === 'assistant' && message.model" class="text-gray-500 text-sm font-medium">
                  {{ ` ${message.model}` }}
                </span>
              </div>

              <!-- Loading 状态 -->
              <div v-if="message.role === 'assistant' && message.content === ''" class="w-full mt-3">
                <div class="animate-pulse flex w-full">
                  <div class="space-y-2 w-full">
                    <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded mr-14" />
                    <div class="grid grid-cols-3 gap-4">
                      <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded col-span-2" />
                      <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded col-span-1" />
                    </div>
                    <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded" />
                  </div>
                </div>
              </div>

              <!-- 消息内容 -->
              <div v-else class="prose chat-assistant w-full max-w-full dark:prose-invert prose-p:my-0 prose-pre:my-0">
                <!-- 用户上传的文件 -->
                <div v-if="message.role === 'user' && message.files" class="my-3 w-full flex overflow-x-auto space-x-2">
                  <div v-for="file in message.files" :key="file.url">
                    <n-image
                      v-if="file.type === 'image'"
                      :src="file.url"
                      class="max-h-96 rounded-lg"
                      :preview-disabled="true"
                    />
                  </div>
                </div>

                <!-- 编辑状态 -->
                <div v-if="message.edit" class="w-full">
                  <n-input
                    v-model:value="message.editedContent"
                    type="textarea"
                    class="bg-transparent"
                    :autosize="{ minRows: 1, maxRows: 10 }"
                  />
                  <div class="mt-2 mb-1 flex justify-center space-x-2">
                    <n-button
                      type="primary"
                      @click="handleEditMessage(message.id)"
                    >
                      保存
                    </n-button>
                    <n-button @click="message.edit = false">
                      取消
                    </n-button>
                  </div>
                </div>

                <!-- 普通消息内容 -->
                <div v-else>
                  <!-- 错误消息 -->
                  <div v-if="message.error" class="flex mt-2 mb-4 space-x-2 border px-4 py-3 border-red-800 bg-red-800/30 font-medium rounded-lg">
                    <div class="self-center">{{ message.content }}</div>
                  </div>
                  <!-- 正常消息 -->
                  <div v-else v-html="marked(message.content.replace('\\\\', '\\\\\\'))"></div>

                  <!-- 消息操作按钮 -->
                  <div v-if="message.done" class="flex space-x-2 mt-2">
                    <n-button
                      quaternary
                      size="tiny"
                      @click="handleEditMessage(message.id)"
                    >
                      编辑
                    </n-button>
                    <n-button
                      quaternary
                      size="tiny"
                      @click="handleCopyMessage(message.content)"
                    >
                      复制
                    </n-button>
                    <n-button
                      v-if="messageIdx === messages.length - 1"
                      quaternary
                      size="tiny"
                      @click="handleRegenerateResponse"
                    >
                      重新生成
                    </n-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-if="bottomPadding" class="mb-10" />
  </div>
</template> 