# Vercel 部署指南

## 🚀 在 Vercel 上部署 Xinsd 苍蝇饭馆

本指南将帮助你将项目部署到 Vercel 平台并发布为在线服务。

## 📋 部署前准备

### 1. 确保代码已推送到 GitHub

```bash
# 检查 git 状态
git status

# 如果有未提交的更改，先提交
git add .
git commit -m "准备部署到 Vercel"
git push origin main
```

### 2. 准备 API 密钥

在部署前，你需要获取以下 API 密钥：

#### 🔑 千问 AI API 密钥
1. 访问 [阿里云 DashScope](https://dashscope.aliyun.com/)
2. 注册/登录账号
3. 创建 API Key
4. 复制密钥（格式：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

#### 🔑 Google Gemini API 密钥
1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 登录 Google 账号
3. 创建新的 API Key
4. 复制密钥（格式：`AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

## 🌐 Vercel 部署步骤

### 步骤 1: 访问 Vercel

1. 打开 [https://vercel.com/](https://vercel.com/)
2. 点击 **"Sign Up"** 或 **"Login"**
3. 选择 **"Continue with GitHub"** 使用 GitHub 账号登录

### 步骤 2: 导入项目

1. 登录后，点击 **"New Project"** 或 **"Add New..."** → **"Project"**
2. 在 **"Import Git Repository"** 部分找到你的项目
   - 项目名称：`xinsd-diner` 或你的仓库名
   - 如果没有看到，点击 **"Adjust GitHub App Permissions"** 授权访问
3. 点击项目旁边的 **"Import"** 按钮

### 步骤 3: 配置项目

#### 3.1 项目设置
- **Project Name**: `xinsd-diner` (或自定义名称)
- **Framework Preset**: Next.js (应该自动检测)
- **Root Directory**: `./` (保持默认)

#### 3.2 构建设置
- **Build Command**: `npm run build` (保持默认)
- **Output Directory**: `.next` (保持默认)
- **Install Command**: `npm install` (保持默认)

### 步骤 4: 配置环境变量

在 **"Environment Variables"** 部分添加以下变量：

```env
# 必需的 AI 服务配置
QWEN_API_KEY=sk-your-qwen-api-key-here
GOOGLE_GEMINI_API_KEY=AIzaSy-your-gemini-api-key-here

# 应用配置
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

# 图片存储配置 (可选，有默认值)
UPLOAD_BASE_PATH=uploads
TEMP_IMAGES_PATH=temp
RECIPE_IMAGES_PATH=recipes
ITEM_IMAGES_PATH=items
CATEGORY_IMAGES_PATH=categories
```

**重要提示**：
- 将 `your-qwen-api-key-here` 替换为实际的千问 API 密钥
- 将 `your-gemini-api-key-here` 替换为实际的 Gemini API 密钥
- 将 `your-app-name` 替换为你的 Vercel 应用名称

### 步骤 5: 部署

1. 确认所有配置正确后，点击 **"Deploy"**
2. Vercel 将开始构建和部署过程
3. 等待部署完成（通常需要 2-5 分钟）

## 🔧 部署后配置

### 1. 数据库初始化

由于 Vercel 是无服务器环境，SQLite 数据库需要特殊处理：

#### 方案 A: 使用 Vercel Postgres (推荐)

1. 在 Vercel 项目面板中，点击 **"Storage"** 标签
2. 点击 **"Create Database"** → **"Postgres"**
3. 按照提示创建数据库
4. 复制连接字符串到环境变量 `DATABASE_URL`

#### 方案 B: 保持 SQLite (临时方案)

SQLite 在 Vercel 上有限制，每次部署都会重置数据。适合演示使用。

### 2. 更新环境变量

在 Vercel 项目设置中更新 `NEXT_PUBLIC_APP_URL`：

```env
NEXT_PUBLIC_APP_URL=https://your-actual-vercel-url.vercel.app
```

### 3. 重新部署

更新环境变量后，触发重新部署：
1. 在 Vercel 项目面板中，点击 **"Deployments"** 标签
2. 点击最新部署旁边的 **"..."** → **"Redeploy"**

## 🌍 访问你的应用

部署成功后，你将获得：

- **生产 URL**: `https://your-app-name.vercel.app`
- **预览 URL**: 每次 git push 都会生成预览链接
- **自定义域名**: 可在项目设置中配置

### 默认登录信息

- **用户名**: `admin`
- **密码**: `admin`

**⚠️ 重要**: 首次登录后请立即修改默认密码！

## 📊 监控和管理

### Vercel 面板功能

1. **Analytics**: 查看访问统计
2. **Functions**: 监控 API 性能
3. **Deployments**: 管理部署历史
4. **Settings**: 配置域名、环境变量等

### 日志查看

1. 在项目面板中点击 **"Functions"** 标签
2. 选择具体的 API 路由查看日志
3. 用于调试 API 问题

## 🔄 持续部署

### 自动部署

Vercel 已自动配置 CI/CD：
- 每次推送到 `main` 分支都会触发生产部署
- 推送到其他分支会创建预览部署

### 手动部署

```bash
# 本地构建测试
npm run build

# 推送到 GitHub 触发部署
git add .
git commit -m "更新功能"
git push origin main
```

## 🛠️ 故障排除

### 常见问题

#### 1. 构建失败

**错误**: `Build failed`

**解决方案**:
```bash
# 本地测试构建
npm run build

# 检查 TypeScript 错误
npm run lint
```

#### 2. API 密钥错误

**错误**: `AI API 调用失败`

**解决方案**:
1. 检查环境变量是否正确设置
2. 验证 API 密钥是否有效
3. 确认 API 配额是否充足

#### 3. 数据库问题

**错误**: `Database connection failed`

**解决方案**:
1. 如果使用 SQLite，数据会在每次部署时重置
2. 考虑迁移到 Vercel Postgres
3. 检查数据库初始化脚本

#### 4. 图片上传问题

**错误**: `Image upload failed`

**解决方案**:
1. Vercel 的文件系统是只读的
2. 考虑使用 Vercel Blob 或 Cloudinary
3. 或者禁用图片上传功能

### 调试技巧

1. **查看构建日志**: 在 Vercel 面板的 Deployments 中查看详细日志
2. **本地测试**: 使用 `npm run build` 本地测试构建
3. **环境变量**: 确保所有必需的环境变量都已设置
4. **API 测试**: 使用浏览器开发者工具检查 API 调用

## 🔒 安全建议

### 生产环境安全

1. **修改默认密码**: 首次登录后立即修改 admin 密码
2. **API 密钥安全**: 不要在代码中硬编码 API 密钥
3. **HTTPS**: Vercel 自动提供 HTTPS
4. **环境变量**: 敏感信息只存储在环境变量中

### 访问控制

1. **管理员权限**: 谨慎分配管理员权限
2. **用户注册**: 考虑是否需要开放用户注册
3. **API 限制**: 监控 API 调用频率

## 📈 性能优化

### Vercel 优化

1. **Edge Functions**: 利用 Vercel 的边缘计算
2. **图片优化**: 使用 Next.js Image 组件
3. **缓存策略**: 配置适当的缓存头
4. **Bundle 分析**: 使用 Vercel 的 Bundle Analyzer

### 监控指标

1. **Core Web Vitals**: 在 Vercel Analytics 中查看
2. **API 性能**: 监控 API 响应时间
3. **错误率**: 跟踪应用错误

## 🎉 部署完成检查清单

- [ ] 项目成功部署到 Vercel
- [ ] 环境变量正确配置
- [ ] API 密钥有效且有配额
- [ ] 应用可以正常访问
- [ ] 登录功能正常
- [ ] AI 功能正常工作
- [ ] 图片上传功能正常（如果启用）
- [ ] 修改了默认管理员密码
- [ ] 配置了自定义域名（可选）

## 🔗 有用链接

- **Vercel 文档**: https://vercel.com/docs
- **Next.js 部署**: https://nextjs.org/docs/deployment
- **项目仓库**: https://github.com/duxs-code/xinsd-diner
- **千问 AI**: https://dashscope.aliyun.com/
- **Google Gemini**: https://aistudio.google.com/

---

**部署指南版本**: v1.0  
**适用项目版本**: v2.1.0+  
**最后更新**: 2025-10-23