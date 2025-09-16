import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const useCard = (props: CardProps) => {
  const {
    variant = 'default',
    padding = 'md',
    className = '',
    ...rest
  } = props;

  const getVariantClasses = () => {
    switch (variant) {
      case 'default':
        return 'bg-background-secondary border border-neutral-100';
      case 'elevated':
        return 'bg-background-secondary shadow-sm border border-neutral-50';
      case 'outlined':
        return 'bg-background-secondary border-2 border-neutral-100';
      default:
        return 'bg-background-secondary border border-neutral-100';
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return 'p-0';
      case 'sm':
        return 'p-4';
      case 'md':
        return 'p-6';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const baseClasses = 'rounded-md';
  const cardClasses = `${baseClasses} ${getVariantClasses()} ${getPaddingClasses()} ${className}`;

  return {
    cardProps: {
      ...rest,
      className: cardClasses,
    },
    variant,
    padding,
  };
};