# Implementation Plan

- [x] 1. 设置后端 API 基础架构

  - 创建 API 路由目录结构和基础配置
  - 更新数据库配置为 TypeScript 兼容
  - 实现统一的 API 响应格式和错误处理
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 1.1 创建 API 路由目录结构

  - 在 app 目录下创建 api/v1 路由结构
  - 设置基础的路由处理器模板
  - _Requirements: 1.1_

- [x] 1.2 更新数据库配置

  - 将 database/config.js 转换为 TypeScript
  - 添加类型定义和错误处理
  - 测试数据库连接功能
  - _Requirements: 1.1, 1.3_

- [x] 1.3 实现统一 API 响应格式

  - 创建 API 响应类型定义
  - 实现统一的错误处理中间件
  - 添加请求验证工具
  - _Requirements: 1.2, 1.3_

- [x] 2. 实现商品管理 API 接口

  - 实现获取商品列表 API（支持分页、搜索、分类筛选）
  - 实现获取单个商品详情 API
  - 实现添加新商品 API（包含重复名称检查）
  - 实现批量删除商品 API
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4_

- [x] 2.1 实现获取商品列表 API

  - 创建 GET /api/v1/menu/items 路由
  - 实现分页、搜索、分类筛选逻辑
  - 添加响应数据格式化
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2.2 实现获取单个商品 API

  - 创建 GET /api/v1/menu/item 路由
  - 实现根据 ID 查询单个商品
  - 添加商品不存在的错误处理
  - _Requirements: 2.1_

- [x] 2.3 实现添加商品 API

  - 创建 POST /api/v1/menu/add-item 路由
  - 实现商品名称重复检查
  - 添加数据验证和错误处理
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2.4 实现删除商品 API

  - 创建 POST /api/v1/menu/delete-items 路由
  - 实现单个和批量删除功能
  - 添加删除结果统计
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 3. 实现分类管理 API 接口

  - 实现获取分类列表 API
  - 实现添加新分类 API
  - 实现删除分类 API（级联删除商品）
  - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4_

- [x] 3.1 实现获取分类列表 API

  - 创建 GET /api/v1/categories 路由
  - 实现分类数据查询和格式化
  - 确保返回分类代码而非数据库 ID
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 3.2 实现添加分类 API

  - 创建 POST /api/v1/categories/add 路由
  - 实现分类代码自动生成
  - 添加分类名称重复检查
  - _Requirements: 6.1, 6.4_

- [x] 3.3 实现删除分类 API

  - 创建 POST /api/v1/categories/delete 路由
  - 实现级联删除分类下的所有商品
  - 添加事务处理确保数据一致性
  - _Requirements: 6.2_

- [x] 4. 实现图片上传功能

  - 实现图片上传 API 接口
  - 添加文件类型和大小验证
  - 实现图片存储和 URL 生成
  - _Requirements: 3.3, 6.3_

- [x] 4.1 创建图片上传 API

  - 创建 POST /api/v1/upload/image 路由
  - 实现 multipart/form-data 处理
  - 添加文件验证和安全检查
  - _Requirements: 3.3, 6.3_

- [x] 4.2 实现图片存储逻辑

  - 创建 public/uploads 目录结构
  - 实现文件重命名和存储
  - 生成可访问的图片 URL
  - _Requirements: 3.3, 6.3_

- [x] 5. 实现菜谱生成 API

  - 实现菜谱生成 API 接口
  - 创建菜谱生成逻辑
  - 实现菜谱数据库存储
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 5.1 创建菜谱生成 API

  - 创建 POST /api/v1/recipes/generate 路由
  - 实现基于菜篮子商品的菜谱生成逻辑
  - 添加个性化要求处理
  - _Requirements: 7.1, 7.2_

- [x] 5.2 实现菜谱存储功能

  - 将生成的菜谱保存到数据库
  - 记录生成参数和时间戳
  - 返回格式化的菜谱内容
  - _Requirements: 7.2_

- [x] 6. 创建前端 API 客户端

  - 创建统一的 API 调用客户端
  - 实现错误处理和类型安全
  - 添加请求拦截器和响应处理
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 6.1 创建 API 客户端基础结构

  - 创建 lib/api-client.ts 文件
  - 实现基础的 HTTP 请求封装
  - 添加统一的错误处理
  - _Requirements: 8.1, 8.2_

- [x] 6.2 实现商品相关 API 调用

  - 实现 getMenuItems、getMenuItem 方法
  - 实现 addMenuItem、deleteMenuItems 方法
  - 添加类型定义和参数验证
  - _Requirements: 8.1, 8.3_

- [x] 6.3 实现分类相关 API 调用

  - 实现 getCategories、addCategory 方法
  - 实现 deleteCategory 方法
  - 确保分类 ID 格式转换正确
  - _Requirements: 8.1, 8.3_

- [x] 6.4 实现菜谱和图片上传 API 调用

  - 实现 generateRecipe 方法
  - 实现 uploadImage 方法
  - 添加文件上传进度处理
  - _Requirements: 8.1, 8.3_

