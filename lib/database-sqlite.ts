import Database from 'better-sqlite3'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

// 数据库文件路径
const DB_DIR = join(process.cwd(), 'data')
const DB_PATH = join(DB_DIR, 'fresh_market.db')

// 确保数据目录存在
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true })
}

// 创建数据库连接
const db = new Database(DB_PATH)

// 启用外键约束
db.pragma('foreign_keys = ON')

// 数据库连接测试
export async function testConnection(): Promise<boolean> {
  try {
    // 测试查询
    const result = db.prepare('SELECT 1 as test').get()
    if ((result as any)?.test === 1) {
      console.log('✅ SQLite数据库连接成功')
      
      // 检查表是否存在并显示统计信息
      try {
        const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as any
        const itemCount = db.prepare('SELECT COUNT(*) as count FROM menu_items').get() as any
        console.log(`📊 分类数量: ${categoryCount.count}`)
        console.log(`📦 商品数量: ${itemCount.count}`)
      } catch (error) {
        console.log('💡 数据库表尚未初始化')
      }
      
      return true
    }
    return false
  } catch (error) {
    console.error('❌ SQLite数据库连接失败:', (error as Error).message)
    return false
  }
}

// 初始化数据库表结构
export function initializeDatabase(): void {
  console.log('🔧 初始化SQLite数据库表结构...')
  
  // 创建分类表
  db.exec(`
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
  db.exec(`
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

  // 创建菜谱表
  db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      cart_items TEXT,
      requirements TEXT,
      dish_count INTEGER,
      soup_count INTEGER,
      spice_level TEXT,
      restrictions TEXT,
      other_requirements TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 创建图片管理表
  db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      url TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('recipe', 'temp', 'user')),
      recipe_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      used BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
    )
  `)

  // 创建索引
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
    CREATE INDEX IF NOT EXISTS idx_menu_items_status ON menu_items(status);
    CREATE INDEX IF NOT EXISTS idx_menu_items_name ON menu_items(name);
    CREATE INDEX IF NOT EXISTS idx_categories_code ON categories(code);
    CREATE INDEX IF NOT EXISTS idx_images_type ON images(type);
    CREATE INDEX IF NOT EXISTS idx_images_recipe_id ON images(recipe_id);
    CREATE INDEX IF NOT EXISTS idx_images_used ON images(used);
    CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at);
  `)

  console.log('✅ 数据库表结构初始化完成')
}

