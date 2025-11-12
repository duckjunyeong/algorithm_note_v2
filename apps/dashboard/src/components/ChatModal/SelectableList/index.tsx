import { SelectableListView } from './SelectableList.view';
import { useSelectableList } from './useSelectableList';

interface SelectableListProps {
  content: string;
  onSelect: (selectedNumbers: number[]) => void;
}

export const SelectableList = ({ content, onSelect }: SelectableListProps) => {
  const {
    listItems,
    selectedItems,
    toggleItem,
    handleComplete,
    hasSelection,
  } = useSelectableList({ content, onSelect });

  return (
    <SelectableListView
      listItems={listItems}
      selectedItems={selectedItems}
      hasSelection={hasSelection}
      onToggleItem={toggleItem}
      onComplete={handleComplete}
    />
  );
};
