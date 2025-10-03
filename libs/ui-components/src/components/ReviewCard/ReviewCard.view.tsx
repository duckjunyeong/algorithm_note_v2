import { motion, AnimatePresence } from 'framer-motion';
import { FiCircle, FiPlay, FiEye } from 'react-icons/fi';

interface Tag {
  label: string;
  value: string | number;
  backgroundColor?: string;
  textColor?: string;
}

export interface ReviewCardViewProps {
  id: string;
  category: string;
  title: string;
  tags?: Tag[];
  isHovering: boolean;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onButtonClick: () => void;
}

export function ReviewCardView({
  id,
  category,
  title,
  tags,
  isHovering,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onButtonClick,
}: ReviewCardViewProps) {

  console.log('Rendering ReviewCardView:', { id, isActive });
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative flex cursor-pointer flex-col gap-4 rounded-lg border border-neutral-100 bg-background-secondary p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">{id}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-tertiary">{category}</span>
          <FiCircle className="text-text-tertiary" size={16} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-text-primary">{title}</h3>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tags?.map((tag) => (
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

      {/* 호버 시 중앙 버튼 (테스트 시작 또는 결과 보기) */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg"
          >
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onButtonClick();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 rounded-lg px-6 py-3 text-white font-semibold shadow-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isActive ? (
                <>
                  <FiPlay size={20} />
                  테스트 시작
                </>
              ) : (
                <>
                  <FiEye size={20} />
                  결과 보기
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
