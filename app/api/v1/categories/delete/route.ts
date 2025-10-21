import { NextRequest } from 'next/server'
import { queries } from '@/lib/database-sqlite'
import { withDatabaseConnection, parseRequestBody } from '@/lib/api-utils-sqlite'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-types'

// POST /api/v1/categories/delete - 删除分类
export async function POST(request: NextRequest) {
  return withDatabaseConnection(async () => {
    const body = await parseRequestBody(request)
    const { id } = body

    if (!id || typeof id !== 'string') {
      return createErrorResponse('分类ID不能为空', 400)
    }

    const result = await queries.deleteCategory(id)

    return createSuccessResponse(result, '分类删除成功')
  })
}