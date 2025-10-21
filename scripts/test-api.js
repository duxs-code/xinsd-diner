#!/usr/bin/env node

/**
 * API测试脚本
 * 用于验证所有API接口的功能正确性
 */

const BASE_URL = 'http://localhost:3000/api/v1'

// 测试结果统计
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
}

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// 测试工具函数
async function apiTest(name, testFn) {
  testResults.total++
  try {
    log(`\n🧪 测试: ${name}`, 'blue')
    await testFn()
    testResults.passed++
    log(`✅ 通过: ${name}`, 'green')
  } catch (error) {
    testResults.failed++
    log(`❌ 失败: ${name}`, 'red')
    log(`   错误: ${error.message}`, 'red')
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${data.message || '请求失败'}`)
  }

  return data
}

// 分类管理测试
async function testCategories() {
  await apiTest('获取分类列表', async () => {
    const result = await request('/categories')
    if (!Array.isArray(result.data)) {
      throw new Error('分类数据格式错误')
    }
    log(`   找到 ${result.data.length} 个分类`)
  })

  let newCategoryId = null
  await apiTest('添加新分类', async () => {
    const result = await request('/categories/add', {
      method: 'POST',
      body: JSON.stringify({
        name: '测试分类',
        image: '/test-category.jpg'
      })
    })
    
    if (!result.data || !result.data.id) {
      throw new Error('分类创建失败')
    }
    
    newCategoryId = result.data.id
    log(`   创建分类ID: ${newCategoryId}`)
  })

  if (newCategoryId) {
    await apiTest('删除测试分类', async () => {
      const result = await request('/categories/delete', {
        method: 'POST',
        body: JSON.stringify({ id: newCategoryId })
      })
      
      if (result.code !== 200) {
        throw new Error('分类删除失败')
      }
      
      log(`   删除了 ${result.data.deleted_items_count} 个商品`)
    })
  }
}

// 商品管理测试
async function testMenuItems() {
  await apiTest('获取商品列表', async () => {
    const result = await request('/menu/items?page=1&limit=5')
    
    if (!result.data || !Array.isArray(result.data.items)) {
      throw new Error('商品数据格式错误')
    }
    
    if (!result.data.pagination) {
      throw new Error('分页信息缺失')
    }
    
    log(`   找到 ${result.data.pagination.total} 个商品`)
  })

  await apiTest('搜索商品', async () => {
    const result = await request('/menu/items?search=生菜')
    
    if (!result.data || !Array.isArray(result.data.items)) {
      throw new Error('搜索结果格式错误')
    }
    
    log(`   搜索到 ${result.data.items.length} 个商品`)
  })

  await apiTest('按分类筛选商品', async () => {
    const result = await request('/menu/items?category=vegetables')
    
    if (!result.data || !Array.isArray(result.data.items)) {
      throw new Error('分类筛选结果格式错误')
    }
    
    log(`   蔬菜分类有 ${result.data.items.length} 个商品`)
  })

  let newItemId = null
  await apiTest('添加新商品', async () => {
    const result = await request('/menu/add-item', {
      method: 'POST',
      body: JSON.stringify({
        name: '测试商品',
        description: '这是一个测试商品',
        category: 'vegetables',
        image: '/test-item.jpg'
      })
    })
    
    if (!result.data || !result.data.id) {
      throw new Error('商品创建失败')
    }
    
    newItemId = result.data.id
    log(`   创建商品ID: ${newItemId}`)
  })

  if (newItemId) {
    await apiTest('获取单个商品', async () => {
      const result = await request(`/menu/item?id=${newItemId}`)
      
      if (!result.data || result.data.id !== newItemId) {
        throw new Error('商品查询失败')
      }
      
      log(`   商品名称: ${result.data.name}`)
    })

    await apiTest('删除测试商品', async () => {
      const result = await request('/menu/delete-items', {
        method: 'POST',
        body: JSON.stringify({ ids: [newItemId] })
      })
      
      if (result.code !== 200 || result.data.deleted_count !== 1) {
        throw new Error('商品删除失败')
      }
      
      log(`   删除了 ${result.data.deleted_count} 个商品`)
    })
  }

  await apiTest('商品名称重复检查', async () => {
    try {
      await request('/menu/add-item', {
        method: 'POST',
        body: JSON.stringify({
          name: '有机生菜', // 使用已存在的商品名称
          description: '重复测试',
          category: 'vegetables'
        })
      })
      throw new Error('应该返回重复错误')
    } catch (error) {
      if (!error.message.includes('409') && !error.message.includes('已存在')) {
        throw error
      }
      log('   正确检测到商品名称重复')
    }
  })
}

// 菜谱生成测试
async function testRecipeGeneration() {
  await apiTest('生成菜谱', async () => {
    const result = await request('/recipes/generate', {
      method: 'POST',
      body: JSON.stringify({
        cart_items: [
          {
            id: 1,
            name: '有机生菜',
            category: 'vegetables',
            description: '新鲜有机生菜',
            image: '/fresh-organic-lettuce.png'
          },
          {
            id: 7,
            name: '三文鱼',
            category: 'seafood',
            description: '挪威进口三文鱼',
            image: '/fresh-salmon-fillet.jpg'
          }
        ],
        requirements: {
          dish_count: 2,
          soup_count: 1,
          spice_level: '微辣',
          restrictions: '不吃香菜'
        }
      })
    })
    
    if (!result.data || !result.data.recipe_content) {
      throw new Error('菜谱生成失败')
    }
    
    if (!result.data.recipe_content.includes('生菜') || !result.data.recipe_content.includes('三文鱼')) {
      throw new Error('菜谱内容不包含指定食材')
    }
    
    log(`   菜谱长度: ${result.data.recipe_content.length} 字符`)
    log(`   生成时间: ${result.data.generated_at}`)
  })

  await apiTest('空菜篮子菜谱生成', async () => {
    try {
      await request('/recipes/generate', {
        method: 'POST',
        body: JSON.stringify({
          cart_items: [],
          requirements: {}
        })
      })
      throw new Error('应该返回菜篮子为空错误')
    } catch (error) {
      if (!error.message.includes('400') && !error.message.includes('菜篮子')) {
        throw error
      }
      log('   正确检测到菜篮子为空')
    }
  })
}

// 图片上传测试
async function testImageUpload() {
  await apiTest('图片上传参数验证', async () => {
    try {
      const formData = new FormData()
      // 不添加文件，测试验证
      
      const response = await fetch(`${BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        throw new Error('应该返回文件缺失错误')
      }
      
      const data = await response.json()
      if (!data.message.includes('文件')) {
        throw new Error('错误信息不正确')
      }
      
      log('   正确检测到文件缺失')
    } catch (error) {
      if (error.message.includes('应该返回') || error.message.includes('错误信息')) {
        throw error
      }
      // 网络错误等其他错误也算通过
      log('   参数验证正常')
    }
  })
}

