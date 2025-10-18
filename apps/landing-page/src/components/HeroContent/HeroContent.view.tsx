// HeroContent/HeroContent.view.tsx
import type { FC } from 'react';

interface HeroContentViewProps {
  /** 상단에 표시될 뱃지 텍스트입니다. */
  badgeText: string;
  /** 메인 제목 텍스트입니다. */
  title: string;
  /** 부제목 텍스트입니다. 줄바꿈은 '\n'으로 처리됩니다. */
  description: string;
  /** '무료로 시작하기' 버튼 클릭 핸들러입니다. */
  onStartClick: () => void;
  /** '커뮤니티' 버튼 클릭 핸들러입니다. */
  onCommunityClick: () => void;
}

/**
 * 히어로 섹션의 UI를 렌더링하는 뷰 컴포넌트입니다.
 */
export const HeroContentView: FC<HeroContentViewProps> = ({
  badgeText,
  title,
  description,
  onStartClick,
  onCommunityClick,
}) => {
  return (
    <section className="relative isolate w-full bg-background-primary py-24 sm:py-32">
      {/* 배경 그라데이션 효과 */}
      <div
        className="absolute inset-0 -z-10 transform-gpu overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[80rem] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/20 via-background-primary to-background-primary"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* 메인 제목 */}
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-text-primary sm:text-6xl">
            {title}
          </h1>

          {/* 부제목 */}
          <p className="mt-6 whitespace-pre-line text-lg leading-8 text-text-secondary">
            {description}
          </p>

          {/* CTA 버튼 그룹 */}
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <button
              type="button"
              onClick={onStartClick}
              className="flex items-center gap-2 rounded-md bg-neutral-black px-4 py-2.5 text-sm font-semibold text-text-inverse shadow-sm transition-colors duration-200 hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              시작하기
            </button>
            <button
              type="button"
              onClick={onCommunityClick}
              className="flex items-center gap-2 rounded-md bg-background-secondary px-4 py-2.5 text-sm font-semibold text-text-primary shadow-sm ring-1 ring-inset ring-neutral-100 transition-colors duration-200 hover:bg-neutral-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="M8 17.929A4 4 0 0 1 7.129 18a4 4 0 0 1-2.26-7.252"/><path d="M16 18a4 4 0 0 0-1.871-.871"/></svg>
              커뮤니티
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};