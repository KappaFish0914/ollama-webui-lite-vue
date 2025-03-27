// import { db } from './../../../ollama-webui-lite/src/lib/stores/index';
import { unref } from "vue";
import { defineStore } from "pinia";
import type { State } from './type';



export const useChatStore = defineStore("main", {
  state: (): State => {
    return {
      db: undefined,
      chatId: "",
      title: "", // 当前对话标题
      chats: [],
      stopResponseFlag: false,
      autoScroll: true,
      models: [], // 所有可选模型
      selectedModels: [], // 选择的模型
      settings: {}, // 设置
      showSettings: false, // 显示设置
      messages: [],
      history:{ // 聊天记录
        messages: {},
        currentId: null
      }
    };
  },

  actions: {
    setDB(db: any) {
      this.db = db;
    },
    setChatId(chatId: string) {
      this.chatId = chatId;
    },
    setTitle(title: string) {
      this.title = title;
    },
    setChats(chats: any[]) {
      this.chats = chats;
    },
    
    setSTopResponseFlag(flag: boolean) {
      this.stopResponseFlag = flag;
    },
    setAutoScroll(flag: boolean) {
      this.autoScroll = flag;
    },
    setModels(models: any[]) {
      this.models = models;
    },
    setSelectedModels(model: any[]) {
      this.selectedModels = model;
    },
    setSettings(settings: any) {
      this.settings = settings;
    },
    setMessages(messages: any[]) {
      this.messages = messages;
    },
    setHistory(history: any) {
      this.history = history;
    },
    
  },
});