// 初始化默认数据
export function initializeDefaultData(): void {
  console.log('🌱 初始化默认数据...')
  
  // 检查是否已有数据
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as any
  if (categoryCount.count > 0) {
    console.log('💡 数据库已有数据，跳过初始化')
    return
  }

  // 插入默认分类
  const insertCategory = db.prepare(`
    INSERT INTO categories (code, name, image, sort_order) 
    VALUES (?, ?, ?, ?)
  `)

  const categories = [
    { code: 'vegetables', name: '蔬菜', image: '/vegetables.jpg', sort_order: 1 },
    { code: 'meat', name: '肉类', image: '/meat.jpg', sort_order: 2 },
    { code: 'seafood', name: '海鲜', image: '/seafood.jpg', sort_order: 3 },
    { code: 'fruits', name: '水果', image: '/fruits.jpg', sort_order: 4 },
    { code: 'dairy', name: '乳制品', image: '/dairy.jpg', sort_order: 5 },
    { code: 'grains', name: '谷物', image: '/grains.jpg', sort_order: 6 }
  ]

  const categoryTransaction = db.transaction((categories) => {
    for (const category of categories) {
      insertCategory.run(category.code, category.name, category.image, category.sort_order)
    }
  })

  categoryTransaction(categories)

  // 获取分类ID映射
  const categoryMap = new Map()
  const allCategories = db.prepare('SELECT id, code FROM categories').all() as any[]
  allCategories.forEach(cat => categoryMap.set(cat.code, cat.id))

  // 插入默认商品
  const insertItem = db.prepare(`
    INSERT INTO menu_items (name, description, category_id, image, sort_order) 
    VALUES (?, ?, ?, ?, ?)
  `)

  const items = [
    // 蔬菜
    { name: '生菜', description: '新鲜脆嫩的生菜', category: 'vegetables', image: '/vegetables/lettuce.jpg', sort_order: 1 },
    { name: '西红柿', description: '红润饱满的西红柿', category: 'vegetables', image: '/vegetables/tomato.jpg', sort_order: 2 },
    { name: '黄瓜', description: '清脆爽口的黄瓜', category: 'vegetables', image: '/vegetables/cucumber.jpg', sort_order: 3 },
    { name: '胡萝卜', description: '营养丰富的胡萝卜', category: 'vegetables', image: '/vegetables/carrot.jpg', sort_order: 4 },
    { name: '白菜', description: '鲜嫩的大白菜', category: 'vegetables', image: '/vegetables/cabbage.jpg', sort_order: 5 },
    { name: '菠菜', description: '绿叶营养的菠菜', category: 'vegetables', image: '/vegetables/spinach.jpg', sort_order: 6 },
    
    // 肉类
    { name: '猪肉', description: '新鲜的猪肉', category: 'meat', image: '/meat/pork.jpg', sort_order: 1 },
    { name: '牛肉', description: '优质的牛肉', category: 'meat', image: '/meat/beef.jpg', sort_order: 2 },
    { name: '鸡肉', description: '嫩滑的鸡肉', category: 'meat', image: '/meat/chicken.jpg', sort_order: 3 },
    { name: '羊肉', description: '鲜美的羊肉', category: 'meat', image: '/meat/lamb.jpg', sort_order: 4 },
    
    // 海鲜
    { name: '鲈鱼', description: '新鲜的鲈鱼', category: 'seafood', image: '/seafood/bass.jpg', sort_order: 1 },
    { name: '虾', description: '活蹦乱跳的虾', category: 'seafood', image: '/seafood/shrimp.jpg', sort_order: 2 },
    { name: '螃蟹', description: '肥美的螃蟹', category: 'seafood', image: '/seafood/crab.jpg', sort_order: 3 },
    { name: '带鱼', description: '新鲜的带鱼', category: 'seafood', image: '/seafood/hairtail.jpg', sort_order: 4 },
    
    // 水果
    { name: '苹果', description: '脆甜的苹果', category: 'fruits', image: '/fruits/apple.jpg', sort_order: 1 },
    { name: '香蕉', description: '香甜的香蕉', category: 'fruits', image: '/fruits/banana.jpg', sort_order: 2 },
    { name: '橙子', description: '酸甜的橙子', category: 'fruits', image: '/fruits/orange.jpg', sort_order: 3 },
    { name: '葡萄', description: '晶莹的葡萄', category: 'fruits', image: '/fruits/grape.jpg', sort_order: 4 }
  ]

  const itemTransaction = db.transaction((items) => {
    for (const item of items) {
      const categoryId = categoryMap.get(item.category)
      if (categoryId) {
        insertItem.run(item.name, item.description, categoryId, item.image, item.sort_order)
      }
    }
  })

  itemTransaction(items)

  console.log('✅ 默认数据初始化完成')
}

// 数据类型定义
export interface MenuItem {
  id: number
  name: string
  description: string
  category: string
  image: string
}

export interface Category {
  id: string
  name: string
  image: string
}

