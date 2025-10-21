# 更新日志

所有重要的项目更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增
- 项目开源并托管到GitHub
- 添加项目徽章和特色介绍
- 完善项目文档和使用指南

## [1.0.0] - 2025-10-21

### 新增
- 🎉 初始版本发布
- 🛍️ 食材管理系统
  - 食材浏览和搜索功能
  - 分类管理功能
  - 食材CRUD操作
- 🛒 智能购物车
  - 食材添加和移除
  - 购物车状态管理
- 🍳 AI菜谱生成
  - 基于Google Gemini的智能菜谱生成
  - 支持个性化烹饪要求
  - Markdown格式菜谱展示
- 🖼️ AI图片生成
  - 基于阿里云千问AI的图片生成
  - 自动为菜品生成配图
  - 智能图片管理系统
- 📱 响应式设计
  - 移动端适配
  - 现代化UI组件
- 🔧 开发工具
  - 数据库初始化脚本
  - API测试工具
  - 图片清理工具
  - 配置验证工具

### 技术栈
- **前端**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes, SQLite + better-sqlite3
- **AI服务**: Google Gemini API, 阿里云千问AI API
- **UI组件**: Radix UI, shadcn/ui
- **状态管理**: React Context
- **开发工具**: ESLint, TypeScript, pnpm

### 数据库结构
- `categories` - 食材分类表
- `menu_items` - 食材信息表
- `recipes` - 菜谱记录表
- `images` - 图片管理表

### API接口
- `/api/v1/categories/*` - 分类管理API
- `/api/v1/menu/*` - 食材管理API
- `/api/v1/recipes/generate` - 菜谱生成API
- `/api/v1/ai/generate-image` - AI图片生成API
- `/api/v1/upload/image` - 图片上传API
- `/api/v1/admin/cleanup-images` - 图片清理API

---

## 版本说明

- **[未发布]** - 正在开发中的功能
- **[主版本.次版本.修订版本]** - 已发布的版本
- **新增** - 新功能
- **变更** - 现有功能的变更
- **弃用** - 即将移除的功能
- **移除** - 已移除的功能
- **修复** - 问题修复
- **安全** - 安全相关的修复