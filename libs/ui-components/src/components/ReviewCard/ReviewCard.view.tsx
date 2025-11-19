import { motion, AnimatePresence } from 'framer-motion';
import { FiCircle, FiPlay, FiEye, FiExternalLink, FiSettings } from 'react-icons/fi';

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
  url?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onButtonClick: () => void;
  onOpenUrl: () => void;
  onSettingsClick: () => void;
}

export function ReviewCardView({
  id,
  category,
  title,
  tags,
  isHovering,
  isActive,
  url,
  onMouseEnter,
  onMouseLeave,
  onButtonClick,
  onOpenUrl,
  onSettingsClick,
}: ReviewCardViewProps) {

  console.log('Rendering ReviewCardView:', { id, isActive });
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative flex cursor-pointer flex-col gap-4 rounded-lg border border-neutral-100 bg-background-secondary p-4 shadow-sm transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02]"
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

      {/* 호버 시 중앙 버튼 (테스트 시작 또는 결과 보기 + 문제 바로가기) */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center gap-3 bg-black bg-opacity-30 rounded-lg"
          >
            {/* 기존 버튼 (테스트 시작 또는 결과 보기) */}
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onButtonClick();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-white font-semibold shadow-sm bg-neutral-800 hover:bg-neutral-900 transition-colors"
            >
              {isActive ? (
                <>
                  <FiPlay size={16} />
                  테스트 시작
                </>
              ) : (
                <>
                  <FiEye size={16} />
                  결과 보기
                </>
              )}
            </motion.button>

            {/* 문제 바로가기 버튼 (url이 있을 때만 표시) */}
            {url && (
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenUrl();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-lg px-4 py-2 bg-neutral-700 hover:bg-neutral-800 text-white font-semibold shadow-sm transition-colors"
              >
                <FiExternalLink size={16} />
                문제 바로가기
              </motion.button>
            )}

            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSettingsClick();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 bg-neutral-700 hover:bg-neutral-800 text-white font-semibold shadow-sm transition-colors"
            >
              <FiSettings size={16} />
              설정
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
