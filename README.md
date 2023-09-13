# Chatbot UI for BistuCopilot


## TODOS
- [ ] 规范配置名称
    - [ ] ENDPOINT <-> URL 配置文件中
    - [x] isDefault <-> deletable 项目文件夹,conversation,prompt中
    - [ ] 图标写入conversation结构

- [x] 完善对话新建机制（自动）
    - [ ] 重构PINED_CONVERSATION类型，把应用与对话分离
- [ ] 功能开关与模型对接
- [ ] 规范Prompt的调用方式（隐式添加）
- [ ] 完善Prompt "/" 检测

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
