#!/usr/bin/env node

/**
 * 数据库连接和性能测试脚本
 */

const mysql = require('mysql2/promise')
const fs = require('fs').promises

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'fresh_market',
  charset: 'utf8mb4',
  timezone: '+08:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 10,
  queueLimit: 0,
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

// 测试数据库连接
async function testConnection() {
  log('🔌 测试数据库连接...', 'blue')
  
  let pool
  try {
    pool = mysql.createPool(dbConfig)
    const connection = await pool.getConnection()
    
    log('✅ 数据库连接成功', 'green')
    
    // 测试基本查询
    const [rows] = await connection.execute('SELECT 1 as test')
    if (rows[0].test === 1) {
      log('✅ 基本查询测试通过', 'green')
    }
    
    connection.release()
    return pool
  } catch (error) {
    log(`❌ 数据库连接失败: ${error.message}`, 'red')
    throw error
  }
}

// 测试数据库结构
async function testDatabaseStructure(pool) {
  log('\n📋 检查数据库结构...', 'blue')
  
  const requiredTables = ['categories', 'menu_items', 'recipes']
  
  for (const table of requiredTables) {
    try {
      const [rows] = await pool.execute(`SHOW TABLES LIKE '${table}'`)
      if (rows.length > 0) {
        log(`✅ 表 ${table} 存在`, 'green')
        
        // 检查表结构
        const [columns] = await pool.execute(`DESCRIBE ${table}`)
        log(`   - 字段数量: ${columns.length}`)
        
        // 检查数据量
        const [count] = await pool.execute(`SELECT COUNT(*) as count FROM ${table}`)
        log(`   - 数据量: ${count[0].count} 条`)
      } else {
        log(`❌ 表 ${table} 不存在`, 'red')
      }
    } catch (error) {
      log(`❌ 检查表 ${table} 失败: ${error.message}`, 'red')
    }
  }
}

// 测试查询性能
async function testQueryPerformance(pool) {
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
              WHERE mi.status = 1 AND c.code = 'vegetables'
              ORDER BY mi.sort_order ASC`
    },
    {
      name: '搜索商品',
      query: `SELECT mi.id, mi.name, mi.description, c.code as category, mi.image
              FROM menu_items mi 
              LEFT JOIN categories c ON mi.category_id = c.id
              WHERE mi.status = 1 AND (mi.name LIKE '%生菜%' OR mi.description LIKE '%生菜%')
              ORDER BY mi.sort_order ASC`
    }
  ]
  
  for (const test of tests) {
    try {
      const startTime = Date.now()
      const [rows] = await pool.execute(test.query)
      const endTime = Date.now()
      const duration = endTime - startTime
      
      log(`✅ ${test.name}: ${duration}ms (${rows.length} 条记录)`, 'green')
      
      if (duration > 1000) {
        log(`   ⚠️  查询时间较长，建议优化`, 'yellow')
      }
    } catch (error) {
      log(`❌ ${test.name} 失败: ${error.message}`, 'red')
    }
  }
}

// 测试事务处理
async function testTransactions(pool) {
  log('\n🔄 测试事务处理...', 'blue')
  
  const connection = await pool.getConnection()
  
  try {
    await connection.beginTransaction()
    
    // 插入测试分类
    const [categoryResult] = await connection.execute(
      'INSERT INTO categories (code, name, image) VALUES (?, ?, ?)',
      ['test-transaction', '事务测试分类', '/test.jpg']
    )
    
    const categoryId = categoryResult.insertId
    
    // 插入测试商品
    await connection.execute(
      'INSERT INTO menu_items (name, description, category_id, image) VALUES (?, ?, ?, ?)',
      ['事务测试商品', '测试事务回滚', categoryId, '/test.jpg']
    )
    
    // 回滚事务
    await connection.rollback()
    
    // 检查数据是否已回滚
    const [rows] = await connection.execute(
      'SELECT COUNT(*) as count FROM categories WHERE code = ?',
      ['test-transaction']
    )
    
    if (rows[0].count === 0) {
      log('✅ 事务回滚测试通过', 'green')
    } else {
      log('❌ 事务回滚失败', 'red')
    }
    
  } catch (error) {
    await connection.rollback()
    log(`❌ 事务测试失败: ${error.message}`, 'red')
  } finally {
    connection.release()
  }
}

// 测试连接池
async function testConnectionPool(pool) {
  log('\n🏊 测试连接池...', 'blue')
  
  const promises = []
  const startTime = Date.now()
  
  // 创建多个并发查询
  for (let i = 0; i < 20; i++) {
    promises.push(
      pool.execute('SELECT SLEEP(0.1), ? as query_id', [i])
    )
  }
  
  try {
    await Promise.all(promises)
    const endTime = Date.now()
    const duration = endTime - startTime
    
    log(`✅ 连接池测试通过: ${duration}ms (20个并发查询)`, 'green')
    
    if (duration > 5000) {
      log(`   ⚠️  并发查询时间较长，可能需要调整连接池配置`, 'yellow')
    }
  } catch (error) {
    log(`❌ 连接池测试失败: ${error.message}`, 'red')
  }
}

// 初始化数据库（如果需要）
async function initializeDatabase(pool) {
  log('\n🔧 检查是否需要初始化数据库...', 'blue')
  
  try {
    // 检查是否有数据
    const [categoryRows] = await pool.execute('SELECT COUNT(*) as count FROM categories')
    const [itemRows] = await pool.execute('SELECT COUNT(*) as count FROM menu_items WHERE status = 1')
    
    if (categoryRows[0].count === 0 || itemRows[0].count === 0) {
      log('⚠️  数据库数据不足，建议运行初始化脚本', 'yellow')
      log('   请执行: mysql -u root -p fresh_market < database/init.sql', 'yellow')
      return false
    } else {
      log(`✅ 数据库数据完整 (${categoryRows[0].count} 个分类, ${itemRows[0].count} 个商品)`, 'green')
      return true
    }
  } catch (error) {
    log(`❌ 检查数据库数据失败: ${error.message}`, 'red')
    return false
  }
}

// 主测试函数
async function runDatabaseTests() {
  log('🗄️  开始数据库连接和性能测试\n', 'blue')
  
  let pool
  try {
    // 测试连接
    pool = await testConnection()
    
    // 测试数据库结构
    await testDatabaseStructure(pool)
    
    // 检查数据库初始化
    const isInitialized = await initializeDatabase(pool)
    
    if (isInitialized) {
      // 测试查询性能
      await testQueryPerformance(pool)
      
      // 测试事务处理
      await testTransactions(pool)
      
      // 测试连接池
      await testConnectionPool(pool)
    }
    
    log('\n🎉 数据库测试完成', 'green')
    
  } catch (error) {
    log(`\n💥 数据库测试失败: ${error.message}`, 'red')
    process.exit(1)
  } finally {
    if (pool) {
      await pool.end()
    }
  }
}

// 运行测试
runDatabaseTests().catch(error => {
  log(`\n💥 测试运行出错: ${error.message}`, 'red')
  process.exit(1)
})