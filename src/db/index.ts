import { unref } from "vue";
import { openDB } from "idb";
import { useChatStore } from "@/store";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "vue-router";

export async function getDB() {
  // openDB(数据库名称, 数据库版本号, 配置项)
  const chatStore = useChatStore()
  const router = useRouter()
  const DB = await openDB("Chats", 1, {
    // 数据库不存在或版本号发生变化时执行
    upgrade(db) {
      // 创建一个名为 "chats" 的 ObjectStore （类似于 关系数据库 中的 表）
      const store = db.createObjectStore(
        "chats", {
          keyPath: "id", 
          autoIncrement: true 
        }
      )
      // 创建索引
      store.createIndex("timestamp", "timestamp")
    }
  })

  return {
    db: DB,
    getChatById: async function(id: string) {
      return await this.db.get("chats", id);
    },
    getChats: async function() {
      let chats = await this.db.getAllFromIndex("chats", "timestamp");
      // 数组从后向前重新排列
      chats = chats.map((item, idx) => {
        return {
					title: chats[chats.length - 1 - idx].title,
					id: chats[chats.length - 1 - idx].id
				}
      })
      return chats;
    },
    exportChats: async function() {
      let chats = await this.db.getAllFromIndex("chats", "timestamp");
      // 数组从后向前重新排列
      chats = chats.map((item, idx) => {
        return chats[chats.length - 1 - idx]
      })
      return chats;
    },
    addChats: async function (_chats: any[]) {
      for (const chat of _chats) {
        await this.addChat(chat)
      }
      chatStore.setChats(await this.getChats())
    },
    addChat: async function (chat: any) {
      await this.db.add("chats", {
        ...unref(chat)
      })
    },
    createNewChat: async function (chat: any) {
      await this.addChat({ ...chat, timestamp: Date.now() })
      chatStore.setChats(await this.getChats())
    },
    updateChatById: async function(id: string, updated: any) {
      const chat = await this.getChatById(id)

      await this.db.put("chats", {
        ...chat,
        ...updated,
        timestamp: Date.now()
      })

      chatStore.setChats(await this.getChats())
    },
    deleteChatById: async function(id: string) {
      // 如果删除的是当前chat，则清空页面，
      // 然后新建一个chat （但是不存到 indexDB 里面）
      if (chatStore.chatId === id) {
        router.push("/")
        chatStore.setChatId(uuidv4())
      }
      await this.db.delete("chats", id)
      chatStore.setChats(await this.getChats())
    },
    deleteAllChat: async function() {
      // 清空所有数据
      // 使用 transaction 创建一个 读写事务。操作对象为 "chats" 的 ObjectStore
      const tx = this.db.transaction("chats", "readwrite");
			await Promise.all([tx.store.clear(), tx.done]);

      chatStore.setChats(await this.getChats())
    }
  }
}
