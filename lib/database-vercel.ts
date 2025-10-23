/**
 * Vercel 环境数据库适配器
 * 处理 Vercel 无服务器环境下的数据库连接
 */

import Database from 'better-sqlite3'
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'

// Vercel 环境检测
const isVercel = process.env.VERCEL === '1'
const isProduction = process.env.NODE_ENV === 'production'

// 数据库路径配置
const DB_DIR = isVercel ? '/tmp' : join(process.cwd(), 'data')
const DB_PATH = join(DB_DIR, 'fresh_market.db')

let db: Database.Database | null = null

/**
 * 获取数据库连接
 */
export function getDatabase(): Database.Database {
  if (db) {
    return db
  }

  try {
    // 确保数据库目录存在
    if (!existsSync(DB_DIR)) {
      mkdirSync(DB_DIR, { recursive: true })
    }

    // 在 Vercel 环境下，如果数据库不存在，创建并初始化
    if (isVercel && !existsSync(DB_PATH)) {
      console.log('🔧 Vercel环境：初始化数据库...')
      initializeVercelDatabase()
    }

    // 创建数据库连接
    db = new Database(DB_PATH)
    db.pragma('foreign_keys = ON')
    db.pragma('journal_mode = WAL')

    console.log(`✅ 数据库连接成功: ${DB_PATH}`)
    return db

  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    throw new Error(`数据库连接失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 初始化 Vercel 环境数据库
 */
function initializeVercelDatabase() {
  try {
    // 创建临时数据库
    const tempDb = new Database(DB_PATH)
    tempDb.pragma('foreign_keys = ON')

    // 创建表结构
    createTables(tempDb)
    
    // 插入初始数据
    insertInitialData(tempDb)
    
    tempDb.close()
    console.log('✅ Vercel数据库初始化完成')

  } catch (error) {
    console.error('❌ Vercel数据库初始化失败:', error)
    throw error
  }
}

/**
 * 创建数据库表
 */
function createTables(database: Database.Database) {
  // 创建分类表
  database.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      image TEXT DEFAULT '/abstract-categories.png',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 创建商品表
  database.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category_id INTEGER NOT NULL,
      image TEXT DEFAULT '/placeholder.svg',
      status INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    )
  `)

  // 创建用户表
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login_at DATETIME
    )
  `)

  // 创建用户会话表
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `)

  // 创建菜谱表
  database.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      cart_items TEXT NOT NULL,
      requirements TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 创建图片表
  database.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      url TEXT NOT NULL,
      type TEXT DEFAULT 'temp',
      recipe_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE SET NULL
    )
  `)

  console.log('✅ 数据库表创建完成')
}

/**
 * 插入初始数据
 */
function insertInitialData(database: Database.Database) {
  // 插入默认分类
  const categories = [
    { code: 'vegetables', name: '蔬菜类', image: '/abstract-categories.png', sort_order: 1 },
    { code: 'meat', name: '肉类', image: '/abstract-categories.png', sort_order: 2 },
    { code: 'seafood', name: '海鲜类', image: '/abstract-categories.png', sort_order: 3 },
    { code: 'grains', name: '谷物类', image: '/abstract-categories.png', sort_order: 4 },
    { code: 'dairy', name: '乳制品', image: '/abstract-categories.png', sort_order: 5 },
    { code: 'seasonings', name: '调料类', image: '/abstract-categories.png', sort_order: 6 }
  ]

  const insertCategory = database.prepare(`
    INSERT OR IGNORE INTO categories (code, name, image, sort_order)
    VALUES (?, ?, ?, ?)
  `)

  categories.forEach(category => {
    insertCategory.run(category.code, category.name, category.image, category.sort_order)
  })

  // 插入默认管理员用户
  const bcrypt = require('bcryptjs')
  const adminPasswordHash = bcrypt.hashSync('admin', 12)

  const insertAdmin = database.prepare(`
    INSERT OR IGNORE INTO users (username, email, password_hash, name, role, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  insertAdmin.run('admin', 'admin@xinsd.com', adminPasswordHash, '系统管理员', 'admin', 1)

  // 插入示例商品
  const sampleItems = [
    { name: '西红柿', description: '新鲜的西红柿，富含维生素C', category_id: 1 },
    { name: '猪肉', description: '优质猪肉，适合炒菜', category_id: 2 },
    { name: '大米', description: '优质大米，口感香甜', category_id: 4 },
    { name: '鸡蛋', description: '新鲜鸡蛋，营养丰富', category_id: 5 },
    { name: '生抽', description: '优质生抽，调味必备', category_id: 6 },
    { name: '青菜', description: '新鲜青菜，绿色健康', category_id: 1 }
  ]

  const insertItem = database.prepare(`
    INSERT OR IGNORE INTO menu_items (name, description, category_id, image, status)
    VALUES (?, ?, ?, ?, ?)
  `)

  sampleItems.forEach(item => {
    insertItem.run(item.name, item.description, item.category_id, '/placeholder.svg', 1)
  })

  console.log('✅ 初始数据插入完成')
}

/**
 * 关闭数据库连接
 */
export function closeDatabase() {
  if (db) {
    try {
      db.close()
      db = null
      console.log('✅ 数据库连接已关闭')
    } catch (error) {
      console.error('❌ 关闭数据库连接失败:', error)
    }
  }
}

/**
 * 健康检查
 */
export function healthCheck(): boolean {
  try {
    const database = getDatabase()
    const result = database.prepare('SELECT 1 as test').get()
    return result?.test === 1
  } catch (error) {
    console.error('❌ 数据库健康检查失败:', error)
    return false
  }
}

// 导出默认数据库实例
export default getDatabase