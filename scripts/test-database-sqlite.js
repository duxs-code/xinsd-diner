#!/usr/bin/env node

/**
 * SQLite数据库连接和性能测试脚本
 */

const Database = require('better-sqlite3')
const { join } = require('path')
const { existsSync, mkdirSync } = require('fs')

// 数据库文件路径
const DB_DIR = join(process.cwd(), 'data')
const DB_PATH = join(DB_DIR, 'fresh_market.db')

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

// 测试数据库连接
function testConnection() {
  log('🔌 测试SQLite数据库连接...', 'blue')
  
  try {
    // 确保数据目录存在
    if (!existsSync(DB_DIR)) {
      mkdirSync(DB_DIR, { recursive: true })
    }

    const db = new Database(DB_PATH)
    db.pragma('foreign_keys = ON')
    
    log('✅ SQLite数据库连接成功', 'green')
    
    // 测试基本查询
    const result = db.prepare('SELECT 1 as test').get()
    if (result.test === 1) {
      log('✅ 基本查询测试通过', 'green')
    }
    
    return db
  } catch (error) {
    log(`❌ SQLite数据库连接失败: ${error.message}`, 'red')
    throw error
  }
}

// 测试数据库结构
function testDatabaseStructure(db) {
  log('\n📋 检查数据库结构...', 'blue')
  
  const requiredTables = ['categories', 'menu_items', 'recipes']
  
  for (const table of requiredTables) {
    try {
      const tableInfo = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(table)
      if (tableInfo) {
        log(`✅ 表 ${table} 存在`, 'green')
        
        // 检查表结构
        const columns = db.prepare(`PRAGMA table_info(${table})`).all()
        log(`   - 字段数量: ${columns.length}`)
        
        // 检查数据量
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get()
        log(`   - 数据量: ${count.count} 条`)
      } else {
        log(`❌ 表 ${table} 不存在`, 'red')
      }
    } catch (error) {
      log(`❌ 检查表 ${table} 失败: ${error.message}`, 'red')
    }
  }
}

// 测试查询性能
function testQueryPerformance(db) {
  log('\n⚡ 测试查询性能...', 'blue')
  
  const tests = [
    {
      name: '获取所有分类',
      query: 'SELECT id, code, name, image FROM categories ORDER BY sort_order ASC'
    },
    {
      name: '获取商品列表（前12个）',
      query: `SELECT mi.id, mi.name, mi.description, c.code as category, mi.image
              FROM menu_items mi 
              LEFT JOIN categories c ON mi.category_id = c.id
              WHERE mi.status = 1
              ORDER BY mi.sort_order ASC, mi.created_at DESC
              LIMIT 12`
    },
    {
      name: '按分类筛选商品',
      query: `SELECT mi.id, mi.name, mi.description, c.code as category, mi.image
              FROM menu_items mi 
              LEFT JOIN categories c ON mi.category_id = c.id
              WHERE mi.status = 1 AND c.code = ?`,
      params: ['vegetables']
    },
    {
      name: '搜索商品',
      query: `SELECT mi.id, mi.name, mi.description, c.code as category, mi.image
              FROM menu_items mi 
              LEFT JOIN categories c ON mi.category_id = c.id
              WHERE mi.status = 1 AND (mi.name LIKE ? OR mi.description LIKE ?)
              ORDER BY mi.sort_order ASC`,
      params: ['%生菜%', '%生菜%']
    }
  ]
  
  for (const test of tests) {
    try {
      const startTime = Date.now()
      const stmt = db.prepare(test.query)
      const rows = test.params ? stmt.all(...test.params) : stmt.all()
      const endTime = Date.now()
      const duration = endTime - startTime
      
      log(`✅ ${test.name}: ${duration}ms (${rows.length} 条记录)`, 'green')
      
      if (duration > 100) {
        log(`   ⚠️  查询时间较长，建议优化`, 'yellow')
      }
    } catch (error) {
      log(`❌ ${test.name} 失败: ${error.message}`, 'red')
    }
  }
}

