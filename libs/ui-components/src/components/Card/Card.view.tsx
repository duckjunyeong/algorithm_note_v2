import React from 'react';
import { CardProps, useCard } from './useCard';

export const CardView = (props: CardProps) => {
  const { cardProps } = useCard(props);
  const { children } = props;

  return (
    <div {...cardProps}>
      {children}
    </div>
  );
};