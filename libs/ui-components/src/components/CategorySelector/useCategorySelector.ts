import { useCallback } from 'react';

export interface UseCategorySelectorProps {
  categories: Array<{ categoryId: number; name: string; color: string }>;
  selectedCategoryId: number | null;
  isLoading: boolean;
  error: string | null;
  onCategorySelect: (categoryId: number) => void;
  onAddCategoryClick: () => void;
}

export function useCategorySelector({
  onCategorySelect,
  onAddCategoryClick,
}: UseCategorySelectorProps) {
  const handleCategoryClick = useCallback(
    (categoryId: number) => {
      onCategorySelect(categoryId);
    },
    [onCategorySelect]
  );

  const handleAddClick = useCallback(() => {
    onAddCategoryClick();
  }, [onAddCategoryClick]);

  return {
    handleCategoryClick,
    handleAddClick,
  };
}

export type { UseCategorySelectorProps as CategorySelectorProps };
