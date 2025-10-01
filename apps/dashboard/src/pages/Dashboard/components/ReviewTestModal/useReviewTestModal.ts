import { useState, useEffect } from 'react';
import { AnswerService } from '../../../../services/answerService';
import { ReviewQuestionService } from '../../../../services/reviewQuestionService';
import type { Answer, EvaluationResult } from '../../../../schemas/answer.schema';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';

export interface ReviewQuestion {
  reviewQuestionId: number;
  questionText: string;
}

export interface UseReviewTestModalProps {
  isOpen: boolean;
  reviewCardId: number | null;
  onClose: () => void;
}

export function useReviewTestModal({ isOpen, reviewCardId, onClose }: UseReviewTestModalProps) {
  const [currentView, setCurrentView] = useState<'input' | 'evaluation'>('input');
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answerInput, setAnswerInput] = useState<string>('');
  const [previousAnswers, setPreviousAnswers] = useState<Answer[]>([]);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState<number>(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState<boolean>(false);
  const [isSavingAnswer, setIsSavingAnswer] = useState<boolean>(false);

  // 모달이 열릴 때 질문 목록 로드
  useEffect(() => {
    if (isOpen && reviewCardId) {
      loadQuestions(reviewCardId);
    } else {
      resetModalState();
    }
  }, [isOpen, reviewCardId]);

  const loadQuestions = async (cardId: number) => {
    setIsLoadingQuestions(true);
    try {
      const questions = await ReviewQuestionService.getQuestionsByReviewCardId(cardId);
      setQuestions(questions);
    } catch (error) {
      showErrorToast('질문을 불러오는데 실패했습니다.');
      onClose();
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const resetModalState = () => {
    setCurrentView('input');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswerInput('');
    setPreviousAnswers([]);
    setCurrentAnswerIndex(0);
  };

  const handleSubmitAnswer = async () => {
    // 입력값 검증
    if (!answerInput.trim()) {
      showErrorToast('답변을 입력해주세요.');
      return;
    }

    if (questions.length === 0) {
      showErrorToast('질문이 없습니다.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    // Evaluation View로 전환
    setCurrentView('evaluation');

    // 이전 답변 목록 로드
    await loadPreviousAnswers(currentQuestion.reviewQuestionId);
  };

  const loadPreviousAnswers = async (questionId: number) => {
    setIsLoadingAnswers(true);
    try {
      const answers = await AnswerService.getAnswersByQuestionId(questionId);
      setPreviousAnswers(answers);
      setCurrentAnswerIndex(0); // 최신 답변부터 시작
    } catch (error) {
      showErrorToast('이전 답변을 불러오는데 실패했습니다.');
      setPreviousAnswers([]);
    } finally {
      setIsLoadingAnswers(false);
    }
  };

  const handlePrevAnswer = () => {
    if (currentAnswerIndex < previousAnswers.length - 1) {
      setCurrentAnswerIndex(currentAnswerIndex + 1);
    }
  };

  const handleNextAnswer = () => {
    if (currentAnswerIndex > 0) {
      setCurrentAnswerIndex(currentAnswerIndex - 1);
    }
  };

  const handleEvaluate = async (result: EvaluationResult) => {
    if (questions.length === 0) {
      showErrorToast('질문이 없습니다.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    setIsSavingAnswer(true);
    try {
      await AnswerService.createAnswer({
        questionId: currentQuestion.reviewQuestionId,
        content: answerInput,
        evaluationResult: result,
      });

      // 마지막 질문인지 확인
      if (currentQuestionIndex === questions.length - 1) {
        // 마지막 질문 - 모달 닫기
        showSuccessToast('테스트가 완료되었습니다.');
        onClose();
      } else {
        // 다음 질문으로 이동
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswerInput('');
        setCurrentView('input');
        setPreviousAnswers([]);
      }
    } catch (error) {
      showErrorToast('평가 저장에 실패했습니다.');
    } finally {
      setIsSavingAnswer(false);
    }
  };

  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;
  const isPrevAnswerDisabled = currentAnswerIndex >= previousAnswers.length - 1;
  const isNextAnswerDisabled = currentAnswerIndex <= 0;

  return {
    currentView,
    currentQuestion,
    answerInput,
    setAnswerInput,
    previousAnswers,
    currentAnswerIndex,
    isLoadingQuestions,
    isLoadingAnswers,
    isSavingAnswer,
    isPrevAnswerDisabled,
    isNextAnswerDisabled,
    handleSubmitAnswer,
    handlePrevAnswer,
    handleNextAnswer,
    handleEvaluate,
  };
}
