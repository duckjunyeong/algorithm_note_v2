import { useCategorySelector } from './useCategorySelector';
import { CategorySelectorView } from './CategorySelector.view';
import type { CategorySelectorProps } from './useCategorySelector';

export function CategorySelector({
  categories,
  selectedCategoryId,
  isLoading,
  error,
  onCategorySelect,
  onAddCategoryClick,
}: CategorySelectorProps) {
  const { handleCategoryClick, handleAddClick } = useCategorySelector({
    categories,
    selectedCategoryId,
    isLoading,
    error,
    onCategorySelect,
    onAddCategoryClick,
  });

  return (
    <CategorySelectorView
      categories={categories}
      selectedCategoryId={selectedCategoryId}
      isLoading={isLoading}
      error={error}
      onCategoryClick={handleCategoryClick}
      onAddClick={handleAddClick}
    />
  );
}

export type { CategorySelectorProps };
