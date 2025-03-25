export type History = {  // 聊天记录
  messages: any;
  currentId: string | null;
};
export type State = {
  db: any;
  chatId: string;
  title: string; // 当前对话标题
  stopResponseFlag: boolean; // 停止回复
  autoScroll: boolean; // 滚动消息
  chats: any[];
  models: any[]; // 所有可选模型
  selectedModels: any[]; // 选择的模型
  settings: any;
  showSettings: boolean;
  messages: any[];
  history: History; // 聊天记录
};