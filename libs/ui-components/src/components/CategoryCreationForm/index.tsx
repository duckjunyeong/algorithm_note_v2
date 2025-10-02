import { useCategoryCreationForm } from './useCategoryCreationForm';
import { CategoryCreationFormView } from './CategoryCreationForm.view';
import type { UseCategoryCreationFormProps } from './useCategoryCreationForm';

export function CategoryCreationForm({
  onSave,
  onCancel,
}: UseCategoryCreationFormProps) {
  const {
    name,
    color,
    error,
    isSubmitting,
    handleNameChange,
    handleColorChange,
    handleSubmit,
    handleCancel,
  } = useCategoryCreationForm({
    onSave,
    onCancel,
  });

  return (
    <CategoryCreationFormView
      name={name}
      color={color}
      error={error}
      isSubmitting={isSubmitting}
      onNameChange={handleNameChange}
      onColorChange={handleColorChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

export type { UseCategoryCreationFormProps as CategoryCreationFormProps };
