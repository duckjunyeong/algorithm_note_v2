import { create } from 'zustand';
import type { ReviewCard, CreateReviewCardRequest } from '../../../../libs/api-types/src';
import { ReviewCardService } from '../services/reviewCardService';

interface ReviewCardState {
  // 상태
  reviewCards: ReviewCard[];
  isLoading: boolean;
  error: string | null;

  // 필터된 데이터
  backlogCards: ReviewCard[];
  completedCards: ReviewCard[];
}

interface ReviewCardActions {
  // 복습 카드 목록 조회
  fetchReviewCards: () => Promise<void>;

  // 복습 카드 생성
  createReviewCard: (data: CreateReviewCardRequest) => Promise<void>;

  // 복습 카드 상태 업데이트
  updateCardStatus: (reviewCardId: number, isActive: boolean) => Promise<void>;

  // 낙관적 UI: 카드를 완료로 이동
  moveCardToCompleted: (reviewCardId: number) => void;

  // 낙관적 UI: 카드 삭제
  removeCard: (reviewCardId: number) => void;

  // 상태 초기화
  clearError: () => void;
  reset: () => void;
}

type ReviewCardStore = ReviewCardState & ReviewCardActions;

const initialState: ReviewCardState = {
  reviewCards: [],
  isLoading: false,
  error: null,
  backlogCards: [],
  completedCards: [],
};

export const useReviewCardStore = create<ReviewCardStore>((set, get) => ({
  ...initialState,

  fetchReviewCards: async () => {
    set({ isLoading: true, error: null });

    try {
      const reviewCards = await ReviewCardService.getReviewCards();

      // isActive 기준으로 필터링
      const backlogCards = reviewCards.filter(card => card.isActive);
      const completedCards = reviewCards.filter(card => !card.isActive);

      set({
        reviewCards,
        backlogCards,
        completedCards,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : '복습 카드 목록을 불러오는 데 실패했습니다.';

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  createReviewCard: async (data: CreateReviewCardRequest) => {
    set({ isLoading: true, error: null });

    try {
      await ReviewCardService.createReviewCard(data);

      // 생성 후 목록 새로고침
      await get().fetchReviewCards();

      set({ isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : '복습 카드 생성에 실패했습니다.';

      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error; // 호출자에게 에러를 전파하여 UI에서 처리
    }
  },

  updateCardStatus: async (reviewCardId: number, isActive: boolean) => {
    try {
      await ReviewCardService.updateReviewCardStatus(reviewCardId, isActive);

      // 로컬 상태 업데이트
      const { reviewCards } = get();
      const updatedCards = reviewCards.map(card =>
        card.reviewCardId === reviewCardId
          ? { ...card, isActive }
          : card
      );

      const backlogCards = updatedCards.filter(card => card.isActive);
      const completedCards = updatedCards.filter(card => !card.isActive);

      set({
        reviewCards: updatedCards,
        backlogCards,
        completedCards,
      });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : '복습 카드 상태 업데이트에 실패했습니다.';

      set({ error: errorMessage });
      throw error;
    }
  },

  moveCardToCompleted: (reviewCardId: number) => {
    const { reviewCards } = get();
    const updatedCards = reviewCards.map(card =>
      card.reviewCardId === reviewCardId
        ? { ...card, isActive: false }
        : card
    );

    const backlogCards = updatedCards.filter(card => card.isActive);
    const completedCards = updatedCards.filter(card => !card.isActive);

    set({
      reviewCards: updatedCards,
      backlogCards,
      completedCards,
    });
  },

  removeCard: (reviewCardId: number) => {
    const { reviewCards } = get();
    const updatedCards = reviewCards.filter(card => card.reviewCardId !== reviewCardId);

    const backlogCards = updatedCards.filter(card => card.isActive);
    const completedCards = updatedCards.filter(card => !card.isActive);

    set({
      reviewCards: updatedCards,
      backlogCards,
      completedCards,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));