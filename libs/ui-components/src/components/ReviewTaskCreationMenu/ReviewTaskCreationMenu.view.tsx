import React from 'react';
import { X } from 'lucide-react'; 

interface ReviewTaskCreationMenuViewProps {
  onClose: () => void;
  selectedTaskType: 'concept' | 'memorization' | 'approach';
  onSelectTaskType: (type: 'concept' | 'memorization' | 'approach') => void;
  onConfirmTaskCreation: () => void;
  taskField: string;
  onTaskFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ReviewTaskCreationMenuView({
  onClose,
  selectedTaskType,
  onSelectTaskType,
  onConfirmTaskCreation,
  taskField,
  onTaskFieldChange,
}: ReviewTaskCreationMenuViewProps) {
  const taskTypeOptions: Array<{ label: string; value: 'concept' | 'memorization' | 'approach'; description: string }> = [
    { label: '원리형', value: 'concept', description: '원리와 개념과 같이 논리적인 설명을 필요로 하는 태스크일 경우' },
    { label: '암기형', value: 'memorization', description: '특정 문제에 대해 암기하고자 하는 태스크일 경우' },
    { label: '접근법', value: 'approach', description: '특정 문제의 조건이나 문제를 보고 어떻게 접근해야하는지 학습한 경우' },
  ];

  const selectedTypeDescription = taskTypeOptions.find(option => option.value === selectedTaskType)?.description;

  return (
    <div className="fixed inset-0 bg-neutral-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white text-text-primary rounded-lg shadow-lg w-full max-w-2xl mx-4 my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-100">
          <h3 className="text-xl font-semibold text-text-primary">태스크 생성</h3>
          <button onClick={onClose} className="p-1 rounded-sm hover:bg-neutral-50 text-text-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Description */}
          <div>
            <p className="text-sm text-text-tertiary mb-2">
              복습하고 싶은 개념이나 알고리즘 분야를 선택하고 질문을 생성하세요.
            </p>
            <p className="text-sm text-text-tertiary">
              태스크 유형과 분야를 설정하면 맞춤형 질문이 생성됩니다.
            </p>
          </div>

          {/* 태스크 유형 선택 */}
          <div>
            <p className="text-sm font-medium text-text-secondary mb-2">태스크 유형</p>
            <p className="text-xs text-text-tertiary mb-2">
              학습하고 싶은 방식에 맞는 유형을 선택하세요.
            </p>
            <div className="flex flex-wrap gap-2">
              {taskTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSelectTaskType(option.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium
                    ${selectedTaskType === option.value
                      ? 'bg-brand text-white'
                      : 'bg-neutral-50 text-text-secondary hover:bg-neutral-100'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {selectedTypeDescription && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-sm text-blue-800">
                  {selectedTypeDescription}
                </p>
              </div>
            )}
          </div>

          {/* 태스크 분야 설정 */}
          <div>
            <p className="text-sm font-medium text-text-secondary mb-2">태스크 분야 설정</p>
            <p className="text-xs text-text-tertiary mb-2">
              복습하고 싶은 구체적인 주제나 알고리즘 분야를 입력하세요.
            </p>
            <input
              type="text"
              value={taskField}
              onChange={onTaskFieldChange}
              placeholder="예: 그래프 알고리즘"
              className="w-full bg-background-primary text-text-primary text-sm px-3 py-2 rounded-md border border-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* 질문 생성하기 버튼 */}
          <div className="flex justify-end pt-4 border-t border-neutral-100">
            <button
              onClick={onConfirmTaskCreation}
              className="px-6 py-2 rounded-md bg-brand hover:bg-brand-light text-white text-base font-medium"
            >
              질문 생성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}