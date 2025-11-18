import { useMemo } from 'react';

interface UseQuestionCardProps {
  content: string;
  questionNumber?: number;
  totalQuestions?: number;
}

interface QuestionData {
  questionText: string;
  questionNumber?: number;
  totalQuestions?: number;
}

export const useQuestionCard = ({
  content,
  questionNumber,
  totalQuestions,
}: UseQuestionCardProps): QuestionData => {
  const questionText = useMemo(() => {
    const questionMarker = '## 🤔 질문';
    const markerIndex = content.indexOf(questionMarker);

    if (markerIndex === -1) {
      return content;
    }

    const afterMarker = content.slice(markerIndex + questionMarker.length);
    const nextLineIndex = afterMarker.indexOf('\n');

    if (nextLineIndex === -1) {
      return afterMarker.trim();
    }

    const questionContent = afterMarker.slice(nextLineIndex + 1).trim();
    return questionContent;
  }, [content]);

  return {
    questionText,
    questionNumber,
    totalQuestions,
  };
};
