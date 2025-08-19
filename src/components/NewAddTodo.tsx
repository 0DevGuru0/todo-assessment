import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { addTodo } from "../store/newTodoSlice";
import { PlusIcon } from "@heroicons/react/24/outline";

export function NewAddTodo() {
  const [text, setText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    setIsAdding(true);

    try {
      // Generate a unique ID for the new todo
      // In a real app, this would come from the backend
      const newId = Date.now();

      dispatch(
        addTodo({
          id: newId,
          todo: text.trim(),
          userId: 1, // Default user ID
        })
      );

      setText("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 animate-slide-up">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Todo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              disabled={isAdding}
              className={`
                w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2
                ${
                  isAdding
                    ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white"
                }
                placeholder-gray-400
              `}
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!text.trim() || isAdding}
              className={`
                absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200
                ${
                  !text.trim() || isAdding
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                }
              `}
            >
              {isAdding ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              ) : (
                <PlusIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>
              {text.length}/200 characters
            </span>
            <span>
              Press Enter to add
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
