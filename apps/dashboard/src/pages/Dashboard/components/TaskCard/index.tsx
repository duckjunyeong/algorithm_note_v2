// TaskCard/index.tsx
import { useTaskCard } from './useTaskCard';
import { TaskCardView } from './TaskCard.view';
import type { TaskCardViewProps } from './TaskCard.view';

type TaskCardProps = Omit<TaskCardViewProps, 'onMouseEnter' | 'onMouseLeave'>;

const TaskCard = (props : TaskCardProps) => {
  const { handleMouseEnter, handleMouseLeave } = useTaskCard();

  const dummyTags = [
    { label: '중요도', value: `3` },
    { label: '반복주기', value: `3 일` },
    {
      label: '반복 횟수',
      value: `0 회`,
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