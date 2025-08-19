import React, { forwardRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { toggleTodo, removeTodo } from "../store/newTodoSlice";
import type { Todo } from "../types/todo";
import { TrashIcon, Bars3Icon, CheckIcon } from "@heroicons/react/24/outline";

interface TodoWithOrder extends Todo {
  order: number;
}

interface PresentationalTodoItemProps {
  todo: TodoWithOrder;
  isDragging?: boolean;
  isOverlay?: boolean;
  style?: React.CSSProperties;
  dragHandleProps?: Record<string, any>;
}

export const PresentationalTodoItem = forwardRef<
  HTMLDivElement,
  PresentationalTodoItemProps
>(
  (
    { todo, isDragging = false, isOverlay = false, style, dragHandleProps },
    ref
  ) => {
    const dispatch = useDispatch<AppDispatch>();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleToggleComplete = () => {
      dispatch(toggleTodo(todo.id));
    };

    const handleDeleteClick = () => {
      setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
      dispatch(removeTodo(todo.id));
      setShowDeleteConfirm(false);
    };

    const handleCancelDelete = () => {
      setShowDeleteConfirm(false);
    };

    return (
      <div
        ref={ref}
        style={style}
        data-testid="todo-item"
        data-todo-id={todo.id}
        className={`
        group relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 transition-all duration-200
        ${isDragging ? "shadow-lg scale-105 rotate-1" : "hover:shadow-md"}
        ${isOverlay ? "shadow-2xl scale-105 rotate-2" : ""}
        ${todo.completed ? "bg-gray-50" : ""}
        animate-slide-up
      `}
      >
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Bars3Icon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </div>

        <div className="flex items-center space-x-3 ml-6">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            className={`
            flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
            ${
              todo.completed
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-green-400 hover:bg-green-50"
            }
            cursor-pointer
          `}
          >
            {todo.completed && <CheckIcon className="w-4 h-4" />}
          </button>

          {/* Todo Text */}
          <div className="flex-1 min-w-0">
            <p
              onClick={handleToggleComplete}
              className={`
              text-sm cursor-pointer transition-all duration-200
              ${
                todo.completed
                  ? "line-through text-gray-500"
                  : "text-gray-900 hover:text-gray-700"
              }
            `}
            >
              {todo.todo}
            </p>

            {/* Metadata */}
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-400">ID: {todo.id}</span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-gray-400">Order: {todo.order}</span>
              {todo.completed && (
                <>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-green-600 font-medium">
                    Completed
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Delete Button */}
          <div className="flex-shrink-0">
            {showDeleteConfirm ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleConfirmDelete}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={handleDeleteClick}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200"
                title="Delete todo"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
