# BuddyLine

一个现代化的 AI 陪伴式聊天应用，通过多个独特的虚拟人格提供自然、富有情感的对话体验。

[English Documentation](README.md)

## ✨ 特性

- **多人格系统** - 内置 3 个精心设计的 AI 人格角色，每个都有独特的性格、背景和交流风格
- **自定义人格** - 支持创建、编辑和管理自定义 AI 人格
- **会话管理** - 多会话支持，可随时切换和管理不同的聊天记录
- **智能消息分割** - AI 回复自动分割为多条短消息，模拟真实即时通讯体验
- **导出功能** - 支持将聊天记录导出为 TXT 或 JSON 格式
- **深色模式** - 内置明暗主题切换
- **响应式设计** - 完美适配桌面端和移动端
- **本地存储** - 所有数据保存在浏览器本地，保护隐私
- **灵活配置** - 支持自定义 API 端点、模型选择和参数调整

## 🎭 内置人格

### Iris Vale - 艺术设计师
28 岁的数字产品和视觉设计师，温柔、体贴、善于观察。擅长用人性化的方式提供设计建议，帮助用户在感到不知所措时理清思路。

### Evan Brooks - 电台主持人
35 岁的深夜电台主持人，温暖、沉稳、富有同理心。擅长倾听和讲故事，营造如同深夜电台般的亲切氛围。

### Luna Hart - 视觉艺术家
24 岁的自由画家，富有想象力、表达力强、略带梦幻气质。善于用创意语言帮助用户表达情感，鼓励自我表达和实验。

## 🚀 快速开始

### 前置要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器
- OpenAI API 密钥（或兼容的 API 服务）

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/buddyline.git

# 进入项目目录
cd buddyline

# 安装依赖
npm install
```

### 运行

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm start
```

应用将在 `http://localhost:3000` 启动。

### 配置

首次使用时，点击左侧边栏的 **⚙️ Settings** 按钮进行配置：

1. **API Key** - 输入你的 OpenAI API 密钥
2. **Base URL** - API 端点地址（默认：`https://api.openai.com/v1`）
3. **Model** - 选择使用的 AI 模型
4. **Temperature** - 调整回复的创造性（0-2）
5. **Custom Models** - 添加自定义模型名称

## 📖 使用指南

### 开始对话

1. 在顶部选择一个 AI 人格
2. 在底部输入框输入消息
3. 按 Enter 或点击发送按钮

### 管理会话

- **新建会话** - 点击侧边栏的 "New Chat" 按钮
- **切换会话** - 点击侧边栏的历史会话
- **编辑标题** - 悬停在会话上，点击 ✏️ 图标
- **删除会话** - 悬停在会话上，点击 🗑️ 图标

### 自定义人格

1. 点击顶部人格选择器的 "+" 按钮
2. 填写人格信息：
   - 基本信息（姓名、角色、性别、年龄）
   - 背景故事
   - 性格特点
   - 兴趣爱好
   - 交流风格
   - 独特特质
   - 系统提示词
3. 保存后即可使用

### 导出聊天记录

1. 点击侧边栏的 "Export Chat" 按钮
2. 选择导出格式：
   - **TXT** - 纯文本格式，便于阅读
   - **JSON** - 结构化数据，便于处理

## 🛠️ 技术栈

- **框架** - [Next.js 14](https://nextjs.org/) (App Router)
- **语言** - [TypeScript](https://www.typescriptlang.org/)
- **样式** - [Tailwind CSS](https://tailwindcss.com/)
- **AI 集成** - [OpenAI API](https://openai.com/api/)
- **状态管理** - React Hooks + Context API
- **数据持久化** - LocalStorage

## 📁 项目结构

```
buddyline/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/chat/       # API 路由
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 主页面
│   │   └── globals.css     # 全局样式
│   ├── components/         # React 组件
│   │   ├── ChatInterface.tsx
│   │   ├── PersonaSelector.tsx
│   │   └── SettingsModal.tsx
│   ├── contexts/           # React Context
│   │   └── ThemeContext.tsx
│   ├── data/              # 静态数据
│   │   └── personas.ts
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts
│   └── utils/             # 工具函数
│       ├── ai.ts
│       ├── helpers.ts
│       └── storage.ts
├── public/                # 静态资源
└── package.json
```

## 🔒 隐私与安全

- 所有聊天记录仅保存在浏览器本地存储中
- API 密钥存储在本地，不会上传到任何服务器
- 应用不收集任何用户数据
- 建议使用环境变量管理敏感信息（生产环境）

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢 pollinations.ai 提供强大的 AI 能力
- 感谢所有开源项目的贡献者

## 📮 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/yourusername/buddyline/issues)
- 发送邮件至：your.email@example.com

---

用 ❤️ 打造，让 AI 对话更有温度
