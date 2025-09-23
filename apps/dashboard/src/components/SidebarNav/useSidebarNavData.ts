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
  { id: 'home', label: 'Home', icon: FiHome },
  { id: 'tasks', label: 'Tasks', icon: FiCheckSquare, badge: 10 },
  { id: 'transactions', label: 'Transactions', icon: FiList },
  { id: 'payments', label: 'Payments', icon: FiRepeat, isDropdown: true },
  { id: 'cards', label: 'Cards', icon: FiCreditCard },
  { id: 'capital', label: 'Capital', icon: FiTrendingUp },
  { id: 'accounts', label: 'Accounts', icon: FiBriefcase, isDropdown: true },
];

const workflowItems: NavItem[] = [
  { id: 'bill-pay', label: 'Bill Pay', icon: FiDollarSign },
  { id: 'invoicing', label: 'Invoicing', icon: FiFileText, isDropdown: true },
  { id: 'reimbursements', label: 'Reimbursements', icon: FiRotateCcw },
  { id: 'accounting', label: 'Accounting', icon: FiBookOpen },
];

/**
 * SidebarNav에 필요한 메뉴 데이터를 제공하는 훅
 */
export const useSidebarNavData = () => {
  return {
    mainNavItems,
    workflowItems,
  };  
};