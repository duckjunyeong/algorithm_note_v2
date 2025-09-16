import { InputHTMLAttributes, ChangeEvent, useState } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const useInput = (props: InputProps) => {
  const {
    label,
    error,
    helperText,
    className = '',
    onChange,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const getInputClasses = () => {
    const baseClasses = 'w-full px-4 py-3 text-sm bg-background-secondary border rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1';

    if (error) {
      return `${baseClasses} border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20 text-text-primary`;
    }

    if (isFocused) {
      return `${baseClasses} border-brand focus:border-brand focus:ring-brand/20 text-text-primary`;
    }

    return `${baseClasses} border-neutral-100 hover:border-neutral-300 text-text-primary ${className}`;
  };

  const getLabelClasses = () => {
    const baseClasses = 'block text-sm font-medium mb-2';
    return error ? `${baseClasses} text-semantic-error` : `${baseClasses} text-text-primary`;
  };

  const getHelperTextClasses = () => {
    const baseClasses = 'text-xs mt-1';
    return error ? `${baseClasses} text-semantic-error` : `${baseClasses} text-text-secondary`;
  };

  return {
    inputProps: {
      ...rest,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      className: getInputClasses(),
    },
    labelClasses: getLabelClasses(),
    helperTextClasses: getHelperTextClasses(),
    isFocused,
    hasError: !!error,
  };
};