- [x] 7. 更新前端数据类型和 Context

  - 更新 MenuItem 和 Category 类型定义
  - 修改 MenuContext 使用 API 调用
  - 保持现有接口兼容性
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 7.1 更新数据类型定义

  - 修改 lib/types.ts 中的接口定义
  - 将 MenuItem.id 改为 number 类型
  - 添加 API 相关的类型定义
  - _Requirements: 8.3_

- [x] 7.2 更新 MenuContext 实现

  - 修改 contexts/menu-context.tsx 使用 API 调用
  - 添加加载状态和错误处理
  - 保持现有方法接口不变
  - _Requirements: 8.1, 8.2, 8.4_

- [x] 7.3 添加加载状态管理

  - 在 Context 中添加 loading 状态
  - 实现错误状态处理
  - 添加重试机制
  - _Requirements: 8.2, 8.4_

- [x] 8. 更新前端组件集成 API

  - 更新添加商品对话框集成图片上传
  - 更新添加分类对话框集成图片上传
  - 修改商品卡片组件处理新的数据类型
  - 添加加载状态和错误提示
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 8.1 更新添加商品对话框

  - 修改 components/add-item-dialog.tsx
  - 集成图片上传 API 调用
  - 添加上传进度和错误处理
  - _Requirements: 8.1, 8.4_

- [x] 8.2 更新添加分类对话框

  - 修改 components/add-category-dialog.tsx
  - 集成图片上传 API 调用
  - 保持现有 UI 交互不变
  - _Requirements: 8.1, 8.4_

- [x] 8.3 更新商品卡片组件

  - 修改 components/menu-item-card.tsx
  - 处理数字类型的商品 ID
  - 添加图片加载失败处理
  - _Requirements: 8.3_

- [x] 8.4 更新主页面组件

  - 修改 app/page.tsx
  - 添加数据加载状态显示
  - 集成错误处理和重试功能
  - _Requirements: 8.2, 8.4_

- [x] 9. 更新菜谱生成页面

  - 修改结算页面使用菜谱生成 API
  - 保持现有 UI 和交互体验
  - 添加生成状态和错误处理
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 9.1 更新结算页面 API 集成

  - 修改 app/checkout/page.tsx
  - 替换模拟菜谱生成为 API 调用
  - 保持现有的 UI 和用户体验
  - _Requirements: 7.1, 7.2_

- [x] 9.2 添加菜谱生成错误处理

  - 实现生成失败的错误提示
  - 添加重试机制
  - 处理空菜篮子的边界情况
  - _Requirements: 7.3, 7.4_

- [x] 10. API 功能测试和验证

  - 创建 API 接口测试脚本
  - 验证所有 CRUD 操作功能
  - 测试错误处理和边界情况
  - 验证数据库连接和查询性能
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 10.1 创建 API 测试脚本

  - 创建测试脚本验证所有 API 接口
  - 测试商品和分类的 CRUD 操作
  - 验证菜谱生成和图片上传功能
  - _Requirements: 9.1, 9.3_

- [x] 10.2 测试数据库连接和性能

  - 验证数据库连接稳定性
  - 测试查询性能和分页功能
  - 验证事务处理和数据一致性
  - _Requirements: 9.2, 9.3_

- [ ]\* 10.3 创建单元测试

  - 为 API 路由创建单元测试
  - 测试数据库查询函数
  - 验证错误处理逻辑
  - _Requirements: 9.1, 9.4_

- [x] 11. 端到端集成测试

  - 测试完整的用户操作流程
  - 验证前后端数据同步
  - 测试并发操作和数据一致性
  - 确保所有功能正常运行
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 11.1 测试商品管理流程

  - 测试浏览、搜索、分页功能
  - 验证添加、删除商品操作
  - 测试图片上传和显示
  - _Requirements: 10.1, 10.4_

- [x] 11.2 测试分类管理流程

  - 验证分类浏览和切换
  - 测试添加、删除分类操作
  - 验证级联删除功能
  - _Requirements: 10.1, 10.4_

- [x] 11.3 测试菜谱生成流程

  - 验证完整的菜篮子到菜谱生成流程
  - 测试不同参数组合的菜谱生成
  - 验证菜谱内容格式和显示
  - _Requirements: 10.2, 10.4_

- [x] 11.4 测试错误处理和边界情况

  - 测试网络错误和数据库连接失败
  - 验证输入验证和错误提示
  - 测试并发操作和数据冲突
  - _Requirements: 10.3, 10.4_

- [x] 12. 部署准备和最终验证

  - 配置生产环境数据库连接
  - 验证所有功能在生产环境正常运行
  - 创建部署文档和使用说明
  - 进行最终的完整性测试
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 12.1 配置生产环境

  - 设置环境变量和数据库配置
  - 配置图片上传目录权限
  - 验证 API 路由在生产环境可访问
  - _Requirements: 10.1_

- [x] 12.2 最终功能验证

  - 在生产环境测试所有功能
  - 验证数据持久化和性能
  - 确保用户界面响应正常
  - _Requirements: 10.2, 10.3, 10.4_

- [x] 12.3 创建使用文档
  - 编写 API 接口使用说明
  - 创建部署和维护文档
  - 提供故障排除指南
  - _Requirements: 10.4_
