import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from '../../types';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  title: string;
  color: string;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
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
        className={`flex-1 p-4 rounded-lg border-2 border-dashed transition-colors duration-200 ${
          isOver
            ? `${color} border-opacity-100 bg-opacity-10`
            : 'border-gray-200 bg-gray-50'
        }`}
      >
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No tasks in this column</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskColumn;

