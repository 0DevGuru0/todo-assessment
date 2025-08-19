import React from "react";
import { useAppSelector } from "../hooks/redux";

export const NewProgressIndicator: React.FC = () => {
  const { todos } = useAppSelector((state) => state.newTodo);

  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const progressPercentage =
    totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  if (totalTodos === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
        <span className="text-sm font-medium text-gray-600">
          {completedTodos} of {totalTodos} completed
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{
            width: `${progressPercentage}%`,
            background:
              progressPercentage === 100
                ? "linear-gradient(90deg, #10b981, #059669)"
                : "linear-gradient(90deg, #3b82f6, #1d4ed8)",
          }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {progressPercentage.toFixed(0)}% complete
        </span>
        {progressPercentage === 100 && (
          <span className="text-green-600 font-medium animate-bounce">
            🎉 All done!
          </span>
        )}
        {progressPercentage > 0 && progressPercentage < 100 && (
          <span className="text-blue-600 font-medium">Keep going! 💪</span>
        )}
      </div>

      {/* Motivational messages */}
      {progressPercentage >= 75 && progressPercentage < 100 && (
        <div className="mt-3 p-2 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-700 text-center">
            You're almost there! Just a few more tasks to go. 🚀
          </p>
        </div>
      )}

      {progressPercentage >= 50 && progressPercentage < 75 && (
        <div className="mt-3 p-2 bg-indigo-50 rounded-md">
          <p className="text-xs text-indigo-700 text-center">
            Great progress! You're halfway there. ⭐
          </p>
        </div>
      )}
    </div>
  );
};
