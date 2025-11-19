import { useState, useEffect } from 'react';
import { ConfirmModal } from '../ConfirmModal';

interface Question {
  reviewQuestionId: number;
  questionText: string;
}

interface QuestionItem extends Question {
  isEditing: boolean;
}

export interface UseReviewCardSettingsModalProps {
  reviewCardId: number;
  title: string;
  initialQuestions: Question[];
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

export function useReviewCardSettingsModal({
  initialQuestions,
  initialRepetitionCycle,
  initialImportance,
  initialUrl,
  initialCategoryId,
  categories,
  isLoadingCategories,
  categoryError,
  onSave,
  onDeleteCard,
  onClose,
  onAddCategoryClick,
}: UseReviewCardSettingsModalProps) {
  const [questions, setQuestions] = useState<QuestionItem[]>(
    initialQuestions.map(q => ({ ...q, isEditing: false }))
  );
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [repetitionCycle, setRepetitionCycle] = useState(initialRepetitionCycle);
  const [importance, setImportance] = useState(initialImportance);
  const [url, setUrl] = useState(initialUrl);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initialCategoryId);
  const [isSaving, setIsSaving] = useState(false);

  const [deletedQuestionIds, setDeletedQuestionIds] = useState<number[]>([]);
  const [updatedQuestions, setUpdatedQuestions] = useState<Map<number, string>>(new Map());
  const [addedQuestions, setAddedQuestions] = useState<string[]>([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setQuestions(initialQuestions.map(q => ({ ...q, isEditing: false })));
  }, [initialQuestions]);

  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(prev => prev.filter(q => q.reviewQuestionId !== questionId));
    setDeletedQuestionIds(prev => [...prev, questionId]);
  };

  const handleStartEditQuestion = (questionId: number, text: string) => {
    setEditingQuestionId(questionId);
    setEditingQuestionText(text);
  };

  const handleSaveEditQuestion = (questionId: number) => {
    if (!editingQuestionText.trim()) return;

    setQuestions(prev =>
      prev.map(q =>
        q.reviewQuestionId === questionId
          ? { ...q, questionText: editingQuestionText.trim() }
          : q
      )
    );

    setUpdatedQuestions(prev => {
      const updated = new Map(prev);
      updated.set(questionId, editingQuestionText.trim());
      return updated;
    });

    setEditingQuestionId(null);
    setEditingQuestionText('');
  };

  const handleEditQuestionTextChange = (text: string) => {
    setEditingQuestionText(text);
  };

  const handleNewQuestionTextChange = (text: string) => {
    setNewQuestionText(text);
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;

    const tempId = -Date.now();
    setQuestions(prev => [
      ...prev,
      {
        reviewQuestionId: tempId,
        questionText: newQuestionText.trim(),
        isEditing: false,
      },
    ]);

    setAddedQuestions(prev => [...prev, newQuestionText.trim()]);
    setNewQuestionText('');
  };

  const handleRepetitionCycleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepetitionCycle(Number(e.target.value));
  };

  const handleImportanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportance(Number(e.target.value));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const questionUpdates = Array.from(updatedQuestions.entries()).map(([id, text]) => ({
        reviewQuestionId: id,
        questionText: text,
      }));

      const addedQuestionsData = addedQuestions.map(text => ({
        questionText: text,
      }));

      await onSave({
        categoryId: selectedCategoryId,
        importance,
        reviewCycle: repetitionCycle,
        url,
        deletedQuestionIds,
        questionUpdates,
        addedQuestions: addedQuestionsData,
      });

      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCardClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteCard();
      onClose();
    } catch (error) {
      console.error('Failed to delete card:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
  };

  return {
    questions,
    editingQuestionId,
    editingQuestionText,
    newQuestionText,
    repetitionCycle,
    importance,
    url,
    selectedCategoryId,
    categories,
    isLoadingCategories,
    categoryError,
    isSaving,
    isDeleteConfirmOpen,
    isDeleting,
    handleDeleteQuestion,
    handleStartEditQuestion,
    handleSaveEditQuestion,
    handleEditQuestionTextChange,
    handleNewQuestionTextChange,
    handleAddQuestion,
    handleRepetitionCycleChange,
    handleImportanceChange,
    handleUrlChange,
    handleCategorySelect,
    handleAddCategoryClick: onAddCategoryClick,
    handleSave,
    handleDeleteCardClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleClose: onClose,
  };
}
