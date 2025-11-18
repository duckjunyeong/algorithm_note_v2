import React from 'react';
import { QuestionCardView } from './QuestionCard.view';
import { useQuestionCard } from './useQuestionCard';

interface QuestionCardProps {
  content: string;
  questionNumber?: number;
  totalQuestions?: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  content,
  questionNumber,
  totalQuestions,
}) => {
  const { questionText } = useQuestionCard({
    content,
    questionNumber,
    totalQuestions,
  });

  return (
    <QuestionCardView
      questionText={questionText}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
    />
  );
};
