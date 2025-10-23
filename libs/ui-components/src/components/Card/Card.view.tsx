import { useCard } from './useCard';
import type { CardProps } from './useCard';

export const CardView = (props: CardProps) => {
  const { cardProps } = useCard(props);
  const { children } = props;

  return (
    <div {...cardProps}>
      {children}
    </div>
  );
};