// 测试事务处理
function testTransactions(db) {
  log('\n🔄 测试事务处理...', 'blue')
  
  try {
    const transaction = db.transaction(() => {
      // 插入测试分类
      const insertCategory = db.prepare('INSERT INTO categories (code, name, image) VALUES (?, ?, ?)')
      const categoryResult = insertCategory.run('test-transaction', '事务测试分类', '/test.jpg')
      
      const categoryId = categoryResult.lastInsertRowid
      
      // 插入测试商品
      const insertItem = db.prepare('INSERT INTO menu_items (name, description, category_id, image) VALUES (?, ?, ?, ?)')
      insertItem.run('事务测试商品', '测试事务回滚', categoryId, '/test.jpg')
      
      // 抛出错误来测试回滚
      throw new Error('测试回滚')
    })
    
    try {
      transaction()
    } catch (error) {
      // 预期的错误，用于测试回滚
    }
    
    // 检查数据是否已回滚
    const checkStmt = db.prepare('SELECT COUNT(*) as count FROM categories WHERE code = ?')
    const result = checkStmt.get('test-transaction')
    
    if (result.count === 0) {
      log('✅ 事务回滚测试通过', 'green')
    } else {
      log('❌ 事务回滚失败', 'red')
    }
    
  } catch (error) {
    log(`❌ 事务测试失败: ${error.message}`, 'red')
  }
}

// 测试并发查询
function testConcurrentQueries(db) {
  log('\n🏊 测试并发查询...', 'blue')
  
  const startTime = Date.now()
  
  try {
    // SQLite在同一个连接中是串行的，但我们可以测试多个查询的性能
    const queries = []
    for (let i = 0; i < 20; i++) {
      const stmt = db.prepare('SELECT ?, COUNT(*) as count FROM categories')
      queries.push(stmt.get(i))
    }
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    log(`✅ 并发查询测试通过: ${duration}ms (20个查询)`, 'green')
    
    if (duration > 1000) {
      log(`   ⚠️  查询时间较长`, 'yellow')
    }
  } catch (error) {
    log(`❌ 并发查询测试失败: ${error.message}`, 'red')
  }
}

// 检查数据库初始化
function checkDatabaseInitialization(db) {
  log('\n🔧 检查数据库初始化状态...', 'blue')
  
  try {
    // 检查是否有数据
    const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get()
    const itemCount = db.prepare('SELECT COUNT(*) as count FROM menu_items WHERE status = 1').get()
    
    if (categoryCount.count === 0 || itemCount.count === 0) {
      log('⚠️  数据库数据不足，将在应用启动时自动初始化', 'yellow')
      return false
    } else {
      log(`✅ 数据库数据完整 (${categoryCount.count} 个分类, ${itemCount.count} 个商品)`, 'green')
      return true
    }
  } catch (error) {
    log(`❌ 检查数据库数据失败: ${error.message}`, 'red')
    return false
  }
}

// 主测试函数
function runDatabaseTests() {
  log('🗄️  开始SQLite数据库连接和性能测试\n', 'blue')
  
  let db
  try {
    // 测试连接
    db = testConnection()
    
    // 测试数据库结构
    testDatabaseStructure(db)
    
    // 检查数据库初始化
    const isInitialized = checkDatabaseInitialization(db)
    
    if (isInitialized) {
      // 测试查询性能
      testQueryPerformance(db)
      
      // 测试事务处理
      testTransactions(db)
      
      // 测试并发查询
      testConcurrentQueries(db)
    }
    
    log('\n🎉 SQLite数据库测试完成', 'green')
    log('💡 SQLite数据库文件位置:', 'blue')
    log(`   ${DB_PATH}`, 'blue')
    
  } catch (error) {
    log(`\n💥 数据库测试失败: ${error.message}`, 'red')
    process.exit(1)
  } finally {
    if (db) {
      db.close()
    }
  }
}

// 运行测试
runDatabaseTests()