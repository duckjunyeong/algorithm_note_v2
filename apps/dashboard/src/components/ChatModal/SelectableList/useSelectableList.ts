import { useState } from 'react';

export interface ListItem {
  number: number;
  text: string;
}

interface UseSelectableListProps {
  content: string;
  onSelect: (selectedNumbers: number[]) => void;
}

export const useSelectableList = ({
  content,
  onSelect,
}: UseSelectableListProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const parseListItems = (text: string): ListItem[] => {
    const items: ListItem[] = [];

    const sectionMatch = text.match(/##\s*✅[^\n]*\n([\s\S]*?)(?=\n\*\*|$)/);
    if (!sectionMatch) return items;

    const listContent = sectionMatch[1];

    const listRegex = /^(\d+)\.\s+(.+)$/gm;
    let match;

    while ((match = listRegex.exec(listContent)) !== null) {
      const number = parseInt(match[1], 10);
      const text = match[2].trim();
      items.push({ number, text });
    }

    return items;
  };

  const listItems = parseListItems(content);

  const toggleItem = (number: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(number)) {
        newSet.delete(number);
      } else {
        newSet.add(number);
      }
      return newSet;
    });
  };

  const handleComplete = () => {
    if (selectedItems.size === 0) {
      return; 
    }

    const sortedNumbers = Array.from(selectedItems).sort((a, b) => a - b);
    onSelect(sortedNumbers);
    setSelectedItems(new Set()); 
  };

  return {
    listItems,
    selectedItems,
    toggleItem,
    handleComplete,
    hasSelection: selectedItems.size > 0,
  };
};
