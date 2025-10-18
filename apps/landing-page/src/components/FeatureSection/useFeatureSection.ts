import { useState } from 'react';
import type { IconType } from 'react-icons';
import { BsKanban } from 'react-icons/bs';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FiDownload } from 'react-icons/fi';
import LandingImage from '../../assets/landing_image.jpg';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  icon: IconType;
}

// 아코디언에 표시될 실제 데이터입니다. icon 속성에 react-icons 컴포넌트를 직접 할당합니다.
const accordionItemsData: AccordionItem[] = [
  {
    id: 'workspaces',
    title: '스마트한 복습 자동화',
    content: '지식은 완전히 잊기 직전에 다시 떠올렸을 때 가장 강력하게 뇌에 각인됩니다. 이제 무엇을, 언제 복습해야 할지 고민하지 마세요. 개념을 등록할 때 1일 후, 3일 후, 1주일 후 와 같이 원하는 반복 주기를 설정해두면, 서비스가 최적의 타이밍에 맞춰 자동으로 알려드립니다. 복습 계획의 부담 없이, 가장 중요한 학습에만 집중하세요',
    icon: BsKanban,
  },
  {
    id: 'focus',
    title: 'AI 자동 질문 생성',
    content: '효과적인 복습의 핵심은 배운 내용을 스스로 인출해보는 것입니다. 하지만 매번 좋은 질문을 직접 만드는 것은 번거로운 일이죠. 이제 학습한 내용을 자유롭게 작성하기만 하세요. AI가 그 내용을 분석하여 핵심을 파악하는 질문 리스트를 자동으로 생성해 드립니다. 사용자는 AI가 만든 질문들을 확인하고 원하는 대로 수정하거나 선택하여, 스스로 질문을 만드는 번거로움 없이 곧바로 깊이 있는 아웃풋 훈련을 시작할 수 있습니다.',
    icon: IoIosAddCircleOutline,
  },
  {
    id: 'desktop',
    title: '나의 학습 현황 한눈에 보기',
    content: '나의 노력이 얼마나 쌓이고 있는지 눈으로 직접 확인하며 동기부여를 얻으세요.',
    icon: FiDownload,
  },
];

/**
 * FeatureSection 컴포넌트의 로직과 상태를 관리하는 훅입니다.
 */
export const useFeatureSection = () => {
  const [openId, setOpenId] = useState<string | null>(accordionItemsData[0].id);

  const title = '지식을 연결하고,\n 기억을 완성하는 AI 학습 파트너';
  const description = '자동화된 복습 관리 시스템이 무엇을, 언제공부해야 할지의 고민을 덜어드립니다. Synapse와 함께 진짜 뇌를 사용하는 학습을 시작하고, 당신의 지식을 단단하게 연결해 보세요.';
  const imageUrl = LandingImage;
  const imageAlt = 'Screenshot of the application dashboard showing project management boards.';

  const handleAccordionToggle = (id: string) => {
    setOpenId(prevId => (prevId === id ? null : id));
  };

  return {
    title,
    description,
    imageUrl,
    imageAlt,
    accordionItems: accordionItemsData,
    openId,
    handleAccordionToggle,
  };
};