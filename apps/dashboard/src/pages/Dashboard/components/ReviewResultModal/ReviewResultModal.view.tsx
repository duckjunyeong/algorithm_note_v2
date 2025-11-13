import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { QuestionWithAnswers, Answer } from '../../../../../../../libs/api-types/src';
import { ConfirmModal } from '../../../../../../../libs/ui-components/src/components/ConfirmModal';

export interface ReviewResultModalViewProps {
  isOpen: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  currentQuestion: QuestionWithAnswers | null;
  currentAnswer: Answer | null;
  currentQuestionIndex: number;
  currentAnswerIndex: number;
  totalQuestions: number;
  totalAnswers: number;
  isPrevQuestionDisabled: boolean;
  isNextQuestionDisabled: boolean;
  isPrevAnswerDisabled: boolean;
  isNextAnswerDisabled: boolean;
  onClose: () => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  onPrevAnswer: () => void;
  onNextAnswer: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isDeleteConfirmOpen: boolean;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
}

export function ReviewResultModalView({
  isOpen,
  isLoading,
  isError,
  currentQuestion,
  currentAnswer,
  currentQuestionIndex,
  currentAnswerIndex,
  totalQuestions,
  totalAnswers,
  isPrevQuestionDisabled,
  isNextQuestionDisabled,
  isPrevAnswerDisabled,
  isNextAnswerDisabled,
  onClose,
  onPrevQuestion,
  onNextQuestion,
  onPrevAnswer,
  onNextAnswer,
  onDelete,
  isDeleting,
  isDeleteConfirmOpen,
  onDeleteCancel,
  onDeleteConfirm,
}: ReviewResultModalViewProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-background-primary p-6 shadow-xl"
        >
          {/* 헤더 */}
          <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
            <h2 className="text-2xl font-bold text-text-primary">결과 보기</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-neutral-50"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          )}

          {/* 에러 상태 */}
          {isError && (
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <p className="text-red-600 font-medium">데이터를 불러오는 데 실패했습니다.</p>
            </div>
          )}

          {/* 데이터 표시 */}
          {!isLoading && !isError && currentQuestion && (
            <div className="space-y-6">
              {/* 질문 네비게이션 */}
              <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-4">
                <button
                  type="button"
                  onClick={onPrevQuestion}
                  disabled={isPrevQuestionDisabled}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                    isPrevQuestionDisabled
                      ? 'cursor-not-allowed text-neutral-300'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <FiChevronLeft size={20} />
                  이전 질문
                </button>
                <span className="text-sm text-text-secondary">
                  질문 {currentQuestionIndex + 1} / {totalQuestions}
                </span>
                <button
                  type="button"
                  onClick={onNextQuestion}
                  disabled={isNextQuestionDisabled}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                    isNextQuestionDisabled
                      ? 'cursor-not-allowed text-neutral-300'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  다음 질문
                  <FiChevronRight size={20} />
                </button>
              </div>

              {/* 질문 내용 */}
              <div className="rounded-lg border border-neutral-100 bg-background-secondary p-4">
                <h3 className="mb-2 text-sm font-medium text-text-secondary">질문</h3>
                <p className="text-text-primary whitespace-pre-wrap">{currentQuestion.questionText}</p>
              </div>

              {/* 답변 내용 */}
              {currentAnswer ? (
                <div className="space-y-4">
                  {/* 답변 네비게이션 */}
                  <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-4">
                    <button
                      type="button"
                      onClick={onPrevAnswer}
                      disabled={isPrevAnswerDisabled}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                        isPrevAnswerDisabled
                          ? 'cursor-not-allowed text-neutral-300'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <FiChevronLeft size={20} />
                      이전 답변
                    </button>
                    <span className="text-sm text-text-secondary">
                      답변 {currentAnswerIndex + 1} / {totalAnswers}
                    </span>
                    <button
                      type="button"
                      onClick={onNextAnswer}
                      disabled={isNextAnswerDisabled}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                        isNextAnswerDisabled
                          ? 'cursor-not-allowed text-neutral-300'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      다음 답변
                      <FiChevronRight size={20} />
                    </button>
                  </div>

                  {/* 답변 상세 */}
                  <div
                    className={`rounded-lg border p-4 ${
                      currentAnswer.evaluationResult === 'SUCCESS'
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-text-secondary">답변</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          currentAnswer.evaluationResult === 'SUCCESS'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {currentAnswer.evaluationResult === 'SUCCESS' ? '성공' : '실패'}
                      </span>
                    </div>
                    <p className="text-text-primary whitespace-pre-wrap">{currentAnswer.content}</p>
                    <p className="mt-3 text-xs text-text-tertiary">
                      작성일: {new Date(currentAnswer.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-8 text-center">
                  <p className="text-text-secondary">기록된 답변이 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {!isLoading && !isError && (
            <div className="mt-6 border-t border-neutral-100 pt-4 flex justify-end">
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className={`rounded-lg px-6 py-2.5 font-medium transition-colors ${
                  isDeleting
                    ? 'cursor-not-allowed bg-semantic-error-light text-semantic-error opacity-50'
                    : 'bg-semantic-error text-white hover:bg-semantic-error-dark'
                }`}
              >
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    삭제 중...
                  </span>
                ) : (
                  '삭제하기'
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="복습 카드 삭제"
        message="정말로 이 복습 카드를 삭제하시겠습니까?"
        onConfirm={onDeleteConfirm}
        onCancel={onDeleteCancel}
        isLoading={isDeleting}
        confirmText="삭제하기"
        cancelText="취소"
      />
    </AnimatePresence>
  );
}
