import { useQuestionCard } from './useQuestionCard';
import { QuestionCardView } from './QuestionCard.view';
import type { QuestionCardProps } from './useQuestionCard';

export function QuestionCard({ questionId, question, onRegister }: QuestionCardProps) {
  const { isLoading, handleRegister } = useQuestionCard({
    questionId,
    onRegister
  });

  return (
    <QuestionCardView
      question={question}
      onRegister={handleRegister}
      isLoading={isLoading}
    />
  );
}

export type { QuestionCardProps };