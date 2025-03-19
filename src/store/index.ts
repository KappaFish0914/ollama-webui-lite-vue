import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => {
    return {
      count: 0,
    };
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});