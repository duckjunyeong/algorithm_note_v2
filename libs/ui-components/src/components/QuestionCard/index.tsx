import { useQuestionCard } from './useQuestionCard';
import { QuestionCardView } from './QuestionCard.view';
import type { QuestionCardProps } from './useQuestionCard';

export function QuestionCard({
  questionId,
  question,
  onEdit,
  onDelete,
  onQuestionClick
}: QuestionCardProps) {
  const {
    isLoading,
    handleEdit,
    handleDelete,
    onQuestionClick: handleQuestionClick
  } = useQuestionCard({
    questionId,
    onEdit,
    onDelete,
    onQuestionClick
  });

  return (
    <QuestionCardView
      question={question}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onQuestionClick={handleQuestionClick}
      isLoading={isLoading}
    />
  );
}

export type { QuestionCardProps };