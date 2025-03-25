<template>
  <div class="model-selector px-4">
    <div class="flex flex-col my-2 px-3">
      <template v-for="(selectedModel, selectedModelIdx) in selectedModels">
        <div class="flex">
          <select
            id="models"
            class="outline-none bg-transparent text-lg font-semibold rounded-lg block w-full placeholder-gray-400"
            v-model="selectedModels[selectedModelIdx]"
            :disabled="disabled"
          >
            <option class=" text-gray-700" value="" selected>
              选择模型
            </option>
            <template v-for="model in $models">
              <hr v-if="model.name === 'hr'" />
              <option v-else :value="model.name" class="text-gray-700 text-lg">
                {{ model.name }}
              </option>
            </template>
          </select>
          <template v-if="selectedModelIdx === 0">
            <button
              :class="['self-center', selectedModelIdx === 0 ? 'mr-3' : 'mr-7', 'disabled:text-gray-600', 'disabled:hover:text-gray-600']"
              :disabled="selectedModels.length === 3 || disabled"
              @click="handleAdd"
            >
              <img src="./addModel.svg" class="w-4 h-4" />
            </button>
          </template>
          <template v-else>
            <button
              :class="['self-center', 'disabled:text-gray-600', 'disabled:hover:text-gray-600', selectedModelIdx === 0 ? 'mr-3' : 'mr-16']"
              :disabled="disabled"
              @click="() => handleDelete(selectedModelIdx)"
            >
              <img src="./deleteModel.svg" class="w-4 h-4" />
            </button>
          </template>

          <template v-if="selectedModelIdx === 0">
            <button
              class=" self-center dark:hover:text-gray-300"
              @click="handleShowSettings"
            >
              <img src="./settings.svg" class="w-4 h-4" />
            </button>
          </template>
        </div>
      </template>
    </div>

    <div class="text-left mt-1.5 text-xs text-gray-500">
      <button @click="saveDefaultModel">设为默认模型</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useChatStore } from '@/store/index';

const store = useChatStore();

let selectedModels = ref<any[]>([""])

let $models = computed(() => {
  let result = store.models;
  return result;
})

let disabled = ref(false)

function handleAdd() {
  if (selectedModels.value.length < 3) {
    selectedModels.value = [...selectedModels.value, ""];
  }
}

function handleDelete(selectedModelIdx: number) {
  selectedModels.value.splice(selectedModelIdx, 1);
}

watch(() => selectedModels.value, (newValue) => {
  store.setSelectedModels([...newValue])
}, {
  deep: true
})
/**
 * @description 设为默认模型
 */
function saveDefaultModel() {
  // TODO 设为默认模型
}
/**
 * @description 展示设置
 */
function handleShowSettings() {
  // TODO 展示设置
  // await showSettings.set(true);
}

</script>

<style lang="scss"></style>