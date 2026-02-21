# Mnemonic Flashcards / 记忆大师单词卡

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## English

### Introduction
**Mnemonic Flashcards** is an aesthetic and intelligent flashcard application designed to help language learners master confusing words (e.g., *Dominate*, *Nominate*, *Intimidate*). Powered by Google's **Gemini AI**, it automatically generates Chinese translations, mnemonics, definitions, and bilingual examples for any word group you input.

### Key Features
- **AI-Powered Content**: Automatically generates high-quality study materials using Gemini AI.
- **Confusing Words Comparison**: Designed to learn groups of similar or confusing words together.
- **Aesthetic UI**: Clean, distraction-free interface with multiple color themes (Sage, Cream, Mist, etc.).
- **Batch Creation**: Support for adding multiple word groups at once via the Batch Add feature.
- **Data Management**:
  - **Local Persistence**: All cards are automatically saved to your browser's local storage.
  - **Import/Export**: Backup your flashcards to a JSON file and restore them anytime.
- **Study Modes**:
  - **Flashcard Mode**: Focus on one card at a time with smooth flip animations.
  - **Overview Mode**: Grid view to manage, search, and delete card sets.
- **Smart Tools**: Bookmarking, Random Shuffle, and Latest sorting.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

### Getting Started

#### Prerequisites
- Node.js (v18 or higher recommended)
- A Google Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/))

#### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mnemonic-flashcards
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.

### Deployment

To build the application for production:

1. **Build the project**
   ```bash
   npm run build
   ```
   This will generate static files in the `dist` directory.

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy**: You can deploy the `dist` folder to any static hosting service like Vercel, Netlify, or GitHub Pages.

---

<a name="chinese"></a>
## 中文 (Chinese)

### 项目简介
**记忆大师单词卡 (Mnemonic Flashcards)** 是一款设计精美、智能化的单词记忆应用。它专为攻克易混淆词汇（如 *Dominate*, *Nominate*, *Intimidate*）而设计。借助 Google **Gemini AI** 的强大能力，它能为您输入的单词组自动生成中文翻译、记忆助记符、释义以及双语例句。

### 主要功能
- **AI 智能生成**: 利用 Gemini AI 自动生成高质量的学习内容。
- **易混词辨析**: 专为同时学习一组相似或易混淆单词而设计。
- **唯美 UI 设计**: 简洁、无干扰的界面，提供多种配色主题（鼠尾草绿、奶油白、薄雾蓝等）。
- **批量创建**: 支持通过“批量添加”功能一次性输入多组单词。
- **数据管理**:
  - **本地存储**: 所有卡片自动保存在浏览器本地，无需登录。
  - **导入/导出**: 支持将卡片数据备份为 JSON 文件，随时恢复。
- **学习模式**:
  - **卡片模式**: 专注单张卡片学习，拥有流畅的翻转动画。
  - **概览模式**: 网格视图，支持搜索、管理和删除卡片组。
- **智能工具**: 支持收藏夹、随机乱序复习和按最新排序。
- **响应式设计**: 完美适配桌面端和移动端设备。

### 快速开始

#### 前置要求
- Node.js (建议 v18 或更高版本)
- Google Gemini API Key (可在 [Google AI Studio](https://aistudio.google.com/) 获取)

#### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd mnemonic-flashcards
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   在项目根目录下创建一个 `.env` 文件，并添加您的 Gemini API Key：
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   应用将在 `http://localhost:3000` 启动。

### 部署

构建生产环境版本：

1. **构建项目**
   ```bash
   npm run build
   ```
   此命令将在 `dist` 目录下生成静态文件。

2. **预览构建结果**
   ```bash
   npm run preview
   ```

3. **部署**: 您可以将 `dist` 文件夹部署到任何静态托管服务，如 Vercel, Netlify 或 GitHub Pages。
