# Chatbot UI for BistuCopilot
## Online Demo
[eduhub.chat](https://eduhub.chat)

## 本地部署方法

**1. 克隆仓库**

```bash
git clone https://github.com/mckaywrigley/chatbot-ui.git
```

**2. 安装依赖项**

```bash
npm install
```

**3. 修改配置文件**

```bash
cp .env.local.example .env.local
```
你需要提供必要的配置，请尤其关注`DIFY_API_KEY` 和 `DIFY_API_URL` 

**4. 构建并运行**

```bash
npm run build
npm run start
```
