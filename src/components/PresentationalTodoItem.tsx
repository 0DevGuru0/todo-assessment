import React, { forwardRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { editTodo } from "../store/newTodoSlice";
import { useTodoMutations } from "../hooks/useTodoMutations";
import { ConfirmationModal } from "./ConfirmationModal";
import type { TodoWithOrder } from "../types/todo";
import {
  TrashIcon,
  Bars3Icon,
  CheckIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface PresentationalTodoItemProps {
  todo: TodoWithOrder;
  isDragging?: boolean;
  isOverlay?: boolean;
  style?: React.CSSProperties;
  dragHandleProps?: Record<string, unknown>;
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
    const { toggleTodo, deleteTodo, updateTodo, isDeleting, isUpdating } =
      useTodoMutations();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.todo);

    const handleToggleComplete = () => {
      // Toggle the current state
      toggleTodo({
        id: todo.id,
        completed: !todo.completed,
        todoText: todo.todo,
      });
    };

    const handleDeleteClick = () => {
      setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
      deleteTodo({ id: todo.id, todoText: todo.todo });
      setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
      setShowDeleteModal(false);
    };

    const handleEditClick = () => {
      setIsEditing(true);
      setEditText(todo.todo);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editText.trim() && editText !== todo.todo) {
        dispatch(editTodo({ id: todo.id, text: editText.trim() }));
        updateTodo({
          id: todo.id,
          updates: { todo: editText.trim() },
          todoText: todo.todo,
        });
      }
      setIsEditing(false);
    };

    const handleEditCancel = () => {
      setIsEditing(false);
      setEditText(todo.todo);
    };

    const handleEditKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleEditCancel();
      }
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

          {/* Todo Text or Edit Input */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <form
                onSubmit={handleEditSubmit}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  disabled={isUpdating}
                />
                <button
                  type="submit"
                  disabled={!editText.trim() || isUpdating}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  disabled={isUpdating}
                  className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </form>
            ) : (
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
            )}

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

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="opacity-0 group-hover:opacity-100 p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-all duration-200"
                title="Edit todo"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200"
              title="Delete todo"
              disabled={isDeleting || isEditing}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Todo"
          message={`Are you sure you want to delete "${todo.todo}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={isDeleting}
        />
      </div>
    );
  }
);
