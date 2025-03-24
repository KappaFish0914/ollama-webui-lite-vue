<template>
  <div class="w-full">
    <!-- 文件预览 -->
    <div v-if="message.files" class="my-3 w-full flex overflow-x-auto space-x-2">
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
          Save & Submit
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
      <pre id="user-message">{{ message.content }}</pre>

      <div class="flex justify-start space-x-1">
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
          class="invisible group-hover:visible p-1"
          @click="$emit('edit', message.id)"
        >
          <template #icon>
            <EditIcon />
          </template>
        </n-button>

        <n-button
          text
          class="invisible group-hover:visible p-1"
          @click="$emit('copy', message.content)"
        >
          <template #icon>
            <CopyIcon />
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton, NInput } from 'naive-ui'
import EditIcon from '../icons/EditIcon.vue'
import CopyIcon from '../icons/CopyIcon.vue'
import MessageNavigation from './MessageNavigation.vue'

interface Props {
  message: any
  history: Record<string, any>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit', messageId: string): void
  (e: 'copy', content: string): void
  (e: 'showPrevious', message: any): void
  (e: 'showNext', message: any): void
}>()

const editedContent = ref(props.message.editedContent || props.message.content)

const showNavigation = computed(() => {
  if (props.message.parentId !== null) {
    return props.history.messages[props.message.parentId]?.childrenIds.length > 1
  }
  return Object.values(props.history.messages).filter(m => m.parentId === null).length > 1
})

const confirmEdit = () => {
  props.message.editedContent = editedContent.value
  emit('edit', props.message.id)
}

const cancelEdit = () => {
  props.message.edit = false
  props.message.editedContent = undefined
}
</script> 