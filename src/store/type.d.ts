export type Message = {
  id: string | null;
  parentId: string | null;
  role: string | null;
  content: string | null;
  model: string | null;
  edit: boolean;
  done: boolean;
  error: boolean;
  files: Array<{
    type: string;
    url: string;
  }>;
  info: {
    eval_count: number;
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
  }
}
export type History = {  // 聊天记录
  messages: Record<string, Messages>;
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