import React, { createContext, useContext, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import type { ResumeSection } from '../../types/resume';

// Drag and Drop Types
export const ItemTypes = {
  RESUME_SECTION: 'resume_section',
} as const;

export interface DragItem {
  type: string;
  id: string;
  index: number;
  section: ResumeSection;
}

export interface DropResult {
  dropEffect: string;
  targetIndex: number;
}

// Context for drag and drop operations
interface DragDropContextType {
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: React.ReactNode;
  onSectionMove: (fromIndex: number, toIndex: number) => void;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
  onSectionMove,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    onSectionMove(dragIndex, hoverIndex);
  }, [onSectionMove]);

  const contextValue: DragDropContextType = {
    moveSection,
    isDragging,
    setIsDragging,
  };

  // Use touch backend for mobile devices, HTML5 backend for desktop
  const backend = isMobile ? TouchBackend : HTML5Backend;
  const backendOptions = isMobile ? {
    enableMouseEvents: true,
    delayTouchStart: 200,
    delayMouseStart: 0,
  } : {};

  return (
    <DndProvider backend={backend} options={backendOptions}>
      <DragDropContext.Provider value={contextValue}>
        {children}
      </DragDropContext.Provider>
    </DndProvider>
  );
};