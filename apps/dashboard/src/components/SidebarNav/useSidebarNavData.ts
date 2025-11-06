// SidebarNav/useSidebarNavData.ts
import type { IconType } from 'react-icons';
import {
  FiHome,
  FiCheckSquare,
  FiList,
  FiRepeat,
  FiCreditCard,
  FiTrendingUp,
  FiBriefcase,
  FiDollarSign,
  FiFileText,
  FiRotateCcw,
  FiBookOpen,
} from 'react-icons/fi';

export interface NavItem {
  id: string;
  label: string;
  icon: IconType;
  badge?: number;
  isDropdown?: boolean;
}

const mainNavItems: NavItem[] = [
  { id: 'card-task', label: 'Card Task', icon: FiCreditCard },
  { id: 'logic-task', label: 'Logic Task', icon: FiCheckSquare },
];

const workflowItems: NavItem[] = [];

/**
 * SidebarNav에 필요한 메뉴 데이터를 제공하는 훅
 */
export const useSidebarNavData = () => {
  return {
    mainNavItems,
    workflowItems,
  };  
};