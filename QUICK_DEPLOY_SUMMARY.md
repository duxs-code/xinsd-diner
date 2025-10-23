# 🚀 Vercel 快速部署总结

## ✅ 项目状态
**项目完全准备就绪，可以部署到 Vercel！**

## 🔥 快速部署步骤

### 1. 访问 Vercel
👉 **打开**: https://vercel.com/
👉 **登录**: 使用 GitHub 账号登录

### 2. 导入项目
1. 点击 **"New Project"**
2. 找到 `xinsd-diner` 项目
3. 点击 **"Import"**

### 3. 配置环境变量
在部署设置中添加以下环境变量：

```env
QWEN_API_KEY=sk-your-qwen-api-key-here
GOOGLE_GEMINI_API_KEY=AIzaSy-your-gemini-api-key-here
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### 4. 点击部署
点击 **"Deploy"** 按钮，等待 2-5 分钟完成部署。

## 🔑 API 密钥获取

### 千问 AI API
1. 访问: https://dashscope.aliyun.com/
2. 注册/登录阿里云账号
3. 创建 API Key
4. 复制密钥 (格式: `sk-xxx...`)

### Google Gemini API
1. 访问: https://aistudio.google.com/app/apikey
2. 登录 Google 账号
3. 创建 API Key
4. 复制密钥 (格式: `AIzaSy...`)

## 🎯 部署后操作

### 1. 首次登录
- **URL**: https://your-app-name.vercel.app
- **用户名**: `admin`
- **密码**: `admin`

### 2. 立即修改密码
⚠️ **重要**: 首次登录后立即修改默认密码！

### 3. 测试功能
- ✅ 用户登录/登出
- ✅ 食材浏览和添加
- ✅ 菜谱生成 (需要 AI API 密钥)
- ✅ 图片上传和显示

## 📊 部署配置详情

### 项目设置
- **框架**: Next.js 15
- **构建命令**: `npm run build`
- **输出目录**: `.next`
- **Node.js 版本**: 18.x

### 已配置功能
- ✅ 自动 HTTPS
- ✅ 边缘函数优化
- ✅ 图片优化
- ✅ 安全头配置
- ✅ CORS 配置

## ⚠️ 重要注意事项

### 数据库限制
- SQLite 在 Vercel 上每次部署都会重置
- 适合演示和测试使用
- 生产环境建议使用 Vercel Postgres

### API 配额
- 确保 AI API 密钥有足够配额
- 监控 API 调用频率
- 设置合理的使用限制

### 性能监控
- 使用 Vercel Analytics 监控性能
- 查看 Core Web Vitals 指标
- 监控 API 响应时间

## 🔧 故障排除

### 构建失败
```bash
# 本地测试构建
npm run build
```

### API 错误
- 检查环境变量是否正确设置
- 验证 API 密钥是否有效
- 查看 Vercel 函数日志

### 图片问题
- Vercel 文件系统是只读的
- 图片上传会存储在临时目录
- 考虑使用 Vercel Blob 存储

## 📈 优化建议

### 性能优化
1. 启用 Vercel Analytics
2. 配置适当的缓存策略
3. 使用 Edge Functions
4. 优化图片加载

### 安全优化
1. 定期更新依赖
2. 监控安全漏洞
3. 设置访问限制
4. 备份重要数据

## 🔗 有用链接

- **Vercel 文档**: https://vercel.com/docs
- **项目仓库**: https://github.com/duxs-code/xinsd-diner
- **详细部署指南**: VERCEL_DEPLOYMENT_GUIDE.md
- **千问 AI**: https://dashscope.aliyun.com/
- **Google Gemini**: https://aistudio.google.com/

## 🎉 部署成功！

部署完成后，你将拥有一个完全功能的在线智能菜谱生成应用！

---

**快速部署指南版本**: v1.0  
**项目版本**: v2.1.0  
**最后更新**: 2025-10-23