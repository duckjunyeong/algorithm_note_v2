import React from 'react';
import { TypographyProps, useTypography } from './useTypography';

export const TypographyView = (props: TypographyProps) => {
  const { elementType, typographyProps } = useTypography(props);
  const { children } = props;

  const Element = elementType;

  return (
    <Element {...typographyProps}>
      {children}
    </Element>
  );
};