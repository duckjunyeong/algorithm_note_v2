// FeatureSection/FeatureSection.view.tsx
import type { FC } from 'react';
import type { AccordionItem } from './useFeatureSection';

interface FeatureSectionViewProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  accordionItems: AccordionItem[];
  openId: string | null;
  onAccordionToggle: (id: string) => void;
}

/**
 * 서비스의 핵심 기능을 소개하는 섹션의 UI 뷰 컴포넌트입니다.
 */
export const FeatureSectionView: FC<FeatureSectionViewProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  accordionItems,
  openId,
  onAccordionToggle,
}) => {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          
          {/* 왼쪽: 텍스트 콘텐츠 */}
          <div className="lg:pt-4">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {title}
            </h2>
            <p className="mt-6 text-lg leading-8 text-text-secondary">
              {description}
            </p>
            
            {/* 아코디언 */}
            <dl className="mt-10 space-y-4 divide-y divide-neutral-300/60 border-t border-neutral-300/60">
              {accordionItems.map(item => (
                <div key={item.id} className="pt-4">
                  <dt>
                    <button
                      onClick={() => onAccordionToggle(item.id)}
                      className="flex w-full items-start justify-between text-left text-text-primary"
                    >
                      <span className="flex items-center gap-4 text-base font-semibold leading-7">
                        <item.icon className="h-5 w-5 flex-none text-brand" aria-hidden="true" />
                        {item.title}
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        {openId === item.id ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6"><path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
                        )}
                      </span>
                    </button>
                  </dt>
                  {/* 아코디언 내용: transition으로 부드러운 효과 적용 */}
                  <dd className={`overflow-hidden transition-all duration-300 ease-in-out ${openId === item.id ? 'mt-2 max-h-40' : 'max-h-0'}`}>
                    <p className="pl-9 text-base leading-7 text-text-secondary">
                      {item.content}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 오른쪽: 이미지 */}
          <div>
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full max-w-none rounded-xl shadow-xl ring-1 ring-neutral-900/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};