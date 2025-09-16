import type { HTMLAttributes, ElementType } from 'react';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'warning' | 'error' | 'info';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  as?: ElementType;
}

export const useTypography = (props: TypographyProps) => {
  const {
    variant = 'body1',
    color = 'primary',
    weight,
    align = 'left',
    as,
    className = '',
    ...rest
  } = props;

  const getElementType = (): ElementType => {
    if (as) return as;

    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return variant;
      case 'caption':
      case 'overline':
        return 'span';
      default:
        return 'p';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'h1':
        return 'text-5xl font-bold leading-tight';
      case 'h2':
        return 'text-4xl font-bold leading-tight';
      case 'h3':
        return 'text-3xl font-semibold leading-snug';
      case 'h4':
        return 'text-2xl font-semibold leading-snug';
      case 'h5':
        return 'text-xl font-medium leading-normal';
      case 'h6':
        return 'text-lg font-medium leading-normal';
      case 'body1':
        return 'text-base leading-normal';
      case 'body2':
        return 'text-sm leading-normal';
      case 'caption':
        return 'text-xs leading-normal';
      case 'overline':
        return 'text-xs font-medium uppercase tracking-wide leading-normal';
      default:
        return 'text-base leading-normal';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-text-primary';
      case 'secondary':
        return 'text-text-secondary';
      case 'tertiary':
        return 'text-text-tertiary';
      case 'inverse':
        return 'text-text-inverse';
      case 'success':
        return 'text-semantic-success';
      case 'warning':
        return 'text-semantic-warning';
      case 'error':
        return 'text-semantic-error';
      case 'info':
        return 'text-semantic-info';
      default:
        return 'text-text-primary';
    }
  };

  const getWeightClasses = () => {
    if (!weight) return '';

    switch (weight) {
      case 'light':
        return 'font-light';
      case 'normal':
        return 'font-normal';
      case 'medium':
        return 'font-medium';
      case 'semibold':
        return 'font-semibold';
      case 'bold':
        return 'font-bold';
      default:
        return '';
    }
  };

  const getAlignClasses = () => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const typographyClasses = `${getVariantClasses()} ${getColorClasses()} ${getWeightClasses()} ${getAlignClasses()} ${className}`.trim();

  return {
    elementType: getElementType(),
    typographyProps: {
      ...rest,
      className: typographyClasses,
    },
    variant,
    color,
    weight,
    align,
  };
};