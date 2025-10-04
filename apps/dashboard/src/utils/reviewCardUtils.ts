import type { ReviewCard } from '../schemas/reviewCard.schema';

/**
 * ReviewCard 배열을 정답률 기준으로 정렬합니다.
 *
 * @param cards - 정렬할 ReviewCard 배열
 * @param order - 정렬 순서 ('asc': 오름차순, 'desc': 내림차순)
 * @returns 정렬된 ReviewCard 배열
 */
export const sortBySuccessRate = (
  cards: ReviewCard[],
  order: 'asc' | 'desc' = 'asc'
): ReviewCard[] => {
  return [...cards].sort((a, b) => {
    const rateA = a.successRate ?? 0;
    const rateB = b.successRate ?? 0;

    return order === 'asc'
      ? rateA - rateB  // 낮은 정답률부터 (복습 필요한 순서)
      : rateB - rateA; // 높은 정답률부터
  });
};

/**
 * ReviewCard 배열을 중요도 기준으로 정렬합니다.
 *
 * @param cards - 정렬할 ReviewCard 배열
 * @param order - 정렬 순서 ('asc': 오름차순, 'desc': 내림차순)
 * @returns 정렬된 ReviewCard 배열
 */
export const sortByImportance = (
  cards: ReviewCard[],
  order: 'asc' | 'desc' = 'desc'
): ReviewCard[] => {
  return [...cards].sort((a, b) => {
    return order === 'desc'
      ? b.importance - a.importance  // 높은 중요도부터
      : a.importance - b.importance; // 낮은 중요도부터
  });
};

/**
 * ReviewCard 배열을 카테고리 ID로 필터링합니다.
 *
 * @param cards - 필터링할 ReviewCard 배열
 * @param categoryId - 필터링할 카테고리 ID (null이면 전체 반환)
 * @returns 필터링된 ReviewCard 배열
 */
export const filterByCategory = (
  cards: ReviewCard[],
  categoryId: number | null
): ReviewCard[] => {
  if (categoryId === null) {
    return cards;
  }

  return cards.filter(card => card.categoryId === categoryId);
};
