/**
 * 카테고리 API 타입 정의
 */

// 카테고리 기본 인터페이스
export interface Category {
  categoryId: number;
  name: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

// 카테고리 생성 요청 인터페이스
export interface CreateCategoryRequest {
  name: string;
  color: string;
}

// 카테고리 생성 응답 인터페이스 (Category와 동일)
export type CreateCategoryResponse = Category;

// 카테고리 목록 조회 응답 인터페이스
export type GetCategoriesResponse = Category[];

// API 에러 응답 인터페이스
export interface ApiErrorResponse {
  error: string;
  message: string;
  status: number;
}
