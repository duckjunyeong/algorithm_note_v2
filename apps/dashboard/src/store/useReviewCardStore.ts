import { create } from 'zustand';
import type { ReviewCard, CreateReviewCardRequest } from '../../../../libs/api-types/src';
import { ReviewCardService } from '../services/reviewCardService';

interface ReviewCardState {
  reviewCards: ReviewCard[];
  isLoading: boolean;
  error: string | null;

  backlogCards: ReviewCard[];
  completedCards: ReviewCard[];
}

interface ReviewCardActions {
  fetchReviewCards: () => Promise<void>;

  createReviewCard: (data: CreateReviewCardRequest) => Promise<void>;

  updateCardStatus: (reviewCardId: number, isActive: boolean) => Promise<void>;

  moveCardToCompleted: (reviewCardId: number) => void;

  removeCard: (reviewCardId: number) => void;

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
      throw error; 
    }
  },

  updateCardStatus: async (reviewCardId: number, isActive: boolean) => {
    try {
      await ReviewCardService.updateReviewCardStatus(reviewCardId, isActive);

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