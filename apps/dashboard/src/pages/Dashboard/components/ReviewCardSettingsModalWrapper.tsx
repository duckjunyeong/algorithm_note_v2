import { useQuery } from '@tanstack/react-query';
import { ReviewCardSettingsModal } from '../../../../../../libs/ui-components/src';
import { ReviewCardService } from '../../../services/reviewCardService';

interface ReviewCardSettingsModalWrapperProps {
  reviewCardId: number;
  title: string;
  initialRepetitionCycle: number;
  initialImportance: number;
  initialUrl: string;
  initialCategoryId: number | null;
  categories: Array<{ categoryId: number; name: string; color: string }>;
  isLoadingCategories: boolean;
  categoryError: string | null;
  onSave: (data: {
    categoryId: number | null;
    importance: number;
    reviewCycle: number;
    url: string;
    deletedQuestionIds: number[];
    questionUpdates: Array<{
      reviewQuestionId: number;
      questionText: string;
    }>;
    addedQuestions: Array<{
      questionText: string;
    }>;
  }) => Promise<void>;
  onDeleteCard: () => Promise<void>;
  onClose: () => void;
  onAddCategoryClick: () => void;
}

export function ReviewCardSettingsModalWrapper(props: ReviewCardSettingsModalWrapperProps) {
  const { data: resultData, isLoading } = useQuery({
    queryKey: ['reviewCardResults', props.reviewCardId],
    queryFn: () => ReviewCardService.getReviewCardResults(props.reviewCardId),
    enabled: !!props.reviewCardId,
  });

  const questions = resultData?.questions.map(q => ({
    reviewQuestionId: q.reviewQuestionId,
    questionText: q.questionText,
  })) || [];

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <ReviewCardSettingsModal
      {...props}
      initialQuestions={questions}
    />
  );
}
