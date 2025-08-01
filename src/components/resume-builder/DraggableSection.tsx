import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Bars3Icon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ItemTypes, useDragDrop, type DragItem } from './DragDropProvider';
import type { ResumeSection } from '../../types/resume';

interface DraggableSectionProps {
  section: ResumeSection;
  index: number;
  onToggleVisibility: (sectionId: string) => void;
  onSectionClick?: (sectionId: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  index,
  onToggleVisibility,
  onSectionClick,
  children,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { moveSection, setIsDragging } = useDragDrop();

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: ItemTypes.RESUME_SECTION,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveSection(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.RESUME_SECTION,
    item: (): DragItem => {
      setIsDragging(true);
      return {
        type: ItemTypes.RESUME_SECTION,
        id: section.id,
        index,
        section,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      setIsDragging(false);
    },
  });

  const opacity = isDragging ? 0.4 : 1;

  // Connect drag and drop refs
  const dragDropRef = drag(drop(ref));

  const handleSectionClick = () => {
    if (onSectionClick) {
      onSectionClick(section.id);
    }
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility(section.id);
  };

  return (
    <div
      ref={preview as any}
      style={{ opacity }}
      className={`draggable-section ${className}`}
      data-handler-id={handlerId}
    >
      <div
        ref={dragDropRef as any}
        className={`
          relative bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-blue-500 shadow-lg transform rotate-2' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }
          ${!section.isVisible ? 'opacity-60' : ''}
        `}
        onClick={handleSectionClick}
      >
        {/* Drag Handle */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
          <div
            className={`
              drag-handle p-2 rounded cursor-grab active:cursor-grabbing
              transition-colors duration-200
              ${isDragging 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'
              }
            `}
            title="Drag to reorder section"
          >
            <Bars3Icon className="w-4 h-4" />
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between p-4 pl-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>
              {!section.isVisible && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Hidden
                </span>
              )}
              {section.isCustom && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                  Custom
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Visibility Toggle */}
            <button
              onClick={handleToggleVisibility}
              className={`
                p-2 rounded-lg transition-colors duration-200
                ${section.isVisible 
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }
              `}
              title={section.isVisible ? 'Hide section' : 'Show section'}
            >
              {section.isVisible ? (
                <EyeIcon className="w-5 h-5" />
              ) : (
                <EyeSlashIcon className="w-5 h-5" />
              )}
            </button>

            {/* Section Order Indicator */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-600">
              {index + 1}
            </div>
          </div>
        </div>

        {/* Drop Zone Indicators */}
        {isDragging && (
          <>
            <div className="absolute -top-1 left-0 right-0 h-2 bg-blue-500 rounded-t-lg opacity-50" />
            <div className="absolute -bottom-1 left-0 right-0 h-2 bg-blue-500 rounded-b-lg opacity-50" />
          </>
        )}

        {/* Section Content */}
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
};