/**
 * API Types Library Entry Point
 * 모든 API 타입 정의를 중앙에서 관리하고 export
 */

// 복습 카드 관련 타입
export type {
  ReviewCard,
  ReviewQuestion,
  CreateReviewCardRequest,
  CreateReviewCardResponse,
  GetReviewCardsResponse,
  GenerateExamPdfRequest,
  Answer,
  QuestionWithAnswers,
  ReviewCardResultResponse,
  ApiErrorResponse
} from './review-card.types';

// 카테고리 관련 타입
export type {
  Category,
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetCategoriesResponse
} from './category.types';

// 음성 업로드 관련 타입
export type {
  SignedUrlRequest,
  SignedUrlResponse
} from './audio-upload.types';

// 음성 인식 관련 타입
export type {
  TranscribeAudioRequest,
  TranscribeAudioResponse
} from './speech-transcription.types';

export type {
  ActivityRecord,
  StreakInfo,
  RecordCompletionRequest,
  RecordCompletionResponse,
  StreakInfoResponse
} from './activity.types';