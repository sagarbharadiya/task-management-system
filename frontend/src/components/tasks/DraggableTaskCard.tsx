import React, { useState, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Task, TaskPriority } from "../../types";
import { Edit, Trash2, User, GripVertical, Check, X } from "lucide-react";

interface DraggableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdate?: (
    taskId: string,
    updates: {
      title?: string;
      description?: string;
      priority?: TaskPriority;
      status?: string;
    }
  ) => Promise<void>;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onUpdate,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [isEditingDescription]);

  // Handle title save
  const handleTitleSave = async () => {
    if (editedTitle.trim() && editedTitle !== task.title && onUpdate) {
      try {
        await onUpdate(task.id, {
          title: editedTitle.trim(),
          description: task.description,
          priority: task.priority,
          status: task.status,
        });
        setIsEditingTitle(false);
      } catch (error) {
        setEditedTitle(task.title); // Revert on error
        setIsEditingTitle(false);
      }
    } else {
      setIsEditingTitle(false);
    }
  };

  // Handle title cancel
  const handleTitleCancel = () => {
    setEditedTitle(task.title);
    setIsEditingTitle(false);
  };

  // Handle description save
  const handleDescriptionSave = async () => {
    if (
      editedDescription.trim() &&
      editedDescription !== task.description &&
      onUpdate
    ) {
      try {
        await onUpdate(task.id, {
          title: task.title,
          description: editedDescription.trim(),
          priority: task.priority,
          status: task.status,
        });
        setIsEditingDescription(false);
      } catch (error) {
        setEditedDescription(task.description); // Revert on error
        setIsEditingDescription(false);
      }
    } else {
      setIsEditingDescription(false);
    }
  };

  // Handle description cancel
  const handleDescriptionCancel = () => {
    setEditedDescription(task.description);
    setIsEditingDescription(false);
  };

  // Handle priority save
  const handlePrioritySave = async () => {
    if (editedPriority !== task.priority && onUpdate) {
      try {
        await onUpdate(task.id, {
          title: task.title,
          description: task.description,
          priority: editedPriority,
          status: task.status,
        });
        setIsEditingPriority(false);
      } catch (error) {
        setEditedPriority(task.priority); // Revert on error
        setIsEditingPriority(false);
      }
    } else {
      setIsEditingPriority(false);
    }
  };

  // Handle priority cancel
  const handlePriorityCancel = () => {
    setEditedPriority(task.priority);
    setIsEditingPriority(false);
  };

  // Handle key presses
  const handleKeyPress = (
    e: React.KeyboardEvent,
    type: "title" | "description" | "priority"
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (type === "title") handleTitleSave();
      else if (type === "description") handleDescriptionSave();
      else handlePrioritySave();
    } else if (e.key === "Escape") {
      if (type === "title") handleTitleCancel();
      else if (type === "description") handleDescriptionCancel();
      else handlePriorityCancel();
    }
  };
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        task,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.HIGH:
        return "bg-red-100 text-red-800 border-red-200";
      case TaskPriority.MEDIUM:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case TaskPriority.LOW:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 ${
        isDragging ? "opacity-50 rotate-3 shadow-lg" : "hover:shadow-md"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start space-x-2 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex-1">
            {isEditingTitle ? (
              <div className="flex items-center space-x-1">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, "title")}
                  className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1"
                />
                <button
                  onClick={handleTitleSave}
                  className="p-1 text-green-600 hover:text-green-700 transition-colors"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={handleTitleCancel}
                  className="p-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <h3
                className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer hover:bg-gray-50 rounded px-1 py-1 -mx-1"
                onClick={() => onUpdate && setIsEditingTitle(true)}
                title="Click to edit title"
              >
                {task.title}
              </h3>
            )}
          </div>
        </div>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit task details"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-3">
        {isEditingDescription ? (
          <div className="space-y-1">
            <textarea
              ref={descriptionInputRef}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, "description")}
              className="w-full text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
              placeholder="Enter task description"
            />
            <div className="flex items-center space-x-1">
              <button
                onClick={handleDescriptionSave}
                className="p-1 text-green-600 hover:text-green-700 transition-colors"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={handleDescriptionCancel}
                className="p-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <p
            className="text-sm text-gray-600 line-clamp-3 cursor-pointer hover:bg-gray-50 rounded px-1 py-1 -mx-1"
            onClick={() => onUpdate && setIsEditingDescription(true)}
            title="Click to edit description"
          >
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isEditingPriority ? (
            <div className="flex items-center space-x-1">
              <select
                value={editedPriority}
                onChange={(e) =>
                  setEditedPriority(e.target.value as TaskPriority)
                }
                onKeyDown={(e) => handleKeyPress(e, "priority")}
                className="text-xs font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={TaskPriority.LOW}>LOW</option>
                <option value={TaskPriority.MEDIUM}>MEDIUM</option>
                <option value={TaskPriority.HIGH}>HIGH</option>
              </select>
              <button
                onClick={handlePrioritySave}
                className="p-1 text-green-600 hover:text-green-700 transition-colors"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={handlePriorityCancel}
                className="p-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${getPriorityColor(
                task.priority
              )}`}
              onClick={() => onUpdate && setIsEditingPriority(true)}
              title="Click to edit priority"
            >
              {task.priority}
            </span>
          )}
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <User className="w-3 h-3 mr-1" />
          {task.assignee ? task.assignee.username : 'Unassigned'}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-400">
        Created: {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default DraggableTaskCard;
