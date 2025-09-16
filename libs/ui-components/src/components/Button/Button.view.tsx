import React from 'react';
import { ButtonProps, useButton } from './useButton';

export const ButtonView = (props: ButtonProps) => {
  const { buttonProps, isLoading } = useButton(props);
  const { children, leftIcon, rightIcon } = props;

  return (
    <button {...buttonProps}>
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
          Loading...
        </div>
      ) : (
        <div className="flex items-center">
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </div>
      )}
    </button>
  );
};