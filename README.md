# Xinsd 苍蝇饭馆 - 智能菜谱生成应用

[![GitHub stars](https://img.shields.io/github/stars/duxs-code/xinsd-diner?style=flat-square)](https://github.com/duxs-code/xinsd-diner/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/duxs-code/xinsd-diner?style=flat-square)](https://github.com/duxs-code/xinsd-diner/network)
[![GitHub issues](https://img.shields.io/github/issues/duxs-code/xinsd-diner?style=flat-square)](https://github.com/duxs-code/xinsd-diner/issues)
[![License](https://img.shields.io/github/license/duxs-code/xinsd-diner?style=flat-square)](https://github.com/duxs-code/xinsd-diner/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

一个基于 Next.js 和 SQLite 的现代化食材管理和智能菜谱生成应用。用户可以浏览食材、添加到菜篮子，然后基于选择的食材和个人要求生成个性化菜谱，并配有 AI 生成的精美菜品图片。

> 🚀 **最新更新**: 项目已开源并托管在GitHub，欢迎Star和Fork！

## ✨ 核心功能

- 🛍️ **食材管理** - 浏览、搜索、添加、删除食材，支持分类管理
- 🛒 **菜篮子功能** - 智能菜篮子，支持食材添加和管理
- 🍳 **智能菜谱生成** - 基于 AI 的个性化菜谱生成，支持多种烹饪要求
- 🖼️ **AI 配图功能** - 自动为菜品生成精美图片，提升视觉体验
- 📱 **响应式设计** - 完美适配移动端、平板和桌面端
- 🧹 **智能图片管理** - 自动清理无用图片，优化存储空间

## 🌟 项目特色

- **🤖 双AI驱动**: 结合Google Gemini和阿里云千问AI，提供文本生成和图像生成的完整解决方案
- **🎨 现代化UI**: 基于shadcn/ui组件库，提供优雅的用户界面和流畅的交互体验
- **⚡ 高性能**: SQLite数据库 + Next.js 15，确保快速响应和优秀的用户体验
- **🔧 开发友好**: 完整的TypeScript支持，严格的代码规范，丰富的开发工具
- **📦 一键部署**: 支持Vercel等平台的零配置部署

## 🛠️ 技术栈

- **前端**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes, SQLite + better-sqlite3
- **AI 服务**: 阿里云千问 AI (图片生成), Google Gemini (菜谱生成)
- **UI 组件**: Radix UI, shadcn/ui
- **状态管理**: React Context
- **图标**: Lucide React
- **Markdown 渲染**: ReactMarkdown

## 📋 系统要求

- Node.js 18.0+
- npm 或 yarn 或 pnpm
- 2GB+ 可用磁盘空间 (用于图片存储)
- 稳定的互联网连接 (AI 服务调用)

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd xinsd-diner
```

### 2. 安装依赖

```bash
npm install
# 或者
pnpm install
```

### 3. 初始化数据库

```bash
npm run init:db
```

### 4. 配置环境变量

如需使用 AI 功能，需要配置 API 密钥：

```bash
cp .env.example .env.local
# 然后编辑 .env.local 文件，填入真实的API密钥
```

**环境变量配置：**

```env
# AI服务配置 (必需)
QWEN_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 图片存储配置 (可选，有默认值)
UPLOAD_BASE_PATH=uploads
TEMP_IMAGES_PATH=temp
RECIPE_IMAGES_PATH=recipes
ITEM_IMAGES_PATH=items
CATEGORY_IMAGES_PATH=categories

# 应用配置
NODE_ENV=development
```

**详细的 API 密钥获取指南：** 📖 [API 密钥获取指南](./API_KEYS_GUIDE.md)

### 5. 验证配置

```bash
npm run validate:config
```

### 6. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动。

## 🧪 测试

```bash
# 验证配置
npm run validate:config

# 测试Google Gemini API
npm run test:gemini

# 测试千问AI生图API
npm run test:qwen

# 数据库测试
npm run test:db

# API功能测试
npm run test:api

# 图片管理测试
npm run cleanup:images

# 运行所有测试
npm run test:all
```

## 📁 项目结构

```
xinsd-diner/
├── app/                    # Next.js App Router
│   ├── api/v1/            # API路由
│   │   ├── categories/    # 分类管理API
│   │   ├── menu/          # 食材管理API
│   │   ├── recipes/       # 菜谱生成API
│   │   ├── ai/            # AI图片生成API
│   │   ├── images/        # 图片管理API
│   │   └── admin/         # 管理员API
│   ├── checkout/          # 菜谱生成页面
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── ui/               # 基础UI组件 (shadcn/ui)
│   ├── add-item-dialog.tsx        # 添加食材对话框
│   ├── add-category-dialog.tsx    # 添加分类对话框
│   ├── menu-item-card.tsx         # 食材卡片
│   └── category-selector.tsx      # 分类选择器
├── contexts/             # React Context
├── lib/                  # 工具库和配置
│   ├── database-sqlite.ts # SQLite数据库
│   ├── image-manager.ts  # 图片管理系统
│   └── startup-init.ts   # 启动初始化
├── scripts/              # 脚本文件
├── data/                 # 数据库文件
├── public/uploads/       # 图片存储
│   ├── temp/            # 临时图片
│   ├── recipes/         # 菜谱图片
│   ├── items/           # 食材图片
│   └── categories/      # 分类图片
└── styles/               # 样式文件
```

## 🔧 主要功能

### 食材管理

- **浏览食材** - 按分类浏览各种食材
- **搜索功能** - 根据名称和描述搜索食材
- **分类管理** - 创建、编辑、删除食材分类
- **食材管理** - 添加、编辑、删除食材信息
- **图片上传** - 支持食材和分类图片上传

### 智能菜谱生成

- **智能生成** - 基于菜篮子食材生成菜谱
- **个性化要求** - 支持设置菜品数量、辣度、忌口等
- **AI 配图** - 自动为菜品生成精美图片
- **Markdown 渲染** - 美观的菜谱展示

### 图片管理系统

- **智能分类存储** - 临时图片和正式图片分开管理
- **生命周期管理** - 从生成到清理的完整流程
- **自动清理** - 定时清理无用图片，节省存储空间

## 🎯 使用指南

### 1. 食材管理

- **浏览食材**: 选择分类查看不同类型的食材
- **搜索功能**: 使用搜索框快速找到需要的食材
- **添加食材**: 点击"+"按钮添加新食材，支持图片上传
- **管理操作**: 长按食材进入选择模式，支持批量删除

### 2. 菜谱生成

- **选择食材**: 点击食材卡片添加到菜篮子
- **设置要求**: 在结算页面设置菜品数量、辣度、忌口等
- **生成菜谱**: 点击生成按钮，AI 将创建个性化菜谱和配图
- **查看结果**: 浏览生成的菜谱内容和精美图片

### 3. 图片功能

- **自动生图**: 菜谱生成时自动为菜品创建图片
- **图片管理**: 系统自动管理图片存储和清理
- **手动上传**: 支持手动上传食材和分类图片

## 🎨 AI 功能详解

### Google Gemini API - 菜谱生成

- **智能内容生成**: 根据食材和要求生成详细菜谱
- **个性化定制**: 支持菜品数量、辣度、忌口、特殊要求等
- **Markdown 格式**: 生成结构化的菜谱内容，便于展示

### 千问 AI API - 图片生成

- **自动配图**: 为菜谱中的菜品自动生成精美图片
- **智能识别**: 自动提取菜谱中的菜品名称并生成对应图片
- **高清质量**: 1472x1140 高清分辨率图片
- **智能提示词**: 根据菜品名称自动构建生图提示

### 图片管理流程

1. **图片生成**: AI 生成图片保存到临时目录
2. **菜品提取**: 智能解析菜谱内容，提取菜品名称
3. **内容整合**: 将图片插入到菜谱的对应位置
4. **存储管理**: 图片从临时目录移动到永久存储
5. **自动清理**: 定期清理无用的临时图片

## 📊 数据库设计

### SQLite 数据库结构

#### categories (分类表)

- `id` - 自增主键
- `code` - 分类代码 (vegetables, meat, etc.)
- `name` - 分类名称
- `image` - 分类图片
- `sort_order` - 排序顺序

#### menu_items (食材表)

- `id` - 自增主键
- `name` - 食材名称
- `description` - 食材描述
- `category_id` - 分类 ID (外键)
- `image` - 食材图片
- `status` - 状态 (1:启用, 0:禁用)

#### recipes (菜谱表)

- `id` - 自增主键
- `content` - 菜谱内容 (Markdown 格式)
- `cart_items` - 菜篮子食材 (JSON 格式)
- `requirements` - 烹饪要求 (JSON 格式)
- `created_at` - 创建时间

#### images (图片管理表)

- `id` - 自增主键
- `filename` - 文件名
- `filepath` - 文件路径
- `url` - 访问 URL
- `type` - 图片类型 (recipe, temp, user)
- `recipe_id` - 关联菜谱 ID

## 🚀 部署

### 生产环境

```bash
# 构建应用
npm run build

# 启动生产服务器
npm start
```

### 推荐平台

- **Vercel** - 零配置部署，自动 CI/CD
- **Netlify** - 静态站点部署
- **自建服务器** - 支持 Docker 部署

### 环境变量配置

生产环境需要配置以下环境变量：

- `QWEN_API_KEY` - 千问 AI API 密钥
- `GOOGLE_GEMINI_API_KEY` - Google Gemini API 密钥
- `NODE_ENV=production`

## 🔍 故障排除

### 常见问题

#### 数据库问题

```bash
# 重新初始化数据库
npm run init:db

# 测试数据库连接
npm run test:db
```

#### 图片问题

```bash
# 清理图片缓存
npm run cleanup:images

# 检查图片目录权限
chmod 755 public/uploads/
```

#### API 问题

```bash
# 测试API功能
npm run test:api

# 检查环境变量配置
cat .env.local
```

### API 错误处理

- **401 Unauthorized**: 检查 API 密钥配置
- **403 Forbidden**: 检查账户余额和权限
- **429 Too Many Requests**: 降低调用频率
- **图片生成失败**: 检查网络连接和 API 密钥

## 📈 性能优化

### 图片优化

- 图片懒加载
- 自动压缩和优化
- CDN 集成 (未来)

### 数据库优化

- 索引优化
- 定期 VACUUM 操作
- 查询优化

### API 优化

- 请求频率限制
- 错误重试机制
- 并发控制

## 🔮 未来规划

### 短期优化 (1-3 个月)

- [ ] 图片压缩和优化
- [ ] 菜谱收藏功能
- [ ] 用户评分系统
- [ ] 制作分享功能

### 中期扩展 (3-6 个月)

- [ ] 个性化推荐系统
- [ ] 营养分析功能
- [ ] 社交功能 (评论、分享)
- [ ] 移动端 APP

### 长期愿景 (6 个月+)

- [ ] 多 AI 模型支持
- [ ] 商业化功能
- [ ] 国际化支持
- [ ] 企业版功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发规范

- 使用 TypeScript 进行开发
- 遵循 ESLint 代码规范
- 提交前运行测试
- 编写清晰的提交信息

### 项目维护

- 定期更新依赖
- 监控性能指标
- 备份重要数据
- 关注安全更新

## 📞 技术支持

### 获取帮助

- **文档**: 查看项目 README 和 API 文档
- **问题反馈**: 提交 GitHub Issue
- **开发讨论**: 参与项目讨论区

### 联系方式

- **项目维护**: Xinsd 苍蝇饭馆开发团队
- **技术支持**: 通过 GitHub Issues

## 📄 许可证

MIT License

---

**🎉 享受智能菜谱生成的完整体验！**

**更多详细信息请查看：**

- 📖 [API 密钥获取指南](./API_KEYS_GUIDE.md)
- 📚 [完整项目文档](./PROJECT_DOCUMENTATION.md)
