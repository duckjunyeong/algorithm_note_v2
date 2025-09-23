// TaskCard/TaskCard.view.tsx
import type { FC } from 'react';
import { FiCircle } from 'react-icons/fi'; // react-icons 라이브러리 예시

interface Tag {
  label: string;
  value: string | number;
  backgroundColor?: string;
  textColor?: string;
}

export interface TaskCardViewProps {
  id: string;
  type: string;
  title: string;
  description: string;
  tags: Tag[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const TaskCardView = ({
  id,
  type,
  title,
  description,
  tags,
  onMouseEnter,
  onMouseLeave,
} : TaskCardViewProps) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="flex cursor-pointer flex-col gap-4 rounded-lg border border-neutral-100 bg-background-secondary p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">{id}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-tertiary">{type}</span>
          <FiCircle className="text-text-tertiary" size={16} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-text-primary">{title}</h3>
        <div>
          <span className="text-sm font-semibold text-text-primary">요구사항</span>
          <p className="mt-1 text-sm text-text-secondary line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag.label}
            className={`rounded px-2 py-1 text-xs font-medium ${
              tag.backgroundColor || 'bg-neutral-50'
            } ${tag.textColor || 'text-text-secondary'}`}
          >
            {tag.label}: {tag.value}
          </span>
        ))}
      </div>
    </div>
  );
};