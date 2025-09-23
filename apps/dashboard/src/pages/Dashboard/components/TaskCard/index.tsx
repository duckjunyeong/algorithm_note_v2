// TaskCard/index.tsx
import { useTaskCard } from './useTaskCard';
import { TaskCardView } from './TaskCard.view';
import type { TaskCardViewProps } from './TaskCard.view';

type TaskCardProps = Omit<TaskCardViewProps, 'onMouseEnter' | 'onMouseLeave'>;

const TaskCard = (props : TaskCardProps) => {
  const { handleMouseEnter, handleMouseLeave } = useTaskCard();

  const dummyTags = [
    { label: '긴급도', value: 9 },
    { label: '복잡도', value: 6 },
    {
      label: '중요도',
      value: '필수',
      backgroundColor: 'bg-semantic-error/10', // 10% opacity
      textColor: 'text-semantic-error',
    },
  ];

  return (
    <TaskCardView
      {...props}
      tags={props.tags || dummyTags}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default TaskCard;