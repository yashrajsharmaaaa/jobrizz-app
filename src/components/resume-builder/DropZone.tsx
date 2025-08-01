import React from 'react';
import { useDrop } from 'react-dnd';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ItemTypes, type DragItem } from './DragDropProvider';

interface DropZoneProps {
  index: number;
  onDrop: (dragIndex: number, dropIndex: number) => void;
  isVisible?: boolean;
  className?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
  index,
  onDrop,
  isVisible = true,
  className = '',
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.RESUME_SECTION,
    drop: (item: DragItem) => {
      onDrop(item.index, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={drop as any}
      className={`
        drop-zone transition-all duration-200 ease-in-out
        ${isActive 
          ? 'h-16 bg-blue-50 border-2 border-dashed border-blue-300' 
          : 'h-2 bg-transparent border-2 border-dashed border-transparent hover:border-gray-200'
        }
        ${canDrop ? 'opacity-100' : 'opacity-0'}
        rounded-lg flex items-center justify-center
        ${className}
      `}
    >
      {isActive && (
        <div className="flex items-center space-x-2 text-blue-600">
          <PlusIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Drop section here</span>
        </div>
      )}
    </div>
  );
};