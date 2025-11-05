import { useState, useCallback, useMemo } from 'react';
import { useReviewCardStore } from '../../../../store/useReviewCardStore';
import { ReviewCardService } from '../../../../services/reviewCardService';
import { showSuccessToast, showErrorToast } from '../../../../utils/toast';
import type { ReviewCard } from '../../../../schemas/reviewCard.schema';

type SortByType = 'all' | 'backlog' | 'completed' | 'successRate' | 'category';

export function useExamSheetModal() {
  const [selectedCardIds, setSelectedCardIds] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<SortByType>('all');
  const [examTitle, setexamTitle] = useState('Synapse AI');
  const [instruction, setInstruction] = useState('각 질문에 대한 답변을 작성하시오.');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { backlogCards, completedCards } = useReviewCardStore();

  // Combine all review cards
  const allCards = useMemo(() => {
    return [...backlogCards, ...completedCards];
  }, [backlogCards, completedCards]);

  // Sort and filter cards based on sortBy
  const sortedCards = useMemo(() => {
    let cards: ReviewCard[] = [];

    switch (sortBy) {
      case 'backlog':
        cards = backlogCards;
        break;
      case 'completed':
        cards = completedCards;
        break;
      case 'successRate':
        // Sort by success rate ascending (lowest first)
        cards = [...allCards].sort((a, b) => {
          const rateA = a.successRate ?? 0;
          const rateB = b.successRate ?? 0;
          return rateA - rateB;
        });
        break;
      case 'category':
        // Sort by category name alphabetically
        cards = [...allCards].sort((a, b) => {
          return a.category.localeCompare(b.category);
        });
        break;
      case 'all':
      default:
        cards = allCards;
        break;
    }

    return cards;
  }, [sortBy, allCards, backlogCards, completedCards]);

  // Toggle individual card selection
  const handleCardToggle = useCallback((cardId: number) => {
    setSelectedCardIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  }, []);

  // Toggle all cards selection
  const handleToggleAll = useCallback(() => {
    if (selectedCardIds.size === sortedCards.length) {
      // If all selected, deselect all
      setSelectedCardIds(new Set());
    } else {
      // Select all visible cards
      const allIds = new Set(sortedCards.map(card => card.reviewCardId));
      setSelectedCardIds(allIds);
    }
  }, [selectedCardIds.size, sortedCards]);

  // Handle sort change
  const handleSortChange = useCallback((newSortBy: SortByType) => {
    setSortBy(newSortBy);
  }, []);

  // Generate and download PDF
  const handleGeneratePdf = useCallback(async () => {
    if (selectedCardIds.size === 0) {
      setErrorMessage('시험지에 포함할 카드를 선택해주세요');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const reviewCardIds = Array.from(selectedCardIds);

      const blob = await ReviewCardService.generateExamPdf({
        reviewCardIds,
        examTitle: examTitle.trim() || 'Synapse AI',
        instruction: instruction.trim() || '각 질문에 대한 답변을 작성하시오.',
      });

      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `exam_sheet_${timestamp}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(url);

      showSuccessToast('시험지 PDF가 다운로드되었습니다');

      // Reset modal state
      resetModal();
    } catch (error) {
      const errorMsg = error instanceof Error
        ? error.message
        : 'PDF 생성에 실패했습니다. 다시 시도해주세요.';
      setErrorMessage(errorMsg);
      showErrorToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCardIds, examTitle, instruction]);

  // Reset modal state
  const resetModal = useCallback(() => {
    setSelectedCardIds(new Set());
    setSortBy('all');
    setexamTitle('Synapse AI');
    setInstruction('각 질문에 대한 답변을 작성하시오.');
    setIsLoading(false);
    setErrorMessage('');
  }, []);

  return {
    selectedCardIds,
    sortBy,
    examTitle,
    setexamTitle,
    instruction,
    setInstruction,
    isLoading,
    errorMessage,
    sortedCards,
    allCardsCount: allCards.length,
    handleCardToggle,
    handleToggleAll,
    handleSortChange,
    handleGeneratePdf,
    resetModal,
  };
}
