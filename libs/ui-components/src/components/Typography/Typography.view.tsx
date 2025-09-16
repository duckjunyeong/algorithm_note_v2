import React from 'react';
import { useTypography } from './useTypography';
import type { TypographyProps } from './useTypography';

export const TypographyView = (props: TypographyProps) => {
  const { elementType, typographyProps } = useTypography(props);
  const { children } = props;

  const Element = elementType as React.ElementType;

  return (
    <Element {...typographyProps}>
      {children}
    </Element>
  );
};