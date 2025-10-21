# 贡献指南

感谢您对 Xinsd 苍蝇饭馆项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- ✨ 添加新功能

## 🚀 快速开始

### 1. Fork 项目

点击项目页面右上角的 "Fork" 按钮，将项目 fork 到您的 GitHub 账户。

### 2. 克隆项目

```bash
git clone https://github.com/YOUR_USERNAME/xinsd-diner.git
cd xinsd-diner
```

### 3. 设置开发环境

```bash
# 安装依赖
pnpm install

# 初始化数据库
npm run init:db

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件，填入必要的 API 密钥

# 启动开发服务器
npm run dev
```

### 4. 创建功能分支

```bash
git checkout -b feature/your-feature-name
# 或者
git checkout -b fix/your-bug-fix
```

## 📋 贡献类型

### 🐛 Bug 报告

在提交 Bug 报告前，请：

1. 检查是否已有相关 Issue
2. 确保使用最新版本
3. 提供详细的复现步骤

**Bug 报告应包含：**
- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 环境信息（操作系统、Node.js 版本等）
- 相关截图或错误日志

### 💡 功能建议

提交功能建议时，请：

1. 详细描述功能需求
2. 说明使用场景
3. 考虑实现的可行性
4. 提供设计思路（如有）

### 🔧 代码贡献

#### 开发规范

**代码风格：**
- 使用 TypeScript 进行开发
- 遵循 ESLint 配置的代码规范
- 使用 Prettier 进行代码格式化
- 变量和函数使用驼峰命名法
- 组件使用 PascalCase 命名

**提交规范：**
- 使用语义化提交信息
- 提交信息使用中文
- 格式：`类型: 简短描述`

**提交类型：**
- `✨ feat`: 新功能
- `🐛 fix`: Bug 修复
- `📝 docs`: 文档更新
- `🎨 style`: 代码格式调整
- `♻️ refactor`: 代码重构
- `⚡ perf`: 性能优化
- `✅ test`: 测试相关
- `🔧 chore`: 构建工具或辅助工具的变动

**示例：**
```bash
git commit -m "✨ feat: 添加菜谱收藏功能"
git commit -m "🐛 fix: 修复图片上传失败的问题"
git commit -m "📝 docs: 更新API文档"
```

#### 代码质量

**测试要求：**
- 新功能必须包含相应测试
- 确保所有测试通过
- 测试覆盖率不低于现有水平

**代码审查：**
- 所有 PR 需要通过代码审查
- 确保代码符合项目规范
- 功能完整且无明显 Bug

#### 开发流程

1. **创建 Issue**（可选但推荐）
   - 描述要解决的问题或添加的功能
   - 等待维护者确认

2. **开发代码**
   - 在功能分支上进行开发
   - 遵循代码规范
   - 编写必要的测试

3. **测试验证**
   ```bash
   # 运行所有测试
   npm run test:all
   
   # 检查代码规范
   npm run lint
   
   # 验证构建
   npm run build
   ```

4. **提交代码**
   ```bash
   git add .
   git commit -m "✨ feat: 您的功能描述"
   git push origin feature/your-feature-name
   ```

5. **创建 Pull Request**
   - 提供清晰的 PR 描述
   - 关联相关 Issue
   - 等待代码审查

## 🔍 开发指南

### 项目结构

```
xinsd-diner/
├── app/                    # Next.js App Router
│   ├── api/v1/            # API 路由
│   ├── checkout/          # 页面组件
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   └── *.tsx             # 业务组件
├── contexts/             # React Context
├── lib/                  # 工具库
│   ├── database-sqlite.ts # 数据库操作
│   ├── api-utils-sqlite.ts # API 工具
│   └── types.ts          # 类型定义
├── scripts/              # 脚本文件
└── public/               # 静态资源
```

### 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **样式**: Tailwind CSS, shadcn/ui
- **数据库**: SQLite + better-sqlite3
- **AI 服务**: Google Gemini, 阿里云千问 AI
- **开发工具**: ESLint, Prettier, TypeScript

### 常用命令

```bash
# 开发
npm run dev                    # 启动开发服务器
npm run build                  # 构建项目
npm run start                  # 启动生产服务器

# 数据库
npm run init:db                # 初始化数据库
npm run test:db                # 测试数据库连接

# 测试
npm run test:api               # 测试 API
npm run test:gemini            # 测试 Gemini API
npm run test:qwen              # 测试千问 AI API
npm run test:all               # 运行所有测试

# 代码质量
npm run lint                   # 代码检查
npm run lint:fix               # 自动修复代码问题

# 维护
npm run cleanup:images         # 清理无用图片
npm run validate:config        # 验证配置
```

### API 开发

**新增 API 端点：**

1. 在 `app/api/v1/` 下创建对应目录
2. 创建 `route.ts` 文件
3. 实现 HTTP 方法处理函数
4. 使用统一的响应格式
5. 添加错误处理
6. 编写 API 测试

**示例：**
```typescript
// app/api/v1/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/database-sqlite';

export async function GET(request: NextRequest) {
  try {
    const data = await queries.example.getAll();
    return NextResponse.json({
      success: true,
      data,
      message: '获取成功'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 });
  }
}
```

### 组件开发

**组件规范：**

1. 使用 TypeScript 定义 Props 接口
2. 使用 forwardRef（如需要）
3. 添加 JSDoc 注释
4. 遵循 shadcn/ui 组件模式

**示例：**
```typescript
interface ExampleComponentProps {
  title: string;
  onAction?: () => void;
  className?: string;
}

/**
 * 示例组件
 * @param title 标题
 * @param onAction 操作回调
 * @param className 自定义样式类
 */
export function ExampleComponent({ 
  title, 
  onAction, 
  className 
}: ExampleComponentProps) {
  return (
    <div className={cn("example-component", className)}>
      <h2>{title}</h2>
      {onAction && (
        <button onClick={onAction}>
          操作
        </button>
      )}
    </div>
  );
}
```

## 📞 获取帮助

如果您在贡献过程中遇到问题，可以通过以下方式获取帮助：

- 📖 查看项目文档和 README
- 🐛 在 GitHub Issues 中搜索相关问题
- 💬 创建新的 Issue 询问问题
- 📧 联系项目维护者

## 🎉 感谢

感谢所有为项目做出贡献的开发者！您的每一个贡献都让这个项目变得更好。

### 贡献者

- [duxs-code](https://github.com/duxs-code) - 项目创建者和主要维护者

---

**再次感谢您的贡献！让我们一起打造更好的智能菜谱生成应用！** 🚀