// 声明环境变量
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 声明全局变量
declare global {
  interface Window {
    // 在这里添加全局 window 对象的属性
    $message: any;
  }
}

// 声明全局类型
type Message = {
  role: 'user' | 'assistant'
  content: string
  done?: boolean
}

// 导出类型
export type { Message } 