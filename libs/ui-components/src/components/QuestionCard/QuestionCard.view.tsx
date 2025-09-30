import { Button } from '../Button';

interface QuestionCardViewProps {
  question: string;
  onEdit: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export function QuestionCardView({ question, onEdit, onDelete, isLoading = false }: QuestionCardViewProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
        {question}
      </p>
      <div className="flex justify-end gap-2">
        <Button
          onClick={onEdit}
          disabled={isLoading}
          size="sm"
          variant="secondary"
        >
          수정하기
        </Button>
        <Button
          onClick={onDelete}
          disabled={isLoading}
          size="sm"
          variant="outline"
        >
          삭제하기
        </Button>
      </div>
    </div>
  );
}