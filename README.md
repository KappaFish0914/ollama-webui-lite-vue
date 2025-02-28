# ollama-webui-lite-vue

将 [ollama-webui-lite](https://github.com/ollama-webui/ollama-webui-lite.git) 改造成 vue3 项目

## 项目启动

```bash
nvm use 22.10.0
node -v 
v22.10.0
npm -v
8.12.2
```

## 依赖

### tailwindcss

[tailwindcss 英文官网](https://tailwindcss.com/docs/installation/using-vite)

```bash
npm install tailwindcss @tailwindcss/vite
```


注意,如果用的 tailwindcss 的**[中文官网](https://www.tailwindcss.cn/docs/installation)**,那么需要安装 v3.x 版本
```bash
npm install tailwindcss@3 -D
```
2025/02/27 tailwindcss 出了 v4.x 版本，但是**[中文官网](https://www.tailwindcss.cn/docs/installation)**没有 v4.x的文档
依然是 v3.4.17 版本的文档

v4.x 版本因为没有 init 方法，使用**[中文官网](https://www.tailwindcss.cn/docs/installation)**的文档 npx tailwindcss init 会报错