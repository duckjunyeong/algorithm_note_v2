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
    title: 'Project workspaces',
    content: 'Organize projects into list, grid, and board views. Customize workspaces into stages that match your writing process.',
    icon: BsKanban,
  },
  {
    id: 'focus',
    title: 'Deep focus modes',
    content: 'Eliminate distractions and concentrate on your writing with customizable focus modes. Tailor your environment to your creative needs.',
    icon: IoIosAddCircleOutline,
  },
  {
    id: 'desktop',
    title: 'Desktop app',
    content: 'Access all your projects and tools seamlessly with our native desktop applications for both Mac and Windows.',
    icon: FiDownload,
  },
];

/**
 * FeatureSection 컴포넌트의 로직과 상태를 관리하는 훅입니다.
 */
export const useFeatureSection = () => {
  const [openId, setOpenId] = useState<string | null>(accordionItemsData[0].id);

  const title = 'Focused writing meets project management';
  const description = 'Glide between focused writing, document collaboration, and project management. Strut brings your tools together to keep your writing process moving forward.';
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