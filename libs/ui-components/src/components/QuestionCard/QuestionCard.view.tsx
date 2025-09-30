import { Button } from '../Button';

interface QuestionCardViewProps {
  question: string;
  onRegister: () => void;
  isLoading?: boolean;
}

export function QuestionCardView({ question, onRegister, isLoading = false }: QuestionCardViewProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
        {question}
      </p>
      <div className="flex justify-end">
        <Button
          onClick={onRegister}
          disabled={isLoading}
          size="sm"
          variant="primary"
        >
          {isLoading ? '처리 중...' : '등록하기'}
        </Button>
      </div>
    </div>
  );
}