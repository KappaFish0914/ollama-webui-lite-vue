<template>
  <div class="flex self-center">
    <n-button
      text
      class="self-center"
      @click="$emit('previous')"
    >
      <template #icon>
        <ChevronLeftIcon />
      </template>
    </n-button>

    <div class="text-xs font-bold self-center">
      {{ currentIndex }} / {{ totalCount }}
    </div>

    <n-button
      text
      class="self-center"
      @click="$emit('next')"
    >
      <template #icon>
        <ChevronRightIcon />
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'
import ChevronLeftIcon from '../icons/ChevronLeftIcon.vue'
import ChevronRightIcon from '../icons/ChevronRightIcon.vue'

interface Props {
  message: any
  history: Record<string, any>
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'previous'): void
  (e: 'next'): void
}>()

const currentIndex = computed(() => {
  if (props.message.parentId !== null) {
    return props.history.messages[props.message.parentId].childrenIds.indexOf(props.message.id) + 1
  }
  return Object.values(props.history.messages)
    .filter(m => m.parentId === null)
    .map(m => m.id)
    .indexOf(props.message.id) + 1
})

const totalCount = computed(() => {
  if (props.message.parentId !== null) {
    return props.history.messages[props.message.parentId].childrenIds.length
  }
  return Object.values(props.history.messages).filter(m => m.parentId === null).length
})
</script> 