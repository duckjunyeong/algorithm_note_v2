import React from 'react';
import { useSpinner } from './useSpinner';
import type { SpinnerProps } from './useSpinner';

export const SpinnerView = (props: SpinnerProps) => {
  const { spinnerClasses, label } = useSpinner(props);

  return (
    <div className="inline-flex items-center" role="status" aria-label={label}>
      <div className={spinnerClasses} />
      <span className="sr-only">{label}</span>
    </div>
  );
};