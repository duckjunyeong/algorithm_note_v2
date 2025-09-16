import { ButtonHTMLAttributes, MouseEvent } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const useButton = (props: ButtonProps) => {
  const {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    onClick,
    ...rest
  } = props;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) return;
    onClick?.(event);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-brand text-white hover:bg-brand-dark focus:ring-brand/20';
      case 'secondary':
        return 'bg-background-secondary text-text-primary border border-neutral-100 hover:bg-neutral-50 focus:ring-brand/20';
      case 'outline':
        return 'bg-transparent text-brand border border-brand hover:bg-brand/5 focus:ring-brand/20';
      case 'ghost':
        return 'bg-transparent text-text-primary hover:bg-neutral-50 focus:ring-neutral-100/50';
      default:
        return 'bg-brand text-white hover:bg-brand-dark focus:ring-brand/20';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm font-medium';
      case 'md':
        return 'px-6 py-3 text-sm font-medium';
      case 'lg':
        return 'px-8 py-4 text-base font-medium';
      default:
        return 'px-6 py-3 text-sm font-medium';
    }
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-md border-0 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const buttonClasses = `${baseClasses} ${getVariantClasses()} ${getSizeClasses()}`;

  return {
    buttonProps: {
      ...rest,
      disabled: disabled || isLoading,
      onClick: handleClick,
      className: buttonClasses,
    },
    isLoading,
    variant,
    size,
  };
};