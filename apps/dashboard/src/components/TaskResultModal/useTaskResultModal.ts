import { useState, useEffect } from 'react';
import { ChatSessionService } from '../../services/chatSessionService';
import { ReviewCardService } from '../../services/reviewCardService';
import { parseConversationByQuestions } from './utils/conversationParser';
import type { QuestionConversation } from './utils/conversationParser';

interface UseTaskResultModalProps {
  isOpen: boolean;
  reviewCardId: number;
  onClose: () => void;
}

export const useTaskResultModal = ({
  isOpen,
  reviewCardId,
  onClose
}: UseTaskResultModalProps) => {
  const [questions, setQuestions] = useState<QuestionConversation[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [evaluations, setEvaluations] = useState<Map<number, 'SUCCESS' | 'FAILURE'>>(new Map());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [canComplete, setCanComplete] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setEvaluations(new Map());
      setCanComplete(false);
      setError(null);
      return;
    }

    const loadChatSession = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const session = await ChatSessionService.getChatSessionByReviewCardId(reviewCardId);
        console.log('Loaded Chat Session:', session);
        const parsedQuestions = parseConversationByQuestions(
          session.conversationHistory,
          session.reviewQuestions
        );
        console.log('Parsed Questions:', parsedQuestions);
        
        setQuestions(parsedQuestions);
      } catch (err) {
        console.error('채팅 세션 로드 실패:', err);
        setError('대화 내역을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadChatSession();
  }, [isOpen, reviewCardId]);

  const handleEvaluate = (result: 'SUCCESS' | 'FAILURE') => {
    const currentQuestion = questions[currentQuestionIndex];

    setEvaluations(prev => {
      const newMap = new Map(prev);
      newMap.set(currentQuestion.reviewQuestionId, result);
      return newMap;
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCanComplete(true);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);

    try {
      const questionUpdates = Array.from(evaluations.entries()).map(([questionId, result]) => ({
        reviewQuestionId: questionId,
        successCount: result === 'SUCCESS' ? 1 : 0,
        failCount: result === 'FAILURE' ? 1 : 0
      }));

      await ReviewCardService.updateReviewResult(reviewCardId, {
        isActive: false,
        deletedQuestionIds: [],
        questionUpdates
      });

      onClose();
    } catch (err) {
      console.error('결과 저장 실패:', err);
      setError('결과를 저장하는데 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const hasEvaluated = currentQuestion ? evaluations.has(currentQuestion.reviewQuestionId) : false;

  return {
    questions,
    currentQuestionIndex,
    currentQuestion,
    hasEvaluated,
    canComplete,
    isLoading,
    isSaving,
    error,
    handleEvaluate,
    handleComplete
  };
};
