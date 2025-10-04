import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from '../../types';
import DraggableTaskCard from './DraggableTaskCard';

interface DraggableTaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask?: (taskId: string, updates: { title?: string; description?: string; priority?: import('../../types').TaskPriority }) => Promise<void>;
  title: string;
  color: string;
}

const DraggableTaskColumn: React.FC<DraggableTaskColumnProps> = ({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  onUpdateTask,
  title,
  color,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 p-4 rounded-lg border-2 border-dashed transition-colors duration-200 min-h-[400px] ${
          isOver
            ? `${color} border-opacity-100 bg-opacity-10`
            : 'border-gray-200 bg-gray-50'
        }`}
      >
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No tasks in this column</p>
              <p className="text-xs mt-1">Drag tasks here to move them</p>
            </div>
          ) : (
            tasks.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onUpdate={onUpdateTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DraggableTaskColumn;

