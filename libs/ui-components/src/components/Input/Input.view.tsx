import React from 'react';
import { InputProps, useInput } from './useInput';

export const InputView = (props: InputProps) => {
  const { inputProps, labelClasses, helperTextClasses } = useInput(props);
  const { label, error, helperText, leftIcon, rightIcon } = props;

  return (
    <div className="w-full">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
            {leftIcon}
          </div>
        )}

        <input
          {...inputProps}
          className={`${inputProps.className} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
            {rightIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <div className={helperTextClasses}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};