# Chatbot UI for BistuCopilot


## 开发进展

- [ ] 规范配置名称
    - [ ] ENDPOINT <-> URL 配置文件中
    - [x] isDefault <-> deletable 项目文件夹,conversation,prompt中
    - [ ] 图标写入conversation结构

- [ ] 优化按钮表现效果
- [ ] 规范功能开关，禁用修改删除
- [ ] 功能开关固定模型
- [ ] 规范Prompt的调用方式（隐式添加）
- [ ] 完善Prompt "/" 检测
- [ ] 添加动效


- [ ] 功能开关固定模型
- [ ] logo 添加地址配置


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
你需要提供要的配置，请尤其关注`DIFY_API_KEY` 和 `DIFY_API_URL` 

**4. 构建并运行**

```bash
npm run build
npm run start
```
