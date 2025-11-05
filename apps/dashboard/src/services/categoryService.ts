import apiClient from './apiClient';
import {
  categorySchema,
  createCategoryRequestSchema,
  getCategoriesResponseSchema,
  type Category,
  type CreateCategoryRequest
} from '../schemas/category.schema';


export class CategoryService {

  async fetchCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get('/categories');
      return getCategoriesResponseSchema.parse(response.data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`카테고리 목록 조회 실패: ${error.message}`);
      }
      throw new Error('카테고리 목록 조회 중 알 수 없는 오류가 발생했습니다.');
    }
  }


  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const validatedRequest = createCategoryRequestSchema.parse(data);

    try {
      const response = await apiClient.post('/categories', validatedRequest);
      return categorySchema.parse(response.data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`카테고리 생성 실패: ${error.message}`);
      }
      throw new Error('카테고리 생성 중 알 수 없는 오류가 발생했습니다.');
    }
  }


  async getCategoryById(categoryId: number): Promise<Category> {
    try {
      const response = await apiClient.get(`/categories/${categoryId}`);
      return categorySchema.parse(response.data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`카테고리 조회 실패: ${error.message}`);
      }
      throw new Error('카테고리 조회 중 알 수 없는 오류가 발생했습니다.');
    }
  }

  async deleteCategory(categoryId: number): Promise<void> {
    try {
      await apiClient.delete(`/categories/${categoryId}`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`카테고리 삭제 실패: ${error.message}`);
      }
      throw new Error('카테고리 삭제 중 알 수 없는 오류가 발생했습니다.');
    }
  }
}

export const categoryService = new CategoryService();
