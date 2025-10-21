#!/usr/bin/env node

/**
 * 端到端集成测试脚本
 * 测试完整的用户操作流程
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
async function integrationTest(name, testFn) {
  testResults.total++
  try {
    log(`\n🔄 集成测试: ${name}`, 'blue')
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

// 延迟函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 测试完整的商品管理流程
async function testCompleteItemManagement() {
  await integrationTest('完整商品管理流程', async () => {
    // 1. 获取初始商品列表
    const initialItems = await request('/menu/items')
    const initialCount = initialItems.data.pagination.total
    log(`   初始商品数量: ${initialCount}`)

    // 2. 添加新商品
    const newItem = await request('/menu/add-item', {
      method: 'POST',
      body: JSON.stringify({
        name: `集成测试商品-${Date.now()}`,
        description: '这是集成测试创建的商品',
        category: 'vegetables',
        image: '/test-integration.jpg'
      })
    })
    
    const newItemId = newItem.data.id
    log(`   创建商品ID: ${newItemId}`)

    // 3. 验证商品已添加到列表
    await delay(100) // 等待数据同步
    const updatedItems = await request('/menu/items')
    const newCount = updatedItems.data.pagination.total
    
    if (newCount !== initialCount + 1) {
      throw new Error(`商品数量不正确，期望 ${initialCount + 1}，实际 ${newCount}`)
    }
    log(`   商品列表已更新: ${newCount} 个商品`)

    // 4. 搜索新添加的商品
    const searchResult = await request(`/menu/items?search=集成测试商品`)
    const foundItems = searchResult.data.items.filter(item => item.id === newItemId)
    
    if (foundItems.length === 0) {
      throw new Error('搜索功能无法找到新添加的商品')
    }
    log(`   搜索功能正常: 找到 ${foundItems.length} 个匹配商品`)

    // 5. 获取单个商品详情
    const itemDetail = await request(`/menu/item?id=${newItemId}`)
    if (itemDetail.data.name !== newItem.data.name) {
      throw new Error('商品详情不匹配')
    }
    log(`   商品详情查询正常`)

    // 6. 删除商品
    const deleteResult = await request('/menu/delete-items', {
      method: 'POST',
      body: JSON.stringify({ ids: [newItemId] })
    })
    
    if (deleteResult.data.deleted_count !== 1) {
      throw new Error('商品删除失败')
    }
    log(`   商品删除成功`)

    // 7. 验证商品已从列表中移除
    await delay(100) // 等待数据同步
    const finalItems = await request('/menu/items')
    const finalCount = finalItems.data.pagination.total
    
    if (finalCount !== initialCount) {
      throw new Error(`最终商品数量不正确，期望 ${initialCount}，实际 ${finalCount}`)
    }
    log(`   商品列表已恢复: ${finalCount} 个商品`)
  })
}

// 测试完整的分类管理流程
async function testCompleteCategoryManagement() {
  await integrationTest('完整分类管理流程', async () => {
    // 1. 获取初始分类列表
    const initialCategories = await request('/categories')
    const initialCount = initialCategories.data.length
    log(`   初始分类数量: ${initialCount}`)

    // 2. 添加新分类
    const newCategory = await request('/categories/add', {
      method: 'POST',
      body: JSON.stringify({
        name: `集成测试分类-${Date.now()}`,
        image: '/test-category.jpg'
      })
    })
    
    const newCategoryId = newCategory.data.id
    log(`   创建分类ID: ${newCategoryId}`)

    // 3. 验证分类已添加到列表
    await delay(100) // 等待数据同步
    const updatedCategories = await request('/categories')
    const newCount = updatedCategories.data.length
    
    if (newCount !== initialCount + 1) {
      throw new Error(`分类数量不正确，期望 ${initialCount + 1}，实际 ${newCount}`)
    }
    log(`   分类列表已更新: ${newCount} 个分类`)

    // 4. 在新分类下添加商品
    const testItem = await request('/menu/add-item', {
      method: 'POST',
      body: JSON.stringify({
        name: `分类测试商品-${Date.now()}`,
        description: '测试分类关联的商品',
        category: newCategoryId,
        image: '/test-item.jpg'
      })
    })
    log(`   在新分类下创建商品: ${testItem.data.id}`)

    // 5. 验证按分类筛选功能
    const categoryItems = await request(`/menu/items?category=${newCategoryId}`)
    const foundItems = categoryItems.data.items.filter(item => item.id === testItem.data.id)
    
    if (foundItems.length === 0) {
      throw new Error('分类筛选功能无法找到商品')
    }
    log(`   分类筛选功能正常: 找到 ${foundItems.length} 个商品`)

    // 6. 删除分类（级联删除商品）
    const deleteResult = await request('/categories/delete', {
      method: 'POST',
      body: JSON.stringify({ id: newCategoryId })
    })
    
    if (deleteResult.data.deleted_items_count !== 1) {
      throw new Error('分类删除时商品级联删除失败')
    }
    log(`   分类删除成功，级联删除了 ${deleteResult.data.deleted_items_count} 个商品`)

    // 7. 验证分类已从列表中移除
    await delay(100) // 等待数据同步
    const finalCategories = await request('/categories')
    const finalCount = finalCategories.data.length
    
    if (finalCount !== initialCount) {
      throw new Error(`最终分类数量不正确，期望 ${initialCount}，实际 ${finalCount}`)
    }
    log(`   分类列表已恢复: ${finalCount} 个分类`)

    // 8. 验证商品也被删除
    try {
      await request(`/menu/item?id=${testItem.data.id}`)
      throw new Error('商品应该已被级联删除')
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('不存在')) {
        log(`   商品级联删除验证通过`)
      } else {
        throw error
      }
    }
  })
}

// 测试完整的菜谱生成流程
async function testCompleteRecipeGeneration() {
  await integrationTest('完整菜谱生成流程', async () => {
    // 1. 获取一些商品作为菜篮子
    const itemsResult = await request('/menu/items?limit=3')
    const cartItems = itemsResult.data.items
    
    if (cartItems.length === 0) {
      throw new Error('没有可用的商品进行菜谱生成测试')
    }
    log(`   准备菜篮子商品: ${cartItems.length} 个`)

    // 2. 生成基础菜谱
    const basicRecipe = await request('/recipes/generate', {
      method: 'POST',
      body: JSON.stringify({
        cart_items: cartItems,
        requirements: {}
      })
    })
    
    if (!basicRecipe.data.recipe_content) {
      throw new Error('基础菜谱生成失败')
    }
    log(`   基础菜谱生成成功: ${basicRecipe.data.recipe_content.length} 字符`)

    // 3. 生成带要求的菜谱
    const advancedRecipe = await request('/recipes/generate', {
      method: 'POST',
      body: JSON.stringify({
        cart_items: cartItems,
        requirements: {
          dish_count: 2,
          soup_count: 1,
          spice_level: '微辣',
          restrictions: '不吃香菜',
          other_requirements: '少油少盐，适合老人'
        }
      })
    })
    
    if (!advancedRecipe.data.recipe_content) {
      throw new Error('高级菜谱生成失败')
    }
    
    // 验证菜谱内容包含要求
    const content = advancedRecipe.data.recipe_content
    if (!content.includes('微辣') || !content.includes('不吃香菜')) {
      throw new Error('菜谱内容未包含用户要求')
    }
    log(`   高级菜谱生成成功，包含用户要求`)

    // 4. 验证菜谱包含菜篮子商品
    const hasIngredients = cartItems.some(item => content.includes(item.name))
    if (!hasIngredients) {
      throw new Error('菜谱内容未包含菜篮子商品')
    }
    log(`   菜谱内容包含菜篮子商品`)

    // 5. 验证菜谱格式
    if (!content.includes('#') || !content.includes('**')) {
      throw new Error('菜谱格式不正确，缺少Markdown格式')
    }
    log(`   菜谱Markdown格式正确`)

    // 6. 验证生成时间戳
    if (!advancedRecipe.data.generated_at) {
      throw new Error('缺少菜谱生成时间戳')
    }
    
    const generatedTime = new Date(advancedRecipe.data.generated_at)
    const now = new Date()
    const timeDiff = Math.abs(now - generatedTime)
    
    if (timeDiff > 60000) { // 1分钟内
      throw new Error('菜谱生成时间戳不正确')
    }
    log(`   菜谱生成时间戳正确`)
  })
}

// 测试并发操作
async function testConcurrentOperations() {
  await integrationTest('并发操作测试', async () => {
    // 1. 并发获取商品列表
    const promises = []
    for (let i = 0; i < 10; i++) {
      promises.push(request('/menu/items?page=1&limit=5'))
    }
    
    const results = await Promise.all(promises)
    
    // 验证所有请求都成功
    if (results.length !== 10) {
      throw new Error('并发请求数量不正确')
    }
    
    // 验证返回数据一致性
    const firstResult = results[0]
    for (let i = 1; i < results.length; i++) {
      if (results[i].data.pagination.total !== firstResult.data.pagination.total) {
        throw new Error('并发请求返回数据不一致')
      }
    }
    log(`   并发获取商品列表测试通过: ${results.length} 个请求`)

    // 2. 并发生成菜谱
    const itemsResult = await request('/menu/items?limit=2')
    const cartItems = itemsResult.data.items
    
    const recipePromises = []
    for (let i = 0; i < 5; i++) {
      recipePromises.push(
        request('/recipes/generate', {
          method: 'POST',
          body: JSON.stringify({
            cart_items: cartItems,
            requirements: { dish_count: i + 1 }
          })
        })
      )
    }
    
    const recipeResults = await Promise.all(recipePromises)
    
    // 验证所有菜谱生成成功
    for (const result of recipeResults) {
      if (!result.data.recipe_content) {
        throw new Error('并发菜谱生成失败')
      }
    }
    log(`   并发菜谱生成测试通过: ${recipeResults.length} 个菜谱`)
  })
}

// 测试数据一致性
async function testDataConsistency() {
  await integrationTest('数据一致性测试', async () => {
    // 1. 创建测试数据
    const testCategory = await request('/categories/add', {
      method: 'POST',
      body: JSON.stringify({
        name: `一致性测试分类-${Date.now()}`,
        image: '/test.jpg'
      })
    })
    
    const testItem = await request('/menu/add-item', {
      method: 'POST',
      body: JSON.stringify({
        name: `一致性测试商品-${Date.now()}`,
        description: '测试数据一致性',
        category: testCategory.data.id,
        image: '/test.jpg'
      })
    })
    
    log(`   创建测试数据: 分类 ${testCategory.data.id}, 商品 ${testItem.data.id}`)

    // 2. 验证数据在不同接口中的一致性
    const allItems = await request('/menu/items')
    const categoryItems = await request(`/menu/items?category=${testCategory.data.id}`)
    const singleItem = await request(`/menu/item?id=${testItem.data.id}`)
    
    // 在所有商品列表中找到测试商品
    const itemInAll = allItems.data.items.find(item => item.id === testItem.data.id)
    if (!itemInAll) {
      throw new Error('商品在全部列表中不存在')
    }
    
    // 在分类筛选中找到测试商品
    const itemInCategory = categoryItems.data.items.find(item => item.id === testItem.data.id)
    if (!itemInCategory) {
      throw new Error('商品在分类筛选中不存在')
    }
    
    // 验证商品信息一致性
    if (itemInAll.name !== testItem.data.name || 
        itemInCategory.name !== testItem.data.name || 
        singleItem.data.name !== testItem.data.name) {
      throw new Error('商品信息在不同接口中不一致')
    }
    
    log(`   数据一致性验证通过`)

    // 3. 清理测试数据
    await request('/categories/delete', {
      method: 'POST',
      body: JSON.stringify({ id: testCategory.data.id })
    })
    
    log(`   测试数据清理完成`)
  })
}

// 主测试函数
async function runIntegrationTests() {
  log('🔗 开始端到端集成测试\n', 'blue')
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

  // 运行所有集成测试
  await testCompleteItemManagement()
  await testCompleteCategoryManagement()
  await testCompleteRecipeGeneration()
  await testConcurrentOperations()
  await testDataConsistency()

  // 输出测试结果
  log('\n📊 集成测试结果统计:', 'blue')
  log(`   总计: ${testResults.total}`, 'blue')
  log(`   通过: ${testResults.passed}`, 'green')
  log(`   失败: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green')
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1)
  log(`   成功率: ${successRate}%`, successRate === '100.0' ? 'green' : 'yellow')

  if (testResults.failed === 0) {
    log('\n🎉 所有集成测试通过！系统功能正常', 'green')
    process.exit(0)
  } else {
    log(`\n⚠️  有 ${testResults.failed} 个集成测试失败，请检查系统实现`, 'yellow')
    process.exit(1)
  }
}

// 运行测试
runIntegrationTests().catch(error => {
  log(`\n💥 集成测试运行出错: ${error.message}`, 'red')
  process.exit(1)
})