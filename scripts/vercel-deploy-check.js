#!/usr/bin/env node

/**
 * Vercel 部署前检查脚本
 * 验证项目是否准备好部署到 Vercel
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Vercel 部署前检查...\n')

let hasErrors = false
let hasWarnings = false

// 检查必需文件
console.log('1️⃣ 检查必需文件:')

const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'vercel.json',
  '.env.example',
  'README.md'
]

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`)
  } else {
    console.log(`   ❌ ${file} - 缺失`)
    hasErrors = true
  }
})

// 检查 package.json 脚本
console.log('\n2️⃣ 检查 package.json 脚本:')

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  
  const requiredScripts = ['build', 'start', 'dev']
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`   ✅ ${script}: ${packageJson.scripts[script]}`)
    } else {
      console.log(`   ❌ ${script} - 缺失`)
      hasErrors = true
    }
  })

  // 检查关键依赖
  const requiredDeps = ['next', 'react', 'react-dom']
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`)
    } else {
      console.log(`   ❌ ${dep} - 缺失`)
      hasErrors = true
    }
  })

} catch (error) {
  console.log('   ❌ 无法读取 package.json')
  hasErrors = true
}

// 检查 Next.js 配置
console.log('\n3️⃣ 检查 Next.js 配置:')

try {
  const nextConfigContent = fs.readFileSync('next.config.mjs', 'utf8')
  
  if (nextConfigContent.includes('images: {')) {
    console.log('   ✅ 图片配置已设置')
  } else {
    console.log('   ⚠️ 建议配置图片优化设置')
    hasWarnings = true
  }

  if (nextConfigContent.includes('eslint: {')) {
    console.log('   ✅ ESLint 配置已设置')
  } else {
    console.log('   ⚠️ 建议配置 ESLint 设置')
    hasWarnings = true
  }

} catch (error) {
  console.log('   ❌ 无法读取 next.config.mjs')
  hasErrors = true
}

// 检查环境变量示例
console.log('\n4️⃣ 检查环境变量配置:')

try {
  const envExample = fs.readFileSync('.env.example', 'utf8')
  
  const requiredEnvVars = [
    'QWEN_API_KEY',
    'GOOGLE_GEMINI_API_KEY',
    'NODE_ENV'
  ]

  requiredEnvVars.forEach(envVar => {
    if (envExample.includes(envVar)) {
      console.log(`   ✅ ${envVar}`)
    } else {
      console.log(`   ❌ ${envVar} - 缺失`)
      hasErrors = true
    }
  })

} catch (error) {
  console.log('   ❌ 无法读取 .env.example')
  hasErrors = true
}

// 检查 API 路由
console.log('\n5️⃣ 检查 API 路由:')

const apiRoutes = [
  'app/api/v1/auth/login/route.ts',
  'app/api/v1/auth/me/route.ts',
  'app/api/v1/categories/route.ts',
  'app/api/v1/menu/items/route.ts',
  'app/api/v1/recipes/generate/route.ts'
]

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`   ✅ ${route}`)
  } else {
    console.log(`   ❌ ${route} - 缺失`)
    hasErrors = true
  }
})

// 检查关键组件
console.log('\n6️⃣ 检查关键组件:')

const keyComponents = [
  'app/page.tsx',
  'app/layout.tsx',
  'components/navigation.tsx',
  'components/optimized-image.tsx',
  'contexts/auth-context.tsx'
]

keyComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`   ✅ ${component}`)
  } else {
    console.log(`   ❌ ${component} - 缺失`)
    hasErrors = true
  }
})

// 检查构建
console.log('\n7️⃣ 检查构建配置:')

try {
  // 检查 TypeScript 配置
  if (fs.existsSync('tsconfig.json')) {
    console.log('   ✅ TypeScript 配置存在')
  } else {
    console.log('   ❌ tsconfig.json 缺失')
    hasErrors = true
  }

  // 检查 Tailwind 配置
  if (fs.existsSync('tailwind.config.ts') || fs.existsSync('tailwind.config.js')) {
    console.log('   ✅ Tailwind CSS 配置存在')
  } else {
    console.log('   ⚠️ Tailwind CSS 配置可能缺失')
    hasWarnings = true
  }

} catch (error) {
  console.log('   ❌ 构建配置检查失败')
  hasErrors = true
}

// 检查 Vercel 配置
console.log('\n8️⃣ 检查 Vercel 配置:')

try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'))
  
  if (vercelConfig.buildCommand) {
    console.log(`   ✅ 构建命令: ${vercelConfig.buildCommand}`)
  }
  
  if (vercelConfig.framework) {
    console.log(`   ✅ 框架: ${vercelConfig.framework}`)
  }
  
  if (vercelConfig.functions) {
    console.log('   ✅ 函数配置已设置')
  }

} catch (error) {
  console.log('   ⚠️ vercel.json 配置可能有问题')
  hasWarnings = true
}

// 生成部署建议
console.log('\n📋 部署建议:')

console.log('\n🔑 环境变量设置 (在 Vercel 项目设置中添加):')
console.log('   QWEN_API_KEY=your-qwen-api-key')
console.log('   GOOGLE_GEMINI_API_KEY=your-gemini-api-key')
console.log('   NODE_ENV=production')
console.log('   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app')

console.log('\n🚀 部署步骤:')
console.log('   1. 确保代码已推送到 GitHub')
console.log('   2. 在 Vercel 中导入项目')
console.log('   3. 配置环境变量')
console.log('   4. 点击部署')

console.log('\n⚠️ 注意事项:')
console.log('   • SQLite 在 Vercel 上每次部署都会重置')
console.log('   • 考虑使用 Vercel Postgres 作为生产数据库')
console.log('   • 确保 API 密钥有效且有足够配额')
console.log('   • 首次部署后修改默认管理员密码')

// 总结
console.log('\n🎉 检查完成!')

if (hasErrors) {
  console.log('❌ 发现错误，请修复后再部署')
  process.exit(1)
} else if (hasWarnings) {
  console.log('⚠️ 发现警告，建议修复后部署')
  console.log('✅ 项目基本准备就绪，可以部署到 Vercel')
} else {
  console.log('✅ 项目完全准备就绪，可以部署到 Vercel!')
}

console.log('\n📖 详细部署指南请查看: VERCEL_DEPLOYMENT_GUIDE.md')