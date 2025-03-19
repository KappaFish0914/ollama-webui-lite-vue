import { defineStore } from "pinia";

type State = {
  db: any;
  chatId: string;
  chats: any[];
  models: any[];
  settings: any[];
  showSettings: boolean;
};

export const useChatStore = defineStore("main", {
  state: (): State => {
    return {
      db: undefined,
      chatId: "",
      chats: [],
      models: [],
      settings: [],
      showSettings: false
    };
  },

  actions: {
    setChats(chats: any[]) {
      this.chats = chats;
    },
    setChatId(chatId: string) {
      this.chatId = chatId;
    },
  },
});