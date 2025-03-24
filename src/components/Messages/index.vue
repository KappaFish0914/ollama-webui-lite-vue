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
  </div>
</template>

<script lang="ts" setup>
import type { Props } from './types'

const props = withDefaults(defineProps<Props>(), {
  messages: () => [] as string[]
})

</script>

<style lang="scss"></style>