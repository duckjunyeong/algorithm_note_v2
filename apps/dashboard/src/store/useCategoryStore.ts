import { create } from 'zustand';
import type { Category } from '../schemas/category.schema';

interface CategoryState {
  categories: Category[];
  selectedCategoryId: number | null;
}

interface CategoryActions {
  setCategories: (categories: Category[]) => void;
  selectCategory: (id: number | null) => void;
  addCategory: (category: Category) => void;
  clearSelection: () => void;
  removeCategory: (categoryId: number) => void;
}

type CategoryStore = CategoryState & CategoryActions;

const initialState: CategoryState = {
  categories: [],
  selectedCategoryId: null,
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  ...initialState,

  setCategories: (categories) =>
    set(() => ({
      categories,
    })),

  selectCategory: (id) =>
    set(() => ({
      selectedCategoryId: id,
    })),

  addCategory: (category) =>
    set((state) => ({
      categories: [category, ...state.categories],
      selectedCategoryId: category.categoryId, // 자동 선택
    })),

  clearSelection: () =>
    set(() => ({
      selectedCategoryId: null,
    })),

  removeCategory: (categoryId) =>
    set((state) => ({
      categories: state.categories.filter((cat) => cat.categoryId !== categoryId),
      selectedCategoryId: state.selectedCategoryId === categoryId ? null : state.selectedCategoryId,
    })),
}));
