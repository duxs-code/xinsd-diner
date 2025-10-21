import { NextRequest } from 'next/server'
import { queries } from '@/lib/database-sqlite'
import { withDatabaseConnection } from '@/lib/api-utils-sqlite'
import { createSuccessResponse } from '@/lib/api-types'

// GET /api/v1/categories - 获取分类列表
export async function GET(request: NextRequest) {
  return withDatabaseConnection(async () => {
    const categories = await queries.getCategories()
    return createSuccessResponse(categories)
  })
}