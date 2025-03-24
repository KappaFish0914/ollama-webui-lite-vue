<template>
  <div class="flex justify-between px-5 mb-3 w-full mx-auto rounded-lg group">
    <div class="flex w-full">
      <!-- 头像 -->
      <div class="mr-4">
        <img
          :src="message.role === 'user' ? '/user.png' : '/favicon.png'"
          class="max-w-[28px] object-cover rounded-full"
          :alt="message.role === 'user' ? 'User profile' : 'Ollama profile'"
          draggable="false"
        />
      </div>

      <div class="w-full overflow-hidden">
        <!-- 名称 -->
        <div class="self-center font-bold mb-0.5">
          <template v-if="message.role === 'user'">
            You
          </template>
          <template v-else>
            Ollama 
            <span v-if="message.model" class="text-gray-500 text-sm font-medium">
              {{ message.model }}
            </span>
          </template>
        </div>

        <!-- 消息内容 -->
        <div v-if="message.role === 'user'">
          <UserMessage 
            :message="message"
            :history="history"
            @edit="$emit('edit', message.id)"
            @copy="$emit('copy', message.content)"
            @showPrevious="$emit('showPrevious', message)"
            @showNext="$emit('showNext', message)"
          />
        </div>
        <div v-else>
          <AssistantMessage
            :message="message"
            :history="history"
            :isLastMessage="isLastMessage"
            @edit="$emit('edit', message.id)"
            @copy="$emit('copy', message.content)"
            @regenerate="$emit('regenerate')"
            @showPrevious="$emit('showPrevious', message)"
            @showNext="$emit('showNext', message)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: any
  messageIdx: number
  isLastMessage: boolean
  history: Record<string, any>
}

defineProps<Props>()

defineEmits<{
  (e: 'edit', messageId: string): void
  (e: 'copy', content: string): void
  (e: 'regenerate'): void
  (e: 'showPrevious', message: any): void
  (e: 'showNext', message: any): void
}>()
</script> 