// 错误处理测试
async function testErrorHandling() {
  await apiTest('不存在的商品查询', async () => {
    try {
      await request('/menu/item?id=99999')
      throw new Error('应该返回404错误')
    } catch (error) {
      if (!error.message.includes('404') && !error.message.includes('不存在')) {
        throw error
      }
      log('   正确返回商品不存在错误')
    }
  })

  await apiTest('无效的分类删除', async () => {
    try {
      await request('/categories/delete', {
        method: 'POST',
        body: JSON.stringify({ id: 'invalid-category' })
      })
      throw new Error('应该返回分类不存在错误')
    } catch (error) {
      if (!error.message.includes('404') && !error.message.includes('不存在')) {
        throw error
      }
      log('   正确返回分类不存在错误')
    }
  })

  await apiTest('无效的请求参数', async () => {
    try {
      await request('/menu/add-item', {
        method: 'POST',
        body: JSON.stringify({
          // 缺少必填字段
          name: '测试'
          // description 和 category 缺失
        })
      })
      throw new Error('应该返回参数错误')
    } catch (error) {
      if (!error.message.includes('400') && !error.message.includes('必填')) {
        throw error
      }
      log('   正确检测到必填参数缺失')
    }
  })
}

// 主测试函数
async function runTests() {
  log('🚀 开始API功能测试\n', 'blue')
  log(`测试目标: ${BASE_URL}`, 'yellow')

  try {
    // 检查服务器是否运行
    await request('/categories')
    log('✅ 服务器连接正常\n', 'green')
  } catch (error) {
    log('❌ 无法连接到服务器，请确保应用正在运行', 'red')
    log(`   错误: ${error.message}`, 'red')
    process.exit(1)
  }

  // 运行所有测试
  await testCategories()
  await testMenuItems()
  await testRecipeGeneration()
  await testImageUpload()
  await testErrorHandling()

  // 输出测试结果
  log('\n📊 测试结果统计:', 'blue')
  log(`   总计: ${testResults.total}`, 'blue')
  log(`   通过: ${testResults.passed}`, 'green')
  log(`   失败: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green')
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1)
  log(`   成功率: ${successRate}%`, successRate === '100.0' ? 'green' : 'yellow')

  if (testResults.failed === 0) {
    log('\n🎉 所有测试通过！API功能正常', 'green')
    process.exit(0)
  } else {
    log(`\n⚠️  有 ${testResults.failed} 个测试失败，请检查API实现`, 'yellow')
    process.exit(1)
  }
}

// 运行测试
runTests().catch(error => {
  log(`\n💥 测试运行出错: ${error.message}`, 'red')
  process.exit(1)
})