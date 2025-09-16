export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'brand' | 'neutral' | 'white';
  className?: string;
  label?: string;
}

export const useSpinner = (props: SpinnerProps) => {
  const {
    size = 'md',
    color = 'brand',
    className = '',
    label = 'Loading...',
  } = props;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4 border-2';
      case 'md':
        return 'h-6 w-6 border-2';
      case 'lg':
        return 'h-8 w-8 border-2';
      case 'xl':
        return 'h-12 w-12 border-4';
      default:
        return 'h-6 w-6 border-2';
    }
  };

 const getColorClasses = () => {
    switch (color) {
      case 'brand':
        return 'border-brand/30 border-t-brand';
      case 'neutral':
        return 'border-neutral-200 border-t-neutral-400';
      case 'white':
        return 'border-white/30 border-t-white';
      default:
        return 'border-brand/30 border-t-brand';
    }
  };

  const spinnerClasses = `animate-spin rounded-full ${getSizeClasses()} ${getColorClasses()} ${className}`;

  return {
    spinnerClasses,
    label,
  };
};