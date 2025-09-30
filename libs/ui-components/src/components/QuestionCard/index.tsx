import { useQuestionCard } from './useQuestionCard';
import { QuestionCardView } from './QuestionCard.view';
import type { QuestionCardProps } from './useQuestionCard';

export function QuestionCard({ questionId, question, onEdit, onDelete }: QuestionCardProps) {
  const { isLoading, handleEdit, handleDelete } = useQuestionCard({
    questionId,
    onEdit,
    onDelete
  });

  return (
    <QuestionCardView
      question={question}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  );
}

export type { QuestionCardProps };