export interface MenuItemsResult {
  items: MenuItem[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export interface DeleteResult {
  deleted_count: number
  deleted_ids: number[]
}

// 查询参数接口
export interface GetMenuItemsParams {
  category?: string
  categoryId?: string
  search?: string
  page?: number
  limit?: number
}

export interface AddMenuItemData {
  name: string
  description: string
  category: string
  image?: string
}

export interface AddCategoryData {
  name: string
  image?: string
}

// 常用查询函数
export const queries = {
  // 获取所有分类
  getCategories(): Category[] {
    const stmt = db.prepare(`
      SELECT id, code, name, image 
      FROM categories 
      ORDER BY sort_order ASC, id ASC
    `)
    const rows = stmt.all() as any[]
    return rows.map(row => ({
      id: row.code,  // 前端使用code作为ID
      dbId: row.id,  // 数据库自增ID
      name: row.name,
      image: row.image
    }))
  },

  // 获取商品列表（支持分页和搜索）
  getMenuItems(params: GetMenuItemsParams): MenuItemsResult {
    const { category, categoryId, search, page = 1, limit = 20 } = params
    
    // 确保分页参数是数字
    const pageNum = parseInt(page.toString())
    const limitNum = parseInt(limit.toString())
    
    let sql = `
      SELECT mi.id, mi.name, mi.description, c.code as category, mi.image
      FROM menu_items mi 
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE mi.status = 1
    `
    const queryParams: any[] = []

    // 支持通过分类代码查询
    if (category) {
      sql += ' AND c.code = ?'
      queryParams.push(category)
    }

    // 支持通过分类ID查询
    if (categoryId) {
      sql += ' AND c.code = ?'
      queryParams.push(categoryId)
    }

    if (search) {
      sql += ' AND (mi.name LIKE ? OR mi.description LIKE ?)'
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    sql += ' ORDER BY mi.sort_order ASC, mi.created_at DESC'
    
    // 计算总数
    const countSql = sql.replace(
      'SELECT mi.id, mi.name, mi.description, c.code as category, mi.image',
      'SELECT COUNT(*) as total'
    ).replace(/ORDER BY.*$/, '')
    
    const countStmt = db.prepare(countSql)
    const countResult = countStmt.get(...queryParams) as any
    const total = countResult.total
    
    // 分页
    const offset = (pageNum - 1) * limitNum
    sql += ` LIMIT ? OFFSET ?`
    queryParams.push(limitNum, offset)
    
    const stmt = db.prepare(sql)
    const rows = stmt.all(...queryParams) as MenuItem[]
    
    return {
      items: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        total_pages: Math.ceil(total / limitNum)
      }
    }
  },

  // 获取单个商品
  getMenuItem(id: number): MenuItem | null {
    const stmt = db.prepare(`
      SELECT mi.id, mi.name, mi.description, c.code as category, mi.image 
      FROM menu_items mi 
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE mi.id = ?
    `)
    const item = stmt.get(id) as MenuItem | undefined
    return item || null
  },

  // 添加商品
  addMenuItem(data: AddMenuItemData): MenuItem {
    const { name, description, category, image } = data
    
    // 检查商品名称是否重复
    const existingStmt = db.prepare('SELECT id FROM menu_items WHERE name = ?')
    const existing = existingStmt.get(name)
    
    if (existing) {
      throw new Error('商品名称已存在')
    }
    
    // 获取分类ID
    const categoryStmt = db.prepare('SELECT id FROM categories WHERE code = ?')
    const categoryRow = categoryStmt.get(category) as any
    
    if (!categoryRow) {
      throw new Error('分类不存在')
    }
    
    const categoryId = categoryRow.id

    const insertStmt = db.prepare(`
      INSERT INTO menu_items (name, description, category_id, image) 
      VALUES (?, ?, ?, ?)
    `)
    
    const result = insertStmt.run(name, description, categoryId, image || '/placeholder.svg')
    
    return { 
      id: result.lastInsertRowid as number, 
      name, 
      description, 
      category, 
      image: image || '/placeholder.svg'
    }
  },

  // 删除商品（物理删除）
  deleteMenuItems(ids: number[]): DeleteResult {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { deleted_count: 0, deleted_ids: [] }
    }
    
    const placeholders = ids.map(() => '?').join(',')
    const stmt = db.prepare(`DELETE FROM menu_items WHERE id IN (${placeholders})`)
    
    const result = stmt.run(...ids)
    
    return {
      deleted_count: result.changes,
      deleted_ids: ids
    }
  },

  // 添加分类
  addCategory(data: AddCategoryData): Category {
    const { name, image } = data
    
    // 生成分类代码
    const code = `cat-${Date.now()}`
    
    const stmt = db.prepare(`
      INSERT INTO categories (code, name, image) 
      VALUES (?, ?, ?)
    `)
    
    stmt.run(code, name, image || '/abstract-categories.png')
    
    return { 
      id: code,
      name, 
      image: image || '/abstract-categories.png'
    }
  },

  // 删除分类
  deleteCategory(categoryCode: string): { deleted_category: string; deleted_items_count: number } {
    // 获取分类的数据库ID
    const categoryStmt = db.prepare('SELECT id FROM categories WHERE code = ?')
    const categoryRow = categoryStmt.get(categoryCode) as any
    
    if (!categoryRow) {
      throw new Error('分类不存在')
    }
    
    const categoryId = categoryRow.id
    
    // 统计要删除的商品数量
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM menu_items WHERE category_id = ?')
    const countResult = countStmt.get(categoryId) as any
    const deletedItemsCount = countResult.count
    
    // 使用事务删除
    const deleteTransaction = db.transaction(() => {
      // 删除分类下的商品（物理删除）
      const deleteItemsStmt = db.prepare('DELETE FROM menu_items WHERE category_id = ?')
      deleteItemsStmt.run(categoryId)
      
      // 删除分类
      const deleteCategoryStmt = db.prepare('DELETE FROM categories WHERE id = ?')
      deleteCategoryStmt.run(categoryId)
    })
    
    deleteTransaction()
    
    return {
      deleted_category: categoryCode,
      deleted_items_count: deletedItemsCount
    }
  },

  // 更新商品
  updateMenuItem(id: number, data: AddMenuItemData): MenuItem {
    const { name, description, category, image } = data
    
    // 检查商品是否存在
    const existingItem = this.getMenuItem(id)
    if (!existingItem) {
      throw new Error('商品不存在')
    }
    
    // 检查商品名称是否重复（排除当前商品）
    const duplicateStmt = db.prepare('SELECT id FROM menu_items WHERE name = ? AND id != ?')
    const duplicate = duplicateStmt.get(name, id)
    
    if (duplicate) {
      throw new Error('商品名称已存在')
    }
    
    // 获取分类ID
    const categoryStmt = db.prepare('SELECT id FROM categories WHERE code = ?')
    const categoryRow = categoryStmt.get(category) as any
    
    if (!categoryRow) {
      throw new Error('分类不存在')
    }
    
    const categoryId = categoryRow.id

    const updateStmt = db.prepare(`
      UPDATE menu_items 
      SET name = ?, description = ?, category_id = ?, image = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `)
    
    updateStmt.run(name, description, categoryId, image || existingItem.image, id)
    
    return { 
      id, 
      name, 
      description, 
      category, 
      image: image || existingItem.image
    }
  },

  // 更新分类
  updateCategory(categoryCode: string, data: AddCategoryData): Category {
    const { name, image } = data
    
    // 检查分类是否存在
    const existingStmt = db.prepare('SELECT id, image FROM categories WHERE code = ?')
    const existingCategory = existingStmt.get(categoryCode) as any
    
    if (!existingCategory) {
      throw new Error('分类不存在')
    }

    const updateStmt = db.prepare(`
      UPDATE categories 
      SET name = ?, image = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE code = ?
    `)
    
    updateStmt.run(name, image || existingCategory.image, categoryCode)
    
    return { 
      id: categoryCode,
      name, 
      image: image || existingCategory.image
    }
  },

  // 保存菜谱
  saveRecipe(data: {
    cart_items: any[]
    requirements: any
    recipe_content: string
  }): { recipe_id: number } {
    const { cart_items, requirements, recipe_content } = data
    
    const stmt = db.prepare(`
      INSERT INTO recipes (content, cart_items, requirements, dish_count, soup_count, spice_level, restrictions, other_requirements) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      recipe_content,
      JSON.stringify(cart_items),
      JSON.stringify(requirements),
      requirements.dish_count || null,
      requirements.soup_count || null,
      requirements.spice_level || null,
      requirements.restrictions || null,
      requirements.other_requirements || null
    )
    
    return { recipe_id: result.lastInsertRowid as number }
  },

  // 更新菜谱内容
  updateRecipeContent(recipeId: number, content: string): void {
    const stmt = db.prepare('UPDATE recipes SET content = ? WHERE id = ?')
    stmt.run(content, recipeId)
  },

  // 获取菜谱
  getRecipe(recipeId: number): { id: number; content: string } | null {
    const stmt = db.prepare('SELECT id, content FROM recipes WHERE id = ?')
    const recipe = stmt.get(recipeId) as any
    return recipe || null
  },

  // 删除菜谱
  deleteRecipe(recipeId: number): void {
    const stmt = db.prepare('DELETE FROM recipes WHERE id = ?')
    stmt.run(recipeId)
  }
}

// 初始化数据库
initializeDatabase()
initializeDefaultData()

// 导入启动初始化（仅在服务端）
if (typeof window === 'undefined') {
  import('./startup-init').catch(error => {
    console.error('启动初始化导入失败:', error)
  })
}

export { db }
export default db