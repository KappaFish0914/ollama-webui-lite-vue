<template>
  <div>
    <!-- 编辑模式 -->
    <div v-if="message.edit" class="w-full">
      <n-input
        v-model:value="editedContent"
        type="textarea"
        :autosize="{ minRows: 1 }"
        class="bg-transparent outline-none w-full resize-none"
      />

      <div class="mt-2 mb-1 flex justify-center space-x-2 text-sm font-medium">
        <n-button
          type="primary"
          @click="confirmEdit"
        >
          Save
        </n-button>

        <n-button
          @click="cancelEdit"
        >
          Cancel
        </n-button>
      </div>
    </div>

    <!-- 显示模式 -->
    <div v-else class="w-full">
      <!-- 错误消息 -->
      <div
        v-if="message.error"
        class="flex mt-2 mb-4 space-x-2 border px-4 py-3 border-red-800 bg-red-800/30 font-medium rounded-lg"
      >
        <AlertIcon class="w-5 h-5 self-center" />
        <div class="self-center">
          {{ message.content }}
        </div>
      </div>

      <!-- 正常消息 -->
      <div v-else class="prose chat-assistant w-full max-w-full dark:prose-invert prose-headings:my-0 prose-p:my-0 prose-p:-mb-4 prose-pre:my-0 prose-table:my-0 prose-blockquote:my-0 prose-img:my-0 prose-ul:-my-4 prose-ol:-my-4 prose-li:-my-3 prose-ul:-mb-6 prose-ol:-mb-6 prose-li:-mb-4 whitespace-pre-line" v-html="markedContent" />

      <!-- 消息操作按钮 -->
      <div v-if="message.done" class="flex justify-start space-x-1 -mt-2">
        <!-- 消息导航 -->
        <MessageNavigation
          v-if="showNavigation"
          :message="message"
          :history="history"
          @previous="$emit('showPrevious', message)"
          @next="$emit('showNext', message)"
        />

        <!-- 操作按钮 -->
        <n-button
          text
          :class="buttonVisibilityClass"
          @click="$emit('edit', message.id)"
        >
          <template #icon>
            <EditIcon />
          </template>
        </n-button>

        <n-button
          text
          :class="buttonVisibilityClass"
          @click="$emit('copy', message.content)"
        >
          <template #icon>
            <CopyIcon />
          </template>
        </n-button>

        <n-button
          v-if="message.info"
          text
          :class="buttonVisibilityClass"
          :id="'info-' + message.id"
        >
          <template #icon>
            <InfoIcon />
          </template>
        </n-button>

        <n-button
          v-if="isLastMessage"
          text
          :class="buttonVisibilityClass"
          @click="$emit('regenerate')"
        >
          <template #icon>
            <RegenerateIcon />
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton, NInput } from 'naive-ui'
import { marked } from 'marked'
import EditIcon from '../icons/EditIcon.vue'
import CopyIcon from '../icons/CopyIcon.vue'
import InfoIcon from '../icons/InfoIcon.vue'
import RegenerateIcon from '../icons/RegenerateIcon.vue'
import AlertIcon from '../icons/AlertIcon.vue'
import MessageNavigation from './MessageNavigation.vue'

interface Props {
  message: any
  history: Record<string, any>
  isLastMessage: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit', messageId: string): void
  (e: 'copy', content: string): void
  (e: 'regenerate'): void
  (e: 'showPrevious', message: any): void
  (e: 'showNext', message: any): void
}>()

const editedContent = ref(props.message.editedContent || props.message.content)

const markedContent = computed(() => {
  return marked(props.message.content.replace('\\\\', '\\\\\\'))
})

const buttonVisibilityClass = computed(() => {
  return props.isLastMessage ? 'visible' : 'invisible group-hover:visible'
})

const showNavigation = computed(() => {
  if (props.message.parentId !== null) {
    return props.history.messages[props.message.parentId]?.childrenIds.length > 1
  }
  return false
})

const confirmEdit = () => {
  props.message.content = editedContent.value
  props.message.edit = false
}

const cancelEdit = () => {
  props.message.edit = false
  props.message.editedContent = undefined
}
</script> 