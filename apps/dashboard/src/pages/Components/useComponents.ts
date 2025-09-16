import { useState } from 'react';

export const useComponents = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('button');

  const components = [
    { id: 'button', name: 'Button', description: 'Interactive button component with multiple variants' },
    { id: 'card', name: 'Card', description: 'Container component for grouping related content' },
    { id: 'input', name: 'Input', description: 'Form input component with validation support' },
    { id: 'typography', name: 'Typography', description: 'Text component with consistent styling' },
  ];

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  return {
    selectedComponent,
    components,
    handleComponentSelect,
  };
};