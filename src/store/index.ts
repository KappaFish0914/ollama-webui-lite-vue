import { db } from './../../../ollama-webui-lite/src/lib/stores/index';
import { defineStore } from "pinia";

type State = {
  db: any;
  chatId: string;
  chats: any[];
  models: any[]; // 所有可选模型
  selectedModels: any[]; // 选择的模型
  settings: any;
  showSettings: boolean;
};

export const useChatStore = defineStore("main", {
  state: (): State => {
    return {
      db: undefined,
      chatId: "",
      chats: [],
      models: [], // 所有可选模型
      selectedModels: [], // 选择的模型
      settings: {}, // 设置
      showSettings: false // 显示设置
    };
  },

  actions: {
    setDB(db: any) {
      this.db = db;
    },
    setChats(chats: any[]) {
      this.chats = chats;
    },
    setChatId(chatId: string) {
      this.chatId = chatId;
    },
    setModels(models: any[]) {
      this.models = models;
    },
    setSelectedModels(model: any[]) {
      this.selectedModels = model;
    },
  },
});