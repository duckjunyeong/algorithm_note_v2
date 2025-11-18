import React from 'react';

interface QuestionCardViewProps {
  questionText: string;
  questionNumber?: number;
  totalQuestions?: number;
}

export const QuestionCardView: React.FC<QuestionCardViewProps> = ({
  questionText,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <div className="my-6">
      <div className="flex flex-col gap-2">
        {questionNumber !== undefined && totalQuestions !== undefined && (
          <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
            Question {questionNumber}/{totalQuestions}
          </span>
        )}
        <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-relaxed">
          <span className="text-neutral-400 dark:text-neutral-500">"</span>
          <span className="whitespace-pre-wrap">{questionText}</span>
          <span className="text-neutral-400 dark:text-neutral-500">"</span>
        </p>
      </div>
    </div>
